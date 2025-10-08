import pool from '../lib/database'
import { v4 as uuidv4 } from 'uuid'

export interface Interface {
  id: string
  sourceApp: string
  targetApp: string
  interfaceType: string
  frequency: string
  description?: string
}

export class InterfaceService {
  static async findAll(): Promise<Interface[]> {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          id,
          source_app as sourceApp,
          target_app as targetApp,
          interface_type as interfaceType,
          frequency,
          description
        FROM interfaces
        ORDER BY source_app, target_app
      `)
      return rows as Interface[]
    } catch (error) {
      console.error('Erro ao buscar interfaces:', error)
      throw error
    }
  }

  static async findById(id: string): Promise<Interface | null> {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          id,
          source_app as sourceApp,
          target_app as targetApp,
          interface_type as interfaceType,
          frequency,
          description
        FROM interfaces
        WHERE id = ?
      `, [id])
      
      const interfaces = rows as Interface[]
      return interfaces.length > 0 ? interfaces[0] : null
    } catch (error) {
      console.error('Erro ao buscar interface por ID:', error)
      throw error
    }
  }

  static async create(data: Omit<Interface, 'id'>): Promise<Interface> {
    try {
      const id = uuidv4()
      await pool.execute(`
        INSERT INTO interfaces (id, source_app, target_app, interface_type, frequency, description)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [id, data.sourceApp, data.targetApp, data.interfaceType, data.frequency, data.description || null])
      
      const created = await this.findById(id)
      return created!
    } catch (error) {
      console.error('Erro ao criar interface:', error)
      throw error
    }
  }

  static async update(id: string, data: Omit<Interface, 'id'>): Promise<Interface> {
    try {
      await pool.execute(`
        UPDATE interfaces SET
          source_app = ?, target_app = ?, interface_type = ?, frequency = ?, description = ?
        WHERE id = ?
      `, [data.sourceApp, data.targetApp, data.interfaceType, data.frequency, data.description || null, id])
      
      const updated = await this.findById(id)
      return updated!
    } catch (error) {
      console.error('Erro ao atualizar interface:', error)
      throw error
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await pool.execute('DELETE FROM interfaces WHERE id = ?', [id])
    } catch (error) {
      console.error('Erro ao deletar interface:', error)
      throw error
    }
  }
}