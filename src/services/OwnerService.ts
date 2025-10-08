import pool from '../lib/database'
import { v4 as uuidv4 } from 'uuid'

export interface Owner {
  id: string
  matricula: string
  nome: string
  area: string
  createdAt?: string
  updatedAt?: string
}

export class OwnerService {
  static async findAll(): Promise<Owner[]> {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          id,
          matricula,
          nome,
          area,
          created_at as createdAt,
          updated_at as updatedAt
        FROM owners
        ORDER BY nome
      `)
      return rows as Owner[]
    } catch (error) {
      console.error('Erro ao buscar proprietários:', error)
      throw error
    }
  }

  static async findById(id: string): Promise<Owner | null> {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          id,
          matricula,
          nome,
          area,
          created_at as createdAt,
          updated_at as updatedAt
        FROM owners
        WHERE id = ?
      `, [id])
      
      const owners = rows as Owner[]
      return owners.length > 0 ? owners[0] : null
    } catch (error) {
      console.error('Erro ao buscar proprietário por ID:', error)
      throw error
    }
  }

  static async create(data: Omit<Owner, 'id' | 'createdAt' | 'updatedAt'>): Promise<Owner> {
    try {
      const id = uuidv4()
      await pool.execute(`
        INSERT INTO owners (id, matricula, nome, area)
        VALUES (?, ?, ?, ?)
      `, [id, data.matricula, data.nome, data.area])
      
      const created = await this.findById(id)
      return created!
    } catch (error) {
      console.error('Erro ao criar proprietário:', error)
      throw error
    }
  }

  static async update(id: string, data: Omit<Owner, 'id' | 'createdAt' | 'updatedAt'>): Promise<Owner> {
    try {
      await pool.execute(`
        UPDATE owners SET
          matricula = ?, nome = ?, area = ?
        WHERE id = ?
      `, [data.matricula, data.nome, data.area, id])
      
      const updated = await this.findById(id)
      return updated!
    } catch (error) {
      console.error('Erro ao atualizar proprietário:', error)
      throw error
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await pool.execute('DELETE FROM owners WHERE id = ?', [id])
    } catch (error) {
      console.error('Erro ao deletar proprietário:', error)
      throw error
    }
  }

  // Buscar aplicações de um proprietário
  static async getOwnerApplications(ownerId: string): Promise<any[]> {
    try {
      const [rows] = await pool.execute(`
        SELECT a.*, oa.relationship_type 
        FROM applications a
        JOIN owner_applications oa ON a.id = oa.application_id
        WHERE oa.owner_id = ?
      `, [ownerId])
      
      return rows as any[]
    } catch (error) {
      console.error('Erro ao buscar aplicações do proprietário:', error)
      throw error
    }
  }

  // Criar relacionamento proprietário-aplicação
  static async createOwnerApplicationRelationship(
    ownerId: string, 
    applicationId: string, 
    relationshipType: 'owner' | 'developer' = 'owner'
  ): Promise<void> {
    try {
      await pool.execute(`
        INSERT INTO owner_applications (owner_id, application_id, relationship_type)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE relationship_type = VALUES(relationship_type)
      `, [ownerId, applicationId, relationshipType])
    } catch (error) {
      console.error('Erro ao criar relacionamento proprietário-aplicação:', error)
      throw error
    }
  }

  // Remover relacionamento proprietário-aplicação
  static async removeOwnerApplicationRelationship(ownerId: string, applicationId: string): Promise<void> {
    try {
      await pool.execute(`
        DELETE FROM owner_applications 
        WHERE owner_id = ? AND application_id = ?
      `, [ownerId, applicationId])
    } catch (error) {
      console.error('Erro ao remover relacionamento proprietário-aplicação:', error)
      throw error
    }
  }
}