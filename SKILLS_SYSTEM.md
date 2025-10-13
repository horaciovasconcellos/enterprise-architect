# 🎓 Sistema de Habilidades (Skills)

Documentação completa do sistema de gerenciamento de habilidades técnicas.

## 📋 Visão Geral

O sistema de Habilidades permite gerenciar competências técnicas da equipe, associando desenvolvedores a habilidades específicas e tecnologias relacionadas com níveis de proficiência.

## 🗂️ Estrutura do Banco de Dados

### Tabela: `skills`
Armazena as habilidades cadastradas no sistema.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | VARCHAR(36) | UUID da habilidade (PK) |
| `name` | VARCHAR(255) | Nome da habilidade |
| `code` | VARCHAR(50) | Código único da habilidade |
| `description` | TEXT | Descrição detalhada |
| `guidance_notes` | TEXT | Notas de orientação |
| `level_description` | TEXT | Descrição dos níveis |
| `created_at` | TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | Data de atualização |

### Tabela: `skill_technologies`
Associa tecnologias às habilidades com nível de proficiência.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | VARCHAR(36) | UUID (PK) |
| `skill_id` | VARCHAR(36) | FK para skills |
| `technology_id` | VARCHAR(36) | FK para technologies |
| `proficiency_level` | INT | Nível de 0 a 5 |
| `start_date` | DATE | Data de início |
| `end_date` | DATE | Data de término |
| `created_at` | TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | Data de atualização |

### Tabela: `skill_developers`
Associa desenvolvedores às habilidades com nível de proficiência.

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | VARCHAR(36) | UUID (PK) |
| `skill_id` | VARCHAR(36) | FK para skills |
| `owner_id` | VARCHAR(36) | FK para owners (desenvolvedor) |
| `proficiency_level` | INT | Nível de 0 a 5 |
| `certification_date` | DATE | Data de certificação |
| `notes` | TEXT | Observações |
| `created_at` | TIMESTAMP | Data de criação |
| `updated_at` | TIMESTAMP | Data de atualização |

## 📊 Níveis de Proficiência

O sistema utiliza uma escala de 0 a 5 para medir o nível de conhecimento:

| Nível | Nome | Descrição |
|-------|------|-----------|
| **0** | Sem conhecimento | Nenhum conhecimento sobre o assunto |
| **1** | Superficial | Conhecimento básico e superficial |
| **2** | Fundamentado | Conhecimento fundamentado e consolidado |
| **3** | Relacional | Compreende elementos e suas relações |
| **4** | Crítico | Capacidade argumentativa e crítica |
| **5** | Amplo | Conhecimento amplo e profundo |

## 🔧 API Endpoints

### Skills

#### GET `/api/skills`
Lista todas as habilidades.

**Resposta:**
```json
[
  {
    "id": "uuid",
    "name": "Desenvolvimento Backend",
    "code": "DEV-BACK-001",
    "description": "...",
    "guidanceNotes": "...",
    "levelDescription": "..."
  }
]
```

#### GET `/api/skills/:id`
Busca uma habilidade específica com tecnologias e desenvolvedores.

**Resposta:**
```json
{
  "id": "uuid",
  "name": "Desenvolvimento Backend",
  "code": "DEV-BACK-001",
  "description": "...",
  "guidanceNotes": "...",
  "levelDescription": "...",
  "technologies": [
    {
      "id": "uuid",
      "technologyId": "uuid",
      "technologyName": "Node.js - 20.0.0",
      "proficiencyLevel": 4,
      "startDate": "2024-01-01",
      "endDate": "2025-12-31"
    }
  ],
  "developers": [
    {
      "id": "uuid",
      "ownerId": "uuid",
      "ownerName": "João Silva",
      "proficiencyLevel": 5,
      "certificationDate": "2024-06-01",
      "notes": "Expert em Node.js"
    }
  ]
}
```

#### POST `/api/skills`
Cria uma nova habilidade.

**Body:**
```json
{
  "name": "Desenvolvimento Frontend",
  "code": "DEV-FRONT-001",
  "description": "Desenvolvimento de interfaces web",
  "guidanceNotes": "Conhecimento em React, Vue, Angular",
  "levelDescription": "Níveis 0-5 conforme padrão",
  "technologies": [
    {
      "technologyId": "uuid",
      "proficiencyLevel": 4,
      "startDate": "2024-01-01",
      "endDate": "2025-12-31"
    }
  ],
  "developers": [
    {
      "ownerId": "uuid",
      "proficiencyLevel": 5,
      "certificationDate": "2024-06-01",
      "notes": "Especialista React"
    }
  ]
}
```

#### PUT `/api/skills/:id`
Atualiza uma habilidade existente.

**Body:** Mesmo formato do POST

#### DELETE `/api/skills/:id`
Remove uma habilidade (cascade remove tecnologias e desenvolvedores associados).

## 💻 Componentes Frontend

### SkillsView
View principal que lista todas as habilidades com cards informativos.

**Recursos:**
- Grid responsivo de cards
- Estatísticas (total de skills, tecnologias, desenvolvedores)
- Botões de edição e exclusão
- Estado vazio com CTA

### SkillForm
Formulário completo para criar/editar habilidades.

**Seções:**
1. **Informações Básicas**
   - Nome da habilidade
   - Código da habilidade
   - Descrição
   - Notas de orientação
   - Descrição dos níveis

2. **Tecnologias Associadas** (Tabular)
   - Select de tecnologia (com versão)
   - Select de nível (0-5)
   - Data início
   - Data término
   - Botão adicionar/remover

3. **Desenvolvedores Associados** (Tabular)
   - Select de desenvolvedor
   - Select de nível (0-5)
   - Data certificação
   - Campo de notas
   - Botão adicionar/remover

4. **Sidebar**
   - Card explicativo dos níveis
   - Botões de ação (Salvar/Cancelar)

## 🎯 Casos de Uso

### 1. Cadastrar Nova Habilidade
```typescript
const skillData = {
  name: "DevOps",
  code: "DEV-OPS-001",
  description: "Práticas DevOps e Cloud",
  guidanceNotes: "CI/CD, Docker, Kubernetes",
  levelDescription: "Padrão 0-5",
  technologies: [
    {
      technologyId: "docker-uuid",
      proficiencyLevel: 4,
      startDate: "2024-01-01",
      endDate: null
    }
  ],
  developers: [
    {
      ownerId: "dev-uuid",
      proficiencyLevel: 5,
      certificationDate: "2024-03-15",
      notes: "Certificado AWS"
    }
  ]
}

await createSkill(skillData)
```

### 2. Atualizar Nível de Proficiência
```typescript
// Buscar skill
const skill = await SkillService.findById(skillId)

// Atualizar desenvolvedor
skill.developers[0].proficiencyLevel = 5
skill.developers[0].certificationDate = "2024-06-01"

// Salvar
await SkillService.update(skillId, skill)
```

### 3. Adicionar Tecnologia a Skill
```typescript
const skill = await SkillService.findById(skillId)

skill.technologies.push({
  technologyId: "new-tech-uuid",
  proficiencyLevel: 3,
  startDate: "2024-07-01",
  endDate: "2025-06-30"
})

await SkillService.update(skillId, skill)
```

## 📈 Relatórios e Análises

### Skills por Desenvolvedor
```sql
SELECT 
  o.nome,
  s.name as skill_name,
  sd.proficiency_level,
  sd.certification_date
FROM skill_developers sd
JOIN owners o ON sd.owner_id = o.id
JOIN skills s ON sd.skill_id = s.id
ORDER BY o.nome, sd.proficiency_level DESC;
```

### Tecnologias por Skill
```sql
SELECT 
  s.name as skill_name,
  t.name as technology_name,
  st.proficiency_level,
  st.start_date,
  st.end_date
FROM skill_technologies st
JOIN skills s ON st.skill_id = s.id
JOIN technologies t ON st.technology_id = t.id
ORDER BY s.name, st.proficiency_level DESC;
```

### Desenvolvedores Expert (Nível 5)
```sql
SELECT 
  o.nome,
  COUNT(*) as expert_skills
FROM skill_developers sd
JOIN owners o ON sd.owner_id = o.id
WHERE sd.proficiency_level = 5
GROUP BY o.id, o.nome
ORDER BY expert_skills DESC;
```

### Gap de Competências
```sql
-- Skills sem desenvolvedores
SELECT 
  s.name,
  s.code
FROM skills s
LEFT JOIN skill_developers sd ON s.id = sd.skill_id
WHERE sd.id IS NULL;

-- Skills com baixa proficiência média
SELECT 
  s.name,
  AVG(sd.proficiency_level) as avg_level
FROM skills s
JOIN skill_developers sd ON s.id = sd.skill_id
GROUP BY s.id, s.name
HAVING avg_level < 3
ORDER BY avg_level;
```

## 🔐 Segurança e Validação

### Validações Implementadas
- ✅ Código de habilidade único
- ✅ Nível de proficiência entre 0-5
- ✅ Datas válidas (início < término)
- ✅ Campos obrigatórios (name, code)
- ✅ CASCADE delete para manter integridade

### Transações
Todas as operações de create/update usam transações para garantir consistência:
- Criar skill + tecnologias + desenvolvedores em uma transação
- Rollback automático em caso de erro

## 🚀 Próximas Melhorias

### Curto Prazo
- [ ] Filtros e busca na listagem
- [ ] Export para CSV/Excel
- [ ] Gráficos de competências por área
- [ ] Timeline de evolução de skills

### Médio Prazo
- [ ] Plano de desenvolvimento individual (PDI)
- [ ] Sugestão de treinamentos
- [ ] Matriz de competências da equipe
- [ ] Gamificação (badges, rankings)

### Longo Prazo
- [ ] IA para sugerir skills relacionadas
- [ ] Integração com plataformas de aprendizado
- [ ] Certificações automáticas
- [ ] Marketplace de mentoria

## 📝 Exemplo Completo

```typescript
// 1. Criar skill
const backendSkill = await createSkill({
  name: "Desenvolvimento Backend",
  code: "DEV-BACK-001",
  description: "APIs REST, bancos de dados, arquitetura",
  guidanceNotes: "Foco em Node.js, Python, Java",
  levelDescription: "Padrão 0-5",
  technologies: [
    {
      technologyId: "nodejs-uuid",
      proficiencyLevel: 4,
      startDate: "2024-01-01",
      endDate: null
    },
    {
      technologyId: "postgresql-uuid",
      proficiencyLevel: 3,
      startDate: "2024-01-01",
      endDate: null
    }
  ],
  developers: [
    {
      ownerId: "joao-uuid",
      proficiencyLevel: 5,
      certificationDate: "2024-03-01",
      notes: "Senior Backend Developer"
    },
    {
      ownerId: "maria-uuid",
      proficiencyLevel: 3,
      certificationDate: "2024-04-15",
      notes: "Mid-level, em desenvolvimento"
    }
  ]
})

// 2. Listar todas
const allSkills = await SkillService.findAll()

// 3. Buscar específica com detalhes
const skill = await SkillService.findById(backendSkill.id)

// 4. Atualizar
await SkillService.update(skill.id, {
  ...skill,
  developers: [
    ...skill.developers,
    {
      ownerId: "pedro-uuid",
      proficiencyLevel: 2,
      certificationDate: "2024-07-01",
      notes: "Junior iniciante"
    }
  ]
})

// 5. Deletar
await SkillService.delete(skill.id)
```

---

**Data de Criação:** 13/10/2025  
**Versão:** 1.0.0  
**Autor:** Enterprise Architect Team
