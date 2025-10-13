import pool from '../lib/database'
import { v4 as uuidv4 } from 'uuid'

export interface OwnerApplicationRelationship {
  id?: string
  ownerId: string
  applicationId: string
  relationshipType: 'owner' | 'developer'
  createdAt?: string
  updatedAt?: string
}

export interface EnrichedRelationship extends OwnerApplicationRelationship {
  ownerName?: string
  ownerMatricula?: string
  applicationName?: string
}

export class RelationshipService {
  static async findAll(): Promise<EnrichedRelationship[]> {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          oa.owner_id as ownerId,
          oa.application_id as applicationId,
          oa.relationship_type as relationshipType,
          o.nome as ownerName,
          o.matricula as ownerMatricula,
          a.name as applicationName
        FROM owner_applications oa
        LEFT JOIN owners o ON oa.owner_id = o.id
        LEFT JOIN applications a ON oa.application_id = a.id
        ORDER BY o.nome, a.name
      `)
      return rows as EnrichedRelationship[]
    } catch (error) {
      console.error('Erro ao buscar relacionamentos:', error)
      throw error
    }
  }

  static async findByOwner(ownerId: string): Promise<EnrichedRelationship[]> {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          oa.owner_id as ownerId,
          oa.application_id as applicationId,
          oa.relationship_type as relationshipType,
          o.nome as ownerName,
          o.matricula as ownerMatricula,
          a.name as applicationName
        FROM owner_applications oa
        LEFT JOIN owners o ON oa.owner_id = o.id
        LEFT JOIN applications a ON oa.application_id = a.id
        WHERE oa.owner_id = ?
        ORDER BY a.name
      `, [ownerId])
      return rows as EnrichedRelationship[]
    } catch (error) {
      console.error('Erro ao buscar relacionamentos do proprietário:', error)
      throw error
    }
  }

  static async findByApplication(applicationId: string): Promise<EnrichedRelationship[]> {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          oa.owner_id as ownerId,
          oa.application_id as applicationId,
          oa.relationship_type as relationshipType,
          o.nome as ownerName,
          o.matricula as ownerMatricula,
          a.name as applicationName
        FROM owner_applications oa
        LEFT JOIN owners o ON oa.owner_id = o.id
        LEFT JOIN applications a ON oa.application_id = a.id
        WHERE oa.application_id = ?
        ORDER BY o.nome
      `, [applicationId])
      return rows as EnrichedRelationship[]
    } catch (error) {
      console.error('Erro ao buscar relacionamentos da aplicação:', error)
      throw error
    }
  }

  static async create(data: Omit<OwnerApplicationRelationship, 'id' | 'createdAt' | 'updatedAt'>): Promise<OwnerApplicationRelationship> {
    try {
      // Check if relationship already exists
      const [existing] = await pool.execute(`
        SELECT owner_id, application_id, relationship_type 
        FROM owner_applications 
        WHERE owner_id = ? AND application_id = ? AND relationship_type = ?
      `, [data.ownerId, data.applicationId, data.relationshipType])
      
      if ((existing as any[]).length > 0) {
        throw new Error('Relacionamento já existe')
      }

      await pool.execute(`
        INSERT INTO owner_applications (owner_id, application_id, relationship_type)
        VALUES (?, ?, ?)
      `, [data.ownerId, data.applicationId, data.relationshipType])
      
      // Return the created relationship
      const [created] = await pool.execute(`
        SELECT 
          owner_id as ownerId,
          application_id as applicationId,
          relationship_type as relationshipType
        FROM owner_applications 
        WHERE owner_id = ? AND application_id = ? AND relationship_type = ?
      `, [data.ownerId, data.applicationId, data.relationshipType])
      
      return (created as OwnerApplicationRelationship[])[0]
    } catch (error) {
      console.error('Erro ao criar relacionamento:', error)
      throw error
    }
  }

  static async delete(ownerId: string, applicationId: string, relationshipType: string): Promise<void> {
    try {
      await pool.execute(`
        DELETE FROM owner_applications 
        WHERE owner_id = ? AND application_id = ? AND relationship_type = ?
      `, [ownerId, applicationId, relationshipType])
    } catch (error) {
      console.error('Erro ao deletar relacionamento:', error)
      throw error
    }
  }

  static async deleteByOwner(ownerId: string): Promise<void> {
    try {
      await pool.execute(`
        DELETE FROM owner_applications WHERE owner_id = ?
      `, [ownerId])
    } catch (error) {
      console.error('Erro ao deletar relacionamentos do proprietário:', error)
      throw error
    }
  }

  static async deleteByApplication(applicationId: string): Promise<void> {
    try {
      await pool.execute(`
        DELETE FROM owner_applications WHERE application_id = ?
      `, [applicationId])
    } catch (error) {
      console.error('Erro ao deletar relacionamentos da aplicação:', error)
      throw error
    }
  }
}