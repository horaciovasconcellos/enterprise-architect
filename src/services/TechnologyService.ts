import pool from '../lib/database'
import { v4 as uuidv4 } from 'uuid'

export interface Technology {
  id: string
  name: string
  description?: string
  category?: string
  maturityLevel?: string
  adoptionScore: number
  strategicFit?: string
  version?: string
  vendor?: string
  licenseType?: string
  supportLevel?: string
  deploymentType?: string
}

export class TechnologyService {
  static async findAll(): Promise<Technology[]> {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          id,
          name,
          description,
          category,
          maturity_level as maturityLevel,
          adoption_score as adoptionScore,
          strategic_fit as strategicFit,
          version,
          vendor,
          license_type as licenseType,
          support_level as supportLevel,
          deployment_type as deploymentType
        FROM technologies
        ORDER BY name
      `)
      return rows as Technology[]
    } catch (error) {
      console.error('Erro ao buscar tecnologias:', error)
      throw error
    }
  }

  static async findById(id: string): Promise<Technology | null> {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          id,
          name,
          description,
          category,
          maturity_level as maturityLevel,
          adoption_score as adoptionScore,
          strategic_fit as strategicFit,
          version,
          vendor,
          license_type as licenseType,
          support_level as supportLevel,
          deployment_type as deploymentType
        FROM technologies
        WHERE id = ?
      `, [id])
      
      const technologies = rows as Technology[]
      return technologies.length > 0 ? technologies[0] : null
    } catch (error) {
      console.error('Erro ao buscar tecnologia por ID:', error)
      throw error
    }
  }

  static async create(data: Omit<Technology, 'id'>): Promise<Technology> {
    try {
      const id = uuidv4()
      await pool.execute(`
        INSERT INTO technologies (id, name, description, category, maturity_level, adoption_score, strategic_fit, version, vendor, license_type, support_level, deployment_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        id, 
        data.name, 
        data.description || null, 
        data.category || null, 
        data.maturityLevel || null, 
        data.adoptionScore, 
        data.strategicFit || null,
        data.version || null,
        data.vendor || null,
        data.licenseType || null,
        data.supportLevel || null,
        data.deploymentType || null
      ])
      
      const created = await this.findById(id)
      return created!
    } catch (error) {
      console.error('Erro ao criar tecnologia:', error)
      throw error
    }
  }

  static async update(id: string, data: Omit<Technology, 'id'>): Promise<Technology> {
    try {
      await pool.execute(`
        UPDATE technologies SET
          name = ?, 
          description = ?, 
          category = ?, 
          maturity_level = ?, 
          adoption_score = ?, 
          strategic_fit = ?,
          version = ?,
          vendor = ?,
          license_type = ?,
          support_level = ?,
          deployment_type = ?
        WHERE id = ?
      `, [
        data.name, 
        data.description || null, 
        data.category || null, 
        data.maturityLevel || null, 
        data.adoptionScore, 
        data.strategicFit || null,
        data.version || null,
        data.vendor || null,
        data.licenseType || null,
        data.supportLevel || null,
        data.deploymentType || null,
        id
      ])
      
      const updated = await this.findById(id)
      return updated!
    } catch (error) {
      console.error('Erro ao atualizar tecnologia:', error)
      throw error
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await pool.execute('DELETE FROM technologies WHERE id = ?', [id])
    } catch (error) {
      console.error('Erro ao deletar tecnologia:', error)
      throw error
    }
  }
}