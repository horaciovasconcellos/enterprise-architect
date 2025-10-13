import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { testConnection } from './src/lib/database'
import { ApplicationService } from './src/services/ApplicationService'
import { CapabilityService } from './src/services/CapabilityService'
import { TechnologyService } from './src/services/TechnologyService'
import { OwnerService } from './src/services/OwnerService'
import { ProcessService } from './src/services/ProcessService'
import { InterfaceService } from './src/services/InterfaceService'
import { RelationshipService } from './src/services/RelationshipService'
import { SkillService } from './src/services/SkillService'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Health check
app.get('/api/health', async (req, res) => {
  const dbConnected = await testConnection()
  res.json({ 
    status: 'ok', 
    database: dbConnected ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString()
  })
})

// Routes para Applications
app.get('/api/applications', async (req, res) => {
  try {
    const applications = await ApplicationService.findAll()
    res.json(applications)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar aplicações' })
  }
})

app.get('/api/applications/:id', async (req, res) => {
  try {
    const application = await ApplicationService.findById(req.params.id)
    if (!application) {
      return res.status(404).json({ error: 'Aplicação não encontrada' })
    }
    res.json(application)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar aplicação' })
  }
})

app.post('/api/applications', async (req, res) => {
  try {
    const application = await ApplicationService.create(req.body)
    res.status(201).json(application)
  } catch (error) {
    console.error('Erro ao criar aplicação:', error)
    res.status(500).json({ error: 'Erro ao criar aplicação' })
  }
})

app.put('/api/applications/:id', async (req, res) => {
  try {
    const application = await ApplicationService.update(req.params.id, req.body)
    res.json(application)
  } catch (error) {
    console.error('Erro ao atualizar aplicação:', error)
    res.status(500).json({ error: 'Erro ao atualizar aplicação' })
  }
})

app.delete('/api/applications/:id', async (req, res) => {
  try {
    await ApplicationService.delete(req.params.id)
    res.status(204).send()
  } catch (error) {
    console.error('Erro ao deletar aplicação:', error)
    res.status(500).json({ error: 'Erro ao deletar aplicação' })
  }
})

// Routes para Capabilities
app.get('/api/capabilities', async (req, res) => {
  try {
    const capabilities = await CapabilityService.findAll()
    res.json(capabilities)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar capacidades' })
  }
})

app.get('/api/capabilities/:id', async (req, res) => {
  try {
    const capability = await CapabilityService.findById(req.params.id)
    if (!capability) {
      return res.status(404).json({ error: 'Capacidade não encontrada' })
    }
    res.json(capability)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar capacidade' })
  }
})

app.post('/api/capabilities', async (req, res) => {
  try {
    const capability = await CapabilityService.create(req.body)
    res.status(201).json(capability)
  } catch (error) {
    console.error('Erro ao criar capacidade:', error)
    res.status(500).json({ error: 'Erro ao criar capacidade' })
  }
})

app.put('/api/capabilities/:id', async (req, res) => {
  try {
    const capability = await CapabilityService.update(req.params.id, req.body)
    res.json(capability)
  } catch (error) {
    console.error('Erro ao atualizar capacidade:', error)
    res.status(500).json({ error: 'Erro ao atualizar capacidade' })
  }
})

app.delete('/api/capabilities/:id', async (req, res) => {
  try {
    await CapabilityService.delete(req.params.id)
    res.status(204).send()
  } catch (error) {
    console.error('Erro ao deletar capacidade:', error)
    res.status(500).json({ error: 'Erro ao deletar capacidade' })
  }
})

// Routes para Technologies
app.get('/api/technologies', async (req, res) => {
  try {
    const technologies = await TechnologyService.findAll()
    res.json(technologies)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar tecnologias' })
  }
})

app.get('/api/technologies/:id', async (req, res) => {
  try {
    const technology = await TechnologyService.findById(req.params.id)
    if (!technology) {
      return res.status(404).json({ error: 'Tecnologia não encontrada' })
    }
    res.json(technology)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar tecnologia' })
  }
})

app.post('/api/technologies', async (req, res) => {
  try {
    const technology = await TechnologyService.create(req.body)
    res.status(201).json(technology)
  } catch (error) {
    console.error('Erro ao criar tecnologia:', error)
    res.status(500).json({ error: 'Erro ao criar tecnologia' })
  }
})

app.put('/api/technologies/:id', async (req, res) => {
  try {
    const technology = await TechnologyService.update(req.params.id, req.body)
    res.json(technology)
  } catch (error) {
    console.error('Erro ao atualizar tecnologia:', error)
    res.status(500).json({ error: 'Erro ao atualizar tecnologia' })
  }
})

app.delete('/api/technologies/:id', async (req, res) => {
  try {
    await TechnologyService.delete(req.params.id)
    res.status(204).send()
  } catch (error) {
    console.error('Erro ao deletar tecnologia:', error)
    res.status(500).json({ error: 'Erro ao deletar tecnologia' })
  }
})

// Routes para Owners
app.get('/api/owners', async (req, res) => {
  try {
    const owners = await OwnerService.findAll()
    res.json(owners)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar proprietários' })
  }
})

app.get('/api/owners/:id', async (req, res) => {
  try {
    const owner = await OwnerService.findById(req.params.id)
    if (!owner) {
      return res.status(404).json({ error: 'Proprietário não encontrado' })
    }
    res.json(owner)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar proprietário' })
  }
})

app.post('/api/owners', async (req, res) => {
  try {
    const owner = await OwnerService.create(req.body)
    res.status(201).json(owner)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar proprietário' })
  }
})

app.put('/api/owners/:id', async (req, res) => {
  try {
    const owner = await OwnerService.update(req.params.id, req.body)
    res.json(owner)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar proprietário' })
  }
})

app.delete('/api/owners/:id', async (req, res) => {
  try {
    await OwnerService.delete(req.params.id)
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar proprietário' })
  }
})

// Routes para Processes
app.get('/api/processes', async (req, res) => {
  try {
    const processes = await ProcessService.findAll()
    res.json(processes)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar processos' })
  }
})

app.get('/api/processes/:id', async (req, res) => {
  try {
    const process = await ProcessService.findById(req.params.id)
    if (!process) {
      return res.status(404).json({ error: 'Processo não encontrado' })
    }
    res.json(process)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar processo' })
  }
})

app.post('/api/processes', async (req, res) => {
  try {
    const process = await ProcessService.create(req.body)
    res.status(201).json(process)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar processo' })
  }
})

app.put('/api/processes/:id', async (req, res) => {
  try {
    const process = await ProcessService.update(req.params.id, req.body)
    res.json(process)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar processo' })
  }
})

app.delete('/api/processes/:id', async (req, res) => {
  try {
    await ProcessService.delete(req.params.id)
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar processo' })
  }
})

// Routes para Interfaces
app.get('/api/interfaces', async (req, res) => {
  try {
    const interfaces = await InterfaceService.findAll()
    res.json(interfaces)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar interfaces' })
  }
})

app.get('/api/interfaces/:id', async (req, res) => {
  try {
    const interfaceItem = await InterfaceService.findById(req.params.id)
    if (!interfaceItem) {
      return res.status(404).json({ error: 'Interface não encontrada' })
    }
    res.json(interfaceItem)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar interface' })
  }
})

app.post('/api/interfaces', async (req, res) => {
  try {
    const interfaceItem = await InterfaceService.create(req.body)
    res.status(201).json(interfaceItem)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar interface' })
  }
})

app.put('/api/interfaces/:id', async (req, res) => {
  try {
    const interfaceItem = await InterfaceService.update(req.params.id, req.body)
    res.json(interfaceItem)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar interface' })
  }
})

app.delete('/api/interfaces/:id', async (req, res) => {
  try {
    await InterfaceService.delete(req.params.id)
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar interface' })
  }
})

// Routes para Relacionamentos
app.get('/api/relationships', async (req, res) => {
  try {
    const relationships = await RelationshipService.findAll()
    res.json(relationships)
  } catch (error) {
    console.error('Erro detalhado ao buscar relacionamentos:', error)
    res.status(500).json({ error: 'Erro ao buscar relacionamentos', details: error instanceof Error ? error.message : 'Erro desconhecido' })
  }
})

app.get('/api/relationships/owner/:ownerId', async (req, res) => {
  try {
    const relationships = await RelationshipService.findByOwner(req.params.ownerId)
    res.json(relationships)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar relacionamentos do proprietário' })
  }
})

app.get('/api/relationships/application/:applicationId', async (req, res) => {
  try {
    const relationships = await RelationshipService.findByApplication(req.params.applicationId)
    res.json(relationships)
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar relacionamentos da aplicação' })
  }
})

app.post('/api/relationships', async (req, res) => {
  try {
    const relationship = await RelationshipService.create(req.body)
    res.status(201).json(relationship)
  } catch (error) {
    if (error instanceof Error && error.message === 'Relacionamento já existe') {
      res.status(409).json({ error: 'Relacionamento já existe' })
    } else {
      res.status(500).json({ error: 'Erro ao criar relacionamento' })
    }
  }
})

app.delete('/api/relationships/:ownerId/:applicationId/:relationshipType', async (req, res) => {
  try {
    const { ownerId, applicationId, relationshipType } = req.params
    await RelationshipService.delete(ownerId, applicationId, relationshipType)
    res.status(204).send()
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar relacionamento' })
  }
})

// Routes para Skills
app.get('/api/skills', async (req, res) => {
  try {
    const skills = await SkillService.findAll()
    res.json(skills)
  } catch (error) {
    console.error('Erro ao buscar habilidades:', error)
    res.status(500).json({ error: 'Erro ao buscar habilidades' })
  }
})

app.get('/api/skills/:id', async (req, res) => {
  try {
    const skill = await SkillService.findById(req.params.id)
    if (!skill) {
      return res.status(404).json({ error: 'Habilidade não encontrada' })
    }
    res.json(skill)
  } catch (error) {
    console.error('Erro ao buscar habilidade:', error)
    res.status(500).json({ error: 'Erro ao buscar habilidade' })
  }
})

app.post('/api/skills', async (req, res) => {
  try {
    console.log('📝 Dados recebidos para criar skill:', JSON.stringify(req.body, null, 2))
    const skill = await SkillService.create(req.body)
    console.log('✅ Skill criada com sucesso:', skill.id)
    res.status(201).json(skill)
  } catch (error) {
    console.error('❌ Erro ao criar habilidade:', error)
    res.status(500).json({ error: 'Erro ao criar habilidade' })
  }
})

app.put('/api/skills/:id', async (req, res) => {
  try {
    console.log(`📝 Dados recebidos para atualizar skill ${req.params.id}:`, JSON.stringify(req.body, null, 2))
    const skill = await SkillService.update(req.params.id, req.body)
    console.log('✅ Skill atualizada com sucesso')
    res.json(skill)
  } catch (error) {
    console.error('❌ Erro ao atualizar habilidade:', error)
    res.status(500).json({ error: 'Erro ao atualizar habilidade' })
  }
})

app.delete('/api/skills/:id', async (req, res) => {
  try {
    await SkillService.delete(req.params.id)
    res.status(204).send()
  } catch (error) {
    console.error('Erro ao deletar habilidade:', error)
    res.status(500).json({ error: 'Erro ao deletar habilidade' })
  }
})

// Iniciar servidor
app.listen(PORT, async () => {
  console.log(`🚀 Servidor backend rodando na porta ${PORT}`)
  
  // Testar conexão com banco de dados
  const dbConnected = await testConnection()
  if (dbConnected) {
    console.log('✅ Aplicação pronta para uso!')
  } else {
    console.log('⚠️  Aplicação iniciada, mas sem conexão com o banco de dados')
  }
})