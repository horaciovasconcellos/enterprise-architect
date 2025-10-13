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
      return rows as Skill[]
    } catch (error) {
      console.error('Error finding skills:', error)
      throw error
    }
  }

  static async findById(id: string): Promise<Skill | null> {
    try {
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
      if (skills.length === 0) return null

      const skill = skills[0]

      // Buscar tecnologias associadas
      skill.technologies = await this.getTechnologies(id)
      
      // Buscar desenvolvedores associados
      skill.developers = await this.getDevelopers(id)

      return skill
    } catch (error) {
      console.error('Error finding skill by id:', error)
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
      
      return rows as SkillTechnology[]
    } catch (error) {
      console.error('Error getting skill technologies:', error)
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
      
      return rows as SkillDeveloper[]
    } catch (error) {
      console.error('Error getting skill developers:', error)
      throw error
    }
  }

  static async create(skill: Omit<Skill, 'id'>): Promise<Skill> {
    const connection = await pool.getConnection()
    
    try {
      await connection.beginTransaction()

      const skillId = uuidv4()
      
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
        for (const tech of skill.technologies) {
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
        for (const dev of skill.developers) {
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

      const createdSkill = await this.findById(skillId)
      return createdSkill!
    } catch (error) {
      await connection.rollback()
      console.error('Error creating skill:', error)
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
