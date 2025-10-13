# 🔄 Fluxo de Dados: Skills Associations

## 📊 Diagrama do Problema e Solução

### ❌ ANTES (Problema)

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
│  http://localhost:5173/skills                                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ GET /api/skills
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API SERVER                                │
│  server.ts: app.get('/api/skills')                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ SkillService.findAll()
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SKILLSERVICE.FINDALL()                        │
│                                                                  │
│  1. SELECT * FROM skills                                         │
│                                                                  │
│  2. return rows ← ❌ SEM ASSOCIAÇÕES!                            │
│                                                                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │   RESPONSE JSON      │
                  │                      │
                  │  [{                  │
                  │    id: "abc-123",    │
                  │    name: "Backend",  │
                  │    code: "BACK-001"  │
                  │    ❌ technologies: X │
                  │    ❌ developers: X   │
                  │  }]                  │
                  └──────────────────────┘
                             │
                             ▼
                  ❌ Lista vazia no frontend!
```

---

### ✅ DEPOIS (Solução)

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND                                  │
│  http://localhost:5173/skills                                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ GET /api/skills
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API SERVER                                │
│  server.ts: app.get('/api/skills')                              │
│  📝 Log: "Buscando skills..."                                    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ SkillService.findAll()
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SKILLSERVICE.FINDALL()                        │
│                                                                  │
│  1. SELECT * FROM skills                                         │
│     └─> [skill1, skill2, skill3]                                 │
│                                                                  │
│  2. ✅ FOR EACH skill:                                           │
│                                                                  │
│     ┌────────────────────────────────────────┐                  │
│     │  skill.technologies =                  │                  │
│     │    getTechnologies(skill.id)           │                  │
│     │      ↓                                  │                  │
│     │    SELECT FROM skill_technologies       │                  │
│     │    JOIN technologies                    │                  │
│     │      ↓                                  │                  │
│     │    [{                                   │                  │
│     │      technologyId: "node-uuid",         │                  │
│     │      technologyName: "Node.js",         │                  │
│     │      proficiencyLevel: 4                │                  │
│     │    }]                                   │                  │
│     └────────────────────────────────────────┘                  │
│                                                                  │
│     ┌────────────────────────────────────────┐                  │
│     │  skill.developers =                    │                  │
│     │    getDevelopers(skill.id)             │                  │
│     │      ↓                                  │                  │
│     │    SELECT FROM skill_developers         │                  │
│     │    JOIN owners                          │                  │
│     │      ↓                                  │                  │
│     │    [{                                   │                  │
│     │      ownerId: "owner-uuid",             │                  │
│     │      ownerName: "João Silva",           │                  │
│     │      proficiencyLevel: 5                │                  │
│     │    }]                                   │                  │
│     └────────────────────────────────────────┘                  │
│                                                                  │
│  3. ✅ return skills (COM ASSOCIAÇÕES)                           │
│     📝 Log: "Encontradas 3 skills"                               │
│     📝 Log: "Skill Backend: 2 techs, 1 dev"                      │
│                                                                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │   RESPONSE JSON      │
                  │                      │
                  │  [{                  │
                  │    id: "abc-123",    │
                  │    name: "Backend",  │
                  │    code: "BACK-001", │
                  │    ✅ technologies: [│
                  │      {               │
                  │        technologyId, │
                  │        name,         │
                  │        level         │
                  │      }               │
                  │    ],                │
                  │    ✅ developers: [  │
                  │      {               │
                  │        ownerId,      │
                  │        name,         │
                  │        level         │
                  │      }               │
                  │    ]                 │
                  │  }]                  │
                  └──────────────────────┘
                             │
                             ▼
                  ✅ Lista completa no frontend!
```

---

## 🗄️ Estrutura do Banco de Dados

```
┌─────────────────────┐
│      skills         │
├─────────────────────┤
│ id (PK)             │
│ name                │
│ code                │
│ description         │
└──────────┬──────────┘
           │
           │ skill_id (FK)
           │
     ┌─────┴─────────────────────┐
     │                           │
     ▼                           ▼
┌─────────────────────┐   ┌─────────────────────┐
│ skill_technologies  │   │  skill_developers   │
├─────────────────────┤   ├─────────────────────┤
│ id (PK)             │   │ id (PK)             │
│ skill_id (FK)       │   │ skill_id (FK)       │
│ technology_id (FK)  │   │ owner_id (FK)       │
│ proficiency_level   │   │ proficiency_level   │
│ start_date          │   │ certification_date  │
│ end_date            │   │ notes               │
└──────────┬──────────┘   └──────────┬──────────┘
           │                         │
           │ technology_id           │ owner_id
           │ (FK)                    │ (FK)
           ▼                         ▼
┌─────────────────────┐   ┌─────────────────────┐
│   technologies      │   │      owners         │
├─────────────────────┤   ├─────────────────────┤
│ id (PK)             │   │ id (PK)             │
│ name                │   │ nome                │
│ description         │   │ email               │
└─────────────────────┘   └─────────────────────┘
```

---

## 🔍 Comparação de Queries SQL

### ❌ ANTES (1 query - incompleto)

```sql
-- Query 1: Buscar skills
SELECT 
  id,
  name,
  code,
  description,
  guidance_notes as guidanceNotes,
  level_description as levelDescription
FROM skills
ORDER BY name;

-- ❌ Parava aqui! Não buscava associações!
```

**Resultado:**
- ✅ Skills básicas retornadas
- ❌ Sem tecnologias
- ❌ Sem desenvolvedores

---

### ✅ DEPOIS (2N+1 queries - completo)

```sql
-- Query 1: Buscar skills
SELECT 
  id,
  name,
  code,
  description,
  guidance_notes as guidanceNotes,
  level_description as levelDescription
FROM skills
ORDER BY name;

-- Para cada skill retornada:

  -- Query 2: Buscar tecnologias da skill X
  SELECT 
    st.id,
    st.technology_id as technologyId,
    t.name as technologyName,
    st.proficiency_level as proficiencyLevel,
    DATE_FORMAT(st.start_date, '%Y-%m-%d') as startDate,
    DATE_FORMAT(st.end_date, '%Y-%m-%d') as endDate
  FROM skill_technologies st
  LEFT JOIN technologies t ON st.technology_id = t.id
  WHERE st.skill_id = 'abc-123'
  ORDER BY t.name;

  -- Query 3: Buscar desenvolvedores da skill X
  SELECT 
    sd.id,
    sd.owner_id as ownerId,
    o.nome as ownerName,
    sd.proficiency_level as proficiencyLevel,
    DATE_FORMAT(sd.certification_date, '%Y-%m-%d') as certificationDate,
    sd.notes
  FROM skill_developers sd
  LEFT JOIN owners o ON sd.owner_id = o.id
  WHERE sd.skill_id = 'abc-123'
  ORDER BY o.nome;

-- Repete queries 2 e 3 para cada skill
```

**Resultado:**
- ✅ Skills básicas retornadas
- ✅ Com tecnologias associadas
- ✅ Com desenvolvedores associados

**Nota sobre Performance:**
- Se há 10 skills, são executadas: 1 + (10 × 2) = **21 queries**
- Para <100 skills, performance é aceitável
- Para >100 skills, considerar otimização com JOINs e GROUP_CONCAT

---

## 🎯 Exemplo Concreto

### Criando uma Skill:

```javascript
POST /api/skills
{
  "name": "Backend Development",
  "code": "BACK-001",
  "technologies": [
    {
      "technologyId": "node-uuid",
      "proficiencyLevel": 4,
      "startDate": "2024-01-01"
    },
    {
      "technologyId": "postgres-uuid",
      "proficiencyLevel": 3,
      "startDate": "2024-02-01"
    }
  ],
  "developers": [
    {
      "ownerId": "owner-uuid",
      "proficiencyLevel": 5,
      "certificationDate": "2024-06-01"
    }
  ]
}
```

**SQL executado:**
```sql
-- 1. Inserir skill
INSERT INTO skills (id, name, code) VALUES (?, ?, ?);

-- 2. Inserir tecnologia 1
INSERT INTO skill_technologies (skill_id, technology_id, proficiency_level, start_date)
VALUES ('abc-123', 'node-uuid', 4, '2024-01-01');

-- 3. Inserir tecnologia 2
INSERT INTO skill_technologies (skill_id, technology_id, proficiency_level, start_date)
VALUES ('abc-123', 'postgres-uuid', 3, '2024-02-01');

-- 4. Inserir desenvolvedor
INSERT INTO skill_developers (skill_id, owner_id, proficiency_level, certification_date)
VALUES ('abc-123', 'owner-uuid', 5, '2024-06-01');

COMMIT;
```

**Dados no banco:**

```
skills:
| id      | name                | code      |
|---------|---------------------|-----------|
| abc-123 | Backend Development | BACK-001  |

skill_technologies:
| id  | skill_id | technology_id | proficiency_level |
|-----|----------|---------------|-------------------|
| 1   | abc-123  | node-uuid     | 4                 |
| 2   | abc-123  | postgres-uuid | 3                 |

skill_developers:
| id  | skill_id | owner_id   | proficiency_level |
|-----|----------|------------|-------------------|
| 1   | abc-123  | owner-uuid | 5                 |
```

---

### Listando Skills:

#### ❌ ANTES (resposta incompleta):
```json
GET /api/skills

[
  {
    "id": "abc-123",
    "name": "Backend Development",
    "code": "BACK-001"
  }
]
```

#### ✅ DEPOIS (resposta completa):
```json
GET /api/skills

[
  {
    "id": "abc-123",
    "name": "Backend Development",
    "code": "BACK-001",
    "technologies": [
      {
        "id": "1",
        "technologyId": "node-uuid",
        "technologyName": "Node.js",
        "proficiencyLevel": 4,
        "startDate": "2024-01-01",
        "endDate": null
      },
      {
        "id": "2",
        "technologyId": "postgres-uuid",
        "technologyName": "PostgreSQL",
        "proficiencyLevel": 3,
        "startDate": "2024-02-01",
        "endDate": null
      }
    ],
    "developers": [
      {
        "id": "1",
        "ownerId": "owner-uuid",
        "ownerName": "João Silva",
        "proficiencyLevel": 5,
        "certificationDate": "2024-06-01",
        "notes": null
      }
    ]
  }
]
```

---

## 📝 Logs no Terminal

### ✅ Logs após a correção:

```bash
npm run server:dev

Server running on port 3000
Connected to MySQL

# Quando alguém acessa GET /api/skills:

🔍 SkillService.findAll - Buscando todas as skills
📊 SkillService.findAll - Encontradas 3 skills
    🔧 getTechnologies(abc-123): 2 tecnologias encontradas
    👨‍💻 getDevelopers(abc-123): 1 desenvolvedores encontrados
  ✅ Skill "Backend Development": 2 tecnologias, 1 desenvolvedores
    🔧 getTechnologies(def-456): 1 tecnologias encontradas
    👨‍💻 getDevelopers(def-456): 0 desenvolvedores encontrados
  ✅ Skill "Frontend Development": 1 tecnologias, 0 desenvolvedores
    🔧 getTechnologies(ghi-789): 0 tecnologias encontradas
    👨‍💻 getDevelopers(ghi-789): 2 desenvolvedores encontrados
  ✅ Skill "DevOps": 0 tecnologias, 2 desenvolvedores
```

---

## 🎉 Resumo da Solução

| Aspecto | Antes | Depois |
|---------|-------|--------|
| **Queries SQL** | 1 | 2N+1 (N = nº de skills) |
| **Dados retornados** | Parciais | Completos |
| **Frontend** | Lista vazia | Lista completa |
| **Logs** | Mínimos | Detalhados |
| **Debug** | Difícil | Fácil |
| **Funcionalidade** | ❌ Quebrada | ✅ Funcionando |

---

**Correção aplicada em:** 13 de outubro de 2025  
**Documentação criada por:** GitHub Copilot
