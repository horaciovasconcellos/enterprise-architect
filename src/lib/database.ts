import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'enterprise_architect',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}

// Create connection pool
const pool = mysql.createPool(dbConfig)

// Test connection
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection()
    console.log('✅ MySQL conectado com sucesso!')
    connection.release()
    return true
  } catch (error) {
    console.error('❌ Erro ao conectar com MySQL:', error)
    return false
  }
}

export default pool