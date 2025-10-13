import pool from '../lib/database'
import { v4 as uuidv4 } from 'uuid'

export interface Capability {
  id: string
  name: string
  description?: string
  criticality: string
  coverageScore: number
  parentId?: string
}

export class CapabilityService {
  static async findAll(): Promise<Capability[]> {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          id,
          name,
          description,
          criticality,
          coverage_score as coverageScore,
          parent_id as parentId
        FROM capabilities
        ORDER BY name
      `)
      return rows as Capability[]
    } catch (error) {
      console.error('Erro ao buscar capacidades:', error)
      throw error
    }
  }

  static async findById(id: string): Promise<Capability | null> {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          id,
          name,
          description,
          criticality,
          coverage_score as coverageScore,
          parent_id as parentId
        FROM capabilities
        WHERE id = ?
      `, [id])
      
      const capabilities = rows as Capability[]
      return capabilities.length > 0 ? capabilities[0] : null
    } catch (error) {
      console.error('Erro ao buscar capacidade por ID:', error)
      throw error
    }
  }

  static async create(data: Omit<Capability, 'id'>): Promise<Capability> {
    try {
      const id = uuidv4()
      await pool.execute(`
        INSERT INTO capabilities (id, name, description, criticality, coverage_score, parent_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [id, data.name, data.description || null, data.criticality, data.coverageScore, data.parentId || null])
      
      const created = await this.findById(id)
      return created!
    } catch (error) {
      console.error('Erro ao criar capacidade:', error)
      throw error
    }
  }

  static async update(id: string, data: Omit<Capability, 'id'>): Promise<Capability> {
    try {
      await pool.execute(`
        UPDATE capabilities SET
          name = ?, description = ?, criticality = ?, coverage_score = ?, parent_id = ?
        WHERE id = ?
      `, [data.name, data.description || null, data.criticality, data.coverageScore, data.parentId || null, id])
      
      const updated = await this.findById(id)
      return updated!
    } catch (error) {
      console.error('Erro ao atualizar capacidade:', error)
      throw error
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await pool.execute('DELETE FROM capabilities WHERE id = ?', [id])
    } catch (error) {
      console.error('Erro ao deletar capacidade:', error)
      throw error
    }
  }
}