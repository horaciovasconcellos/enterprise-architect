import pool from '../lib/database'
import { v4 as uuidv4 } from 'uuid'

export interface Skill {
  id: string
  name: string
  code: string
  description?: string
  guidanceNotes?: string
  levelDescription?: string
  technologies?: SkillTechnology[]
  developers?: SkillDeveloper[]
}

export interface SkillTechnology {
  id?: string
  technologyId: string
  technologyName?: string
  proficiencyLevel: number
  startDate?: string
  endDate?: string
}

export interface SkillDeveloper {
  id?: string
  ownerId: string
  ownerName?: string
  proficiencyLevel: number
  certificationDate?: string
  notes?: string
}

export class SkillService {
  static async findAll(): Promise<Skill[]> {
    try {
      console.log('🔍 SkillService.findAll - Buscando todas as skills')
      
      const [rows] = await pool.execute(`
        SELECT 
          id,
          name,
          code,
          description,
          guidance_notes as guidanceNotes,
          level_description as levelDescription
        FROM skills
        ORDER BY name
      `)
      
      const skills = rows as Skill[]
      console.log(`📊 SkillService.findAll - Encontradas ${skills.length} skills`)

      // Buscar tecnologias e desenvolvedores para cada skill
      for (const skill of skills) {
        skill.technologies = await this.getTechnologies(skill.id)
        skill.developers = await this.getDevelopers(skill.id)
        
        console.log(`  ✅ Skill "${skill.name}": ${skill.technologies.length} tecnologias, ${skill.developers.length} desenvolvedores`)
      }

      return skills
    } catch (error) {
      console.error('❌ Error finding skills:', error)
      throw error
    }
  }

  static async findById(id: string): Promise<Skill | null> {
    try {
      console.log(`🔍 SkillService.findById - Buscando skill: ${id}`)
      
      const [rows] = await pool.execute(
        `SELECT 
          id,
          name,
          code,
          description,
          guidance_notes as guidanceNotes,
          level_description as levelDescription
        FROM skills
        WHERE id = ?`,
        [id]
      )
      
      const skills = rows as Skill[]
      if (skills.length === 0) {
        console.log(`⚠️  SkillService.findById - Skill não encontrada: ${id}`)
        return null
      }

      const skill = skills[0]
      console.log(`📊 SkillService.findById - Skill encontrada: "${skill.name}"`)

      // Buscar tecnologias associadas
      skill.technologies = await this.getTechnologies(id)
      
      // Buscar desenvolvedores associados
      skill.developers = await this.getDevelopers(id)

      console.log(`  ✅ Skill completa: ${skill.technologies.length} tecnologias, ${skill.developers.length} desenvolvedores`)

      return skill
    } catch (error) {
      console.error('❌ Error finding skill by id:', error)
      throw error
    }
  }

  static async getTechnologies(skillId: string): Promise<SkillTechnology[]> {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          st.id,
          st.technology_id as technologyId,
          t.name as technologyName,
          st.proficiency_level as proficiencyLevel,
          DATE_FORMAT(st.start_date, '%Y-%m-%d') as startDate,
          DATE_FORMAT(st.end_date, '%Y-%m-%d') as endDate
        FROM skill_technologies st
        LEFT JOIN technologies t ON st.technology_id = t.id
        WHERE st.skill_id = ?
        ORDER BY t.name
      `, [skillId])
      
      console.log(`    🔧 getTechnologies(${skillId}): ${(rows as any[]).length} tecnologias encontradas`)
      
      return rows as SkillTechnology[]
    } catch (error) {
      console.error('❌ Error getting skill technologies:', error)
      throw error
    }
  }

  static async getDevelopers(skillId: string): Promise<SkillDeveloper[]> {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          sd.id,
          sd.owner_id as ownerId,
          o.nome as ownerName,
          sd.proficiency_level as proficiencyLevel,
          DATE_FORMAT(sd.certification_date, '%Y-%m-%d') as certificationDate,
          sd.notes
        FROM skill_developers sd
        LEFT JOIN owners o ON sd.owner_id = o.id
        WHERE sd.skill_id = ?
        ORDER BY o.nome
      `, [skillId])
      
      console.log(`    👨‍💻 getDevelopers(${skillId}): ${(rows as any[]).length} desenvolvedores encontrados`)
      
      return rows as SkillDeveloper[]
    } catch (error) {
      console.error('❌ Error getting skill developers:', error)
      throw error
    }
  }

  static async create(skill: Omit<Skill, 'id'>): Promise<Skill> {
    const connection = await pool.getConnection()
    
    try {
      await connection.beginTransaction()

      const skillId = uuidv4()
      
      console.log('🔵 Criando skill:', {
        skillId,
        name: skill.name,
        code: skill.code,
        technologiesCount: skill.technologies?.length || 0,
        developersCount: skill.developers?.length || 0
      })
      
      // Inserir skill
      await connection.execute(
        `INSERT INTO skills (id, name, code, description, guidance_notes, level_description)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          skillId,
          skill.name,
          skill.code,
          skill.description || null,
          skill.guidanceNotes || null,
          skill.levelDescription || null
        ]
      )

      // Inserir tecnologias associadas
      if (skill.technologies && skill.technologies.length > 0) {
        console.log('🔵 Inserindo tecnologias:', skill.technologies)
        for (const tech of skill.technologies) {
          if (!tech.technologyId || tech.technologyId === '') {
            console.warn('⚠️  Tecnologia sem ID, pulando:', tech)
            continue
          }
          await connection.execute(
            `INSERT INTO skill_technologies (id, skill_id, technology_id, proficiency_level, start_date, end_date)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              uuidv4(),
              skillId,
              tech.technologyId,
              tech.proficiencyLevel,
              tech.startDate || null,
              tech.endDate || null
            ]
          )
        }
      }

      // Inserir desenvolvedores associados
      if (skill.developers && skill.developers.length > 0) {
        console.log('🔵 Inserindo desenvolvedores:', skill.developers)
        for (const dev of skill.developers) {
          if (!dev.ownerId || dev.ownerId === '') {
            console.warn('⚠️  Desenvolvedor sem ID, pulando:', dev)
            continue
          }
          await connection.execute(
            `INSERT INTO skill_developers (id, skill_id, owner_id, proficiency_level, certification_date, notes)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              uuidv4(),
              skillId,
              dev.ownerId,
              dev.proficiencyLevel,
              dev.certificationDate || null,
              dev.notes || null
            ]
          )
        }
      }

      await connection.commit()
      console.log('✅ Skill criada com sucesso:', skillId)

      const createdSkill = await this.findById(skillId)
      return createdSkill!
    } catch (error) {
      await connection.rollback()
      console.error('❌ Error creating skill:', error)
      throw error
    } finally {
      connection.release()
    }
  }

  static async update(id: string, skill: Partial<Skill>): Promise<Skill> {
    const connection = await pool.getConnection()
    
    try {
      await connection.beginTransaction()

      // Atualizar skill
      await connection.execute(
        `UPDATE skills 
         SET name = ?, 
             code = ?,
             description = ?,
             guidance_notes = ?,
             level_description = ?
         WHERE id = ?`,
        [
          skill.name,
          skill.code,
          skill.description || null,
          skill.guidanceNotes || null,
          skill.levelDescription || null,
          id
        ]
      )

      // Atualizar tecnologias (delete e reinsert)
      await connection.execute('DELETE FROM skill_technologies WHERE skill_id = ?', [id])
      
      if (skill.technologies && skill.technologies.length > 0) {
        for (const tech of skill.technologies) {
          await connection.execute(
            `INSERT INTO skill_technologies (id, skill_id, technology_id, proficiency_level, start_date, end_date)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              uuidv4(),
              id,
              tech.technologyId,
              tech.proficiencyLevel,
              tech.startDate || null,
              tech.endDate || null
            ]
          )
        }
      }

      // Atualizar desenvolvedores (delete e reinsert)
      await connection.execute('DELETE FROM skill_developers WHERE skill_id = ?', [id])
      
      if (skill.developers && skill.developers.length > 0) {
        for (const dev of skill.developers) {
          await connection.execute(
            `INSERT INTO skill_developers (id, skill_id, owner_id, proficiency_level, certification_date, notes)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
              uuidv4(),
              id,
              dev.ownerId,
              dev.proficiencyLevel,
              dev.certificationDate || null,
              dev.notes || null
            ]
          )
        }
      }

      await connection.commit()

      const updatedSkill = await this.findById(id)
      return updatedSkill!
    } catch (error) {
      await connection.rollback()
      console.error('Error updating skill:', error)
      throw error
    } finally {
      connection.release()
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      // O CASCADE vai deletar automaticamente as relações
      await pool.execute('DELETE FROM skills WHERE id = ?', [id])
    } catch (error) {
      console.error('Error deleting skill:', error)
      throw error
    }
  }
}
