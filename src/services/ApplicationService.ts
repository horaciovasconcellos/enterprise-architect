import pool from '../lib/database'
import { v4 as uuidv4 } from 'uuid'

export interface Application {
  id: string
  name: string
  description?: string
  lifecyclePhase: string
  criticality: string
  hostingType?: string
  healthScore: number
  technicalFit?: string
  functionalFit?: string
  estimatedCost?: number
  currency?: string
  relatedCapabilities?: string[]
  relatedProcesses?: string[]
  relatedTechnologies?: string[]
  relatedApplications?: string[]
}

export class ApplicationService {
  // Buscar todas as aplicações
  static async findAll(): Promise<Application[]> {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          id,
          name,
          description,
          lifecycle_phase as lifecyclePhase,
          criticality,
          hosting_type as hostingType,
          health_score as healthScore,
          technical_fit as technicalFit,
          functional_fit as functionalFit,
          estimated_cost as estimatedCost,
          currency,
          created_at,
          updated_at
        FROM applications
        ORDER BY name
      `)

      const applications = rows as any[]
      
      // Para cada aplicação, buscar os relacionamentos
      for (const app of applications) {
        app.relatedCapabilities = await this.getRelatedCapabilities(app.id)
        app.relatedProcesses = await this.getRelatedProcesses(app.id)
        app.relatedTechnologies = await this.getRelatedTechnologies(app.id)
        app.relatedApplications = await this.getRelatedApplications(app.id)
      }

      return applications
    } catch (error) {
      console.error('Erro ao buscar aplicações:', error)
      throw error
    }
  }

  // Buscar aplicação por ID
  static async findById(id: string): Promise<Application | null> {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          id,
          name,
          description,
          lifecycle_phase as lifecyclePhase,
          criticality,
          hosting_type as hostingType,
          health_score as healthScore,
          technical_fit as technicalFit,
          functional_fit as functionalFit,
          estimated_cost as estimatedCost,
          currency,
          created_at,
          updated_at
        FROM applications
        WHERE id = ?
      `, [id])

      const applications = rows as any[]
      if (applications.length === 0) return null

      const app = applications[0]
      app.relatedCapabilities = await this.getRelatedCapabilities(app.id)
      app.relatedProcesses = await this.getRelatedProcesses(app.id)
      app.relatedTechnologies = await this.getRelatedTechnologies(app.id)
      app.relatedApplications = await this.getRelatedApplications(app.id)

      return app
    } catch (error) {
      console.error('Erro ao buscar aplicação por ID:', error)
      throw error
    }
  }

  // Criar nova aplicação
  static async create(data: Omit<Application, 'id'>): Promise<Application> {
    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()

      const id = uuidv4()
      
      // Inserir aplicação (converter undefined para null)
      await connection.execute(`
        INSERT INTO applications (
          id, name, description, lifecycle_phase, criticality, hosting_type,
          health_score, technical_fit, functional_fit, estimated_cost, currency
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        id, data.name, data.description || null, data.lifecyclePhase, data.criticality,
        data.hostingType || null, data.healthScore, data.technicalFit || null, data.functionalFit || null,
        data.estimatedCost || null, data.currency || null
      ])

      // Inserir relacionamentos
      if (data.relatedCapabilities?.length) {
        await this.insertCapabilityRelationships(connection, id, data.relatedCapabilities)
      }
      if (data.relatedProcesses?.length) {
        await this.insertProcessRelationships(connection, id, data.relatedProcesses)
      }
      if (data.relatedTechnologies?.length) {
        await this.insertTechnologyRelationships(connection, id, data.relatedTechnologies)
      }
      if (data.relatedApplications?.length) {
        await this.insertApplicationRelationships(connection, id, data.relatedApplications)
      }

      await connection.commit()
      
      const createdApp = await this.findById(id)
      return createdApp!
    } catch (error) {
      await connection.rollback()
      console.error('Erro ao criar aplicação:', error)
      throw error
    } finally {
      connection.release()
    }
  }

  // Atualizar aplicação
  static async update(id: string, data: Omit<Application, 'id'>): Promise<Application> {
    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()

      // Atualizar aplicação (converter undefined para null)
      await connection.execute(`
        UPDATE applications SET
          name = ?, description = ?, lifecycle_phase = ?, criticality = ?, hosting_type = ?,
          health_score = ?, technical_fit = ?, functional_fit = ?, estimated_cost = ?, currency = ?
        WHERE id = ?
      `, [
        data.name, data.description || null, data.lifecyclePhase, data.criticality,
        data.hostingType || null, data.healthScore, data.technicalFit || null, data.functionalFit || null,
        data.estimatedCost || null, data.currency || null, id
      ])

      // Remover relacionamentos existentes
      await connection.execute('DELETE FROM application_capabilities WHERE application_id = ?', [id])
      await connection.execute('DELETE FROM application_processes WHERE application_id = ?', [id])
      await connection.execute('DELETE FROM application_technologies WHERE application_id = ?', [id])
      await connection.execute('DELETE FROM application_relationships WHERE application_id = ?', [id])

      // Inserir novos relacionamentos
      if (data.relatedCapabilities?.length) {
        await this.insertCapabilityRelationships(connection, id, data.relatedCapabilities)
      }
      if (data.relatedProcesses?.length) {
        await this.insertProcessRelationships(connection, id, data.relatedProcesses)
      }
      if (data.relatedTechnologies?.length) {
        await this.insertTechnologyRelationships(connection, id, data.relatedTechnologies)
      }
      if (data.relatedApplications?.length) {
        await this.insertApplicationRelationships(connection, id, data.relatedApplications)
      }

      await connection.commit()
      
      const updatedApp = await this.findById(id)
      return updatedApp!
    } catch (error) {
      await connection.rollback()
      console.error('Erro ao atualizar aplicação:', error)
      throw error
    } finally {
      connection.release()
    }
  }

  // Deletar aplicação
  static async delete(id: string): Promise<void> {
    try {
      await pool.execute('DELETE FROM applications WHERE id = ?', [id])
    } catch (error) {
      console.error('Erro ao deletar aplicação:', error)
      throw error
    }
  }

  // Métodos auxiliares para relacionamentos
  private static async getRelatedCapabilities(applicationId: string): Promise<string[]> {
    const [rows] = await pool.execute(`
      SELECT capability_id FROM application_capabilities WHERE application_id = ?
    `, [applicationId])
    return (rows as any[]).map(row => row.capability_id)
  }

  private static async getRelatedProcesses(applicationId: string): Promise<string[]> {
    const [rows] = await pool.execute(`
      SELECT process_id FROM application_processes WHERE application_id = ?
    `, [applicationId])
    return (rows as any[]).map(row => row.process_id)
  }

  private static async getRelatedTechnologies(applicationId: string): Promise<string[]> {
    const [rows] = await pool.execute(`
      SELECT technology_id FROM application_technologies WHERE application_id = ?
    `, [applicationId])
    return (rows as any[]).map(row => row.technology_id)
  }

  private static async getRelatedApplications(applicationId: string): Promise<string[]> {
    const [rows] = await pool.execute(`
      SELECT related_application_id FROM application_relationships WHERE application_id = ?
    `, [applicationId])
    return (rows as any[]).map(row => row.related_application_id)
  }

  private static async insertCapabilityRelationships(connection: any, applicationId: string, capabilityIds: string[]) {
    for (const capabilityId of capabilityIds) {
      await connection.execute(`
        INSERT INTO application_capabilities (application_id, capability_id) VALUES (?, ?)
      `, [applicationId, capabilityId])
    }
  }

  private static async insertProcessRelationships(connection: any, applicationId: string, processIds: string[]) {
    for (const processId of processIds) {
      await connection.execute(`
        INSERT INTO application_processes (application_id, process_id) VALUES (?, ?)
      `, [applicationId, processId])
    }
  }

  private static async insertTechnologyRelationships(connection: any, applicationId: string, technologyIds: string[]) {
    for (const technologyId of technologyIds) {
      await connection.execute(`
        INSERT INTO application_technologies (application_id, technology_id) VALUES (?, ?)
      `, [applicationId, technologyId])
    }
  }

  private static async insertApplicationRelationships(connection: any, applicationId: string, relatedApplicationIds: string[]) {
    for (const relatedId of relatedApplicationIds) {
      await connection.execute(`
        INSERT INTO application_relationships (application_id, related_application_id) VALUES (?, ?)
      `, [applicationId, relatedId])
    }
  }
}