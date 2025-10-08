import pool from '../lib/database'
import { v4 as uuidv4 } from 'uuid'

export interface Process {
  id: string
  name: string
  description?: string
  criticality: string
  efficiencyScore: number
  automationLevel?: string
}

export class ProcessService {
  static async findAll(): Promise<Process[]> {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          id,
          name,
          description,
          criticality,
          efficiency_score as efficiencyScore,
          automation_level as automationLevel
        FROM processes
        ORDER BY name
      `)
      return rows as Process[]
    } catch (error) {
      console.error('Erro ao buscar processos:', error)
      throw error
    }
  }

  static async findById(id: string): Promise<Process | null> {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          id,
          name,
          description,
          criticality,
          efficiency_score as efficiencyScore,
          automation_level as automationLevel
        FROM processes
        WHERE id = ?
      `, [id])
      
      const processes = rows as Process[]
      return processes.length > 0 ? processes[0] : null
    } catch (error) {
      console.error('Erro ao buscar processo por ID:', error)
      throw error
    }
  }

  static async create(data: Omit<Process, 'id'>): Promise<Process> {
    try {
      const id = uuidv4()
      await pool.execute(`
        INSERT INTO processes (id, name, description, criticality, efficiency_score, automation_level)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [id, data.name, data.description || null, data.criticality, data.efficiencyScore, data.automationLevel || null])
      
      const created = await this.findById(id)
      return created!
    } catch (error) {
      console.error('Erro ao criar processo:', error)
      throw error
    }
  }

  static async update(id: string, data: Omit<Process, 'id'>): Promise<Process> {
    try {
      await pool.execute(`
        UPDATE processes SET
          name = ?, description = ?, criticality = ?, efficiency_score = ?, automation_level = ?
        WHERE id = ?
      `, [data.name, data.description || null, data.criticality, data.efficiencyScore, data.automationLevel || null, id])
      
      const updated = await this.findById(id)
      return updated!
    } catch (error) {
      console.error('Erro ao atualizar processo:', error)
      throw error
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await pool.execute('DELETE FROM processes WHERE id = ?', [id])
    } catch (error) {
      console.error('Erro ao deletar processo:', error)
      throw error
    }
  }
}