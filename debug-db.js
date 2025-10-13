import { testConnection } from './src/lib/database.js'
import { ApplicationService } from './src/services/ApplicationService.js'

console.log('🔍 Testando conexão com banco...')

async function test() {
  try {
    // Testar conexão
    const connected = await testConnection()
    console.log('Conexão:', connected ? '✅ OK' : '❌ FALHOU')
    
    if (connected) {
      console.log('🔍 Testando busca de aplicações...')
      const apps = await ApplicationService.findAll()
      console.log(`📊 Encontradas ${apps.length} aplicações`)
      
      console.log('🔍 Testando criação de aplicação...')
      const newApp = await ApplicationService.create({
        name: 'Teste Debug',
        description: 'Aplicação de teste',
        lifecyclePhase: 'DESENVOLVIMENTO',
        criticality: 'BAIXA',
        healthScore: 85
      })
      console.log('✅ Aplicação criada:', newApp.id)
    }
  } catch (error) {
    console.error('❌ Erro:', error)
  }
  
  process.exit(0)
}

test()