import pool from '../lib/database'
import { v4 as uuidv4 } from 'uuid'

export interface Contract {
  id: string
  applicationId: string
  contractNumber: string
  contractCost: number
  contractStartDate: string
  contractEndDate: string
}

export class ContractService {
  static async findByApplicationId(applicationId: string): Promise<Contract[]> {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          id,
          application_id as applicationId,
          contract_number as contractNumber,
          contract_cost as contractCost,
          contract_start_date as contractStartDate,
          contract_end_date as contractEndDate
        FROM contracts
        WHERE application_id = ?
        ORDER BY contract_start_date DESC
      `, [applicationId])
      return rows as Contract[]
    } catch (error) {
      console.error('Erro ao buscar contratos:', error)
      throw error
    }
  }

  static async create(applicationId: string, data: Omit<Contract, 'id' | 'applicationId'>): Promise<Contract> {
    try {
      const id = uuidv4()
      await pool.execute(`
        INSERT INTO contracts (id, application_id, contract_number, contract_cost, contract_start_date, contract_end_date)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        id,
        applicationId,
        data.contractNumber,
        data.contractCost,
        data.contractStartDate,
        data.contractEndDate
      ])
      
      return {
        id,
        applicationId,
        ...data
      }
    } catch (error) {
      console.error('Erro ao criar contrato:', error)
      throw error
    }
  }

  static async update(id: string, data: Omit<Contract, 'id' | 'applicationId'>): Promise<void> {
    try {
      await pool.execute(`
        UPDATE contracts SET
          contract_number = ?,
          contract_cost = ?,
          contract_start_date = ?,
          contract_end_date = ?
        WHERE id = ?
      `, [
        data.contractNumber,
        data.contractCost,
        data.contractStartDate,
        data.contractEndDate,
        id
      ])
    } catch (error) {
      console.error('Erro ao atualizar contrato:', error)
      throw error
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await pool.execute('DELETE FROM contracts WHERE id = ?', [id])
    } catch (error) {
      console.error('Erro ao deletar contrato:', error)
      throw error
    }
  }

  static async deleteByApplicationId(applicationId: string): Promise<void> {
    try {
      await pool.execute('DELETE FROM contracts WHERE application_id = ?', [applicationId])
    } catch (error) {
      console.error('Erro ao deletar contratos da aplicação:', error)
      throw error
    }
  }

  static async syncContracts(applicationId: string, contracts: Omit<Contract, 'id' | 'applicationId'>[]): Promise<void> {
    try {
      // Deletar todos os contratos existentes da aplicação
      await this.deleteByApplicationId(applicationId)
      
      // Criar novos contratos
      for (const contract of contracts) {
        await this.create(applicationId, contract)
      }
    } catch (error) {
      console.error('Erro ao sincronizar contratos:', error)
      throw error
    }
  }
}
