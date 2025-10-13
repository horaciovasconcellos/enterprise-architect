# 📥 Guia de Importação de Dados - CSV e CURL

Este guia explica como importar dados para o Enterprise Architect usando arquivos CSV ou comandos curl diretos.

---

## 📋 Índice

1. [Importação via CSV](#importação-via-csv)
2. [Importação via CURL](#importação-via-curl)
3. [Formatos dos Arquivos CSV](#formatos-dos-arquivos-csv)
4. [Exemplos Práticos](#exemplos-práticos)
5. [Troubleshooting](#troubleshooting)

---

## 🗂️ Importação via CSV

### Pré-requisitos

1. **Instalar dependência do parser CSV:**
```bash
npm install csv-parse
```

2. **Configurar variável de ambiente (opcional):**
```bash
export API_BASE_URL=http://localhost:3000/api
```

3. **Adicionar script ao package.json:**
```json
{
  "scripts": {
    "import:csv": "tsx scripts/import-csv.ts"
  }
}
```

### Uso Básico

```bash
# Sintaxe geral
npm run import:csv <tipo> <arquivo.csv>

# Exemplos
npm run import:csv owners data/owners.csv
npm run import:csv technologies data/technologies.csv
npm run import:csv applications data/applications.csv
npm run import:csv capabilities data/capabilities.csv
npm run import:csv skills data/skills.csv
```

### Ordem de Importação Recomendada

⚠️ **IMPORTANTE:** Respeite a ordem para evitar erros de referência!

```bash
# 1. Primeiro: Owners e Technologies (sem dependências)
npm run import:csv owners data/owners.csv
npm run import:csv technologies data/technologies.csv

# 2. Depois: Applications e Capabilities
npm run import:csv applications data/applications.csv
npm run import:csv capabilities data/capabilities.csv

# 3. Por último: Skills (depende de owners e technologies)
npm run import:csv skills data/skills.csv
```

### Exemplo Completo de Importação

```bash
#!/bin/bash

# Script de importação completa
API_BASE_URL=http://localhost:3000/api

echo "🚀 Iniciando importação..."

echo "📝 1/5 - Importando Owners..."
npm run import:csv owners data/owners.csv

echo "💻 2/5 - Importando Technologies..."
npm run import:csv technologies data/technologies.csv

echo "📱 3/5 - Importando Applications..."
npm run import:csv applications data/applications.csv

echo "🎯 4/5 - Importando Capabilities..."
npm run import:csv capabilities data/capabilities.csv

echo "🎓 5/5 - Importando Skills..."
npm run import:csv skills data/skills.csv

echo "✅ Importação concluída!"
```

---

## 🌐 Importação via CURL

### Scripts Disponíveis

1. **`scripts/curl-examples.sh`** - Exemplos detalhados com explicações
2. **`scripts/curl-quick.sh`** - Comandos rápidos para teste

### Uso dos Scripts

```bash
# Tornar executável
chmod +x scripts/curl-examples.sh
chmod +x scripts/curl-quick.sh

# Ver exemplos detalhados
./scripts/curl-examples.sh

# Executar comandos rápidos
./scripts/curl-quick.sh
```

### Comandos CURL Individuais

#### 1. Criar Owner

```bash
curl -X POST http://localhost:3000/api/owners \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "João Silva",
    "email": "joao.silva@empresa.com",
    "role": "Senior Developer",
    "department": "Engineering"
  }'
```

**Resposta:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "João Silva",
  "email": "joao.silva@empresa.com",
  "role": "Senior Developer",
  "department": "Engineering",
  "createdAt": "2024-10-13T10:30:00.000Z"
}
```

#### 2. Criar Technology

```bash
curl -X POST http://localhost:3000/api/technologies \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Node.js",
    "version": "20",
    "category": "Runtime",
    "description": "JavaScript runtime built on V8",
    "vendor": "OpenJS Foundation",
    "licenseType": "Open Source",
    "supportLevel": "Community"
  }'
```

#### 3. Criar Application

```bash
# Substitua OWNER_ID e TECH_ID pelos IDs reais
curl -X POST http://localhost:3000/api/applications \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Portal do Cliente",
    "description": "Sistema de atendimento ao cliente",
    "status": "Active",
    "criticality": "High",
    "ownerId": "550e8400-e29b-41d4-a716-446655440000",
    "technologies": [
      {
        "technologyId": "660e8400-e29b-41d4-a716-446655440000",
        "version": "20",
        "environment": "Production"
      }
    ]
  }'
```

#### 4. Criar Capability

```bash
curl -X POST http://localhost:3000/api/capabilities \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Gestão de Clientes",
    "description": "Capacidade de gerenciar relacionamento com clientes",
    "category": "Business",
    "maturityLevel": 4,
    "strategicImportance": "High"
  }'
```

#### 5. Criar Skill

```bash
# Substitua TECH_ID e OWNER_ID pelos IDs reais
curl -X POST http://localhost:3000/api/skills \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Desenvolvimento Backend",
    "code": "SKILL-BACK-001",
    "description": "Desenvolvimento de APIs e serviços",
    "guidanceNotes": "Foco em Node.js e arquiteturas escaláveis",
    "levelDescription": "Níveis de 0 (sem conhecimento) a 5 (expert)",
    "technologies": [
      {
        "technologyId": "660e8400-e29b-41d4-a716-446655440000",
        "proficiencyLevel": 4,
        "startDate": "2024-01-01",
        "endDate": null
      }
    ],
    "developers": [
      {
        "ownerId": "550e8400-e29b-41d4-a716-446655440000",
        "proficiencyLevel": 5,
        "certificationDate": "2024-06-01",
        "notes": "Certificado AWS"
      }
    ]
  }'
```

### Operações de Leitura

```bash
# Listar todos
curl http://localhost:3000/api/owners | jq
curl http://localhost:3000/api/technologies | jq
curl http://localhost:3000/api/applications | jq
curl http://localhost:3000/api/capabilities | jq
curl http://localhost:3000/api/skills | jq

# Buscar por ID
curl http://localhost:3000/api/owners/OWNER_ID | jq
curl http://localhost:3000/api/technologies/TECH_ID | jq

# Buscar relações
curl http://localhost:3000/api/applications/APP_ID/technologies | jq
curl http://localhost:3000/api/skills/SKILL_ID/developers | jq
```

### Operações de Atualização

```bash
# Atualizar owner
curl -X PUT http://localhost:3000/api/owners/OWNER_ID \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "João Silva",
    "email": "joao.silva@empresa.com",
    "role": "Tech Lead",
    "department": "Engineering"
  }'
```

### Operações de Deleção

```bash
# Deletar registros
curl -X DELETE http://localhost:3000/api/owners/OWNER_ID
curl -X DELETE http://localhost:3000/api/technologies/TECH_ID
curl -X DELETE http://localhost:3000/api/applications/APP_ID
curl -X DELETE http://localhost:3000/api/capabilities/CAP_ID
curl -X DELETE http://localhost:3000/api/skills/SKILL_ID
```

---

## 📄 Formatos dos Arquivos CSV

### 1. Owners (owners.csv)

**Colunas obrigatórias:**
- `name` - Nome completo
- `email` - Email corporativo
- `role` - Cargo (ex: Developer, Tech Lead)
- `department` - Departamento (ex: Engineering)

**Exemplo:**
```csv
name,email,role,department
João Silva,joao.silva@empresa.com,Senior Developer,Engineering
Maria Santos,maria.santos@empresa.com,Tech Lead,Engineering
Pedro Oliveira,pedro.oliveira@empresa.com,Developer,Engineering
```

### 2. Technologies (technologies.csv)

**Colunas obrigatórias:**
- `name` - Nome da tecnologia
- `version` - Versão
- `category` - Categoria (Runtime, Framework, Database, etc.)
- `description` - Descrição
- `vendor` - Fornecedor
- `licenseType` - Tipo de licença
- `supportLevel` - Nível de suporte

**Exemplo:**
```csv
name,version,category,description,vendor,licenseType,supportLevel
Node.js,20,Runtime,JavaScript runtime,OpenJS Foundation,Open Source,Community
PostgreSQL,16,Database,Relational database,PostgreSQL,Open Source,Community
React,19,Frontend Framework,UI library,Meta,Open Source,Community
```

### 3. Applications (applications.csv)

**Colunas obrigatórias:**
- `name` - Nome da aplicação
- `description` - Descrição
- `status` - Status (Active, Inactive, Development)
- `criticality` - Criticidade (Low, Medium, High, Critical)
- `owner` - Nome do proprietário (deve existir em owners)
- `technologies` - Tecnologias separadas por `|` (formato: "Nome Versão")

**Exemplo:**
```csv
name,description,status,criticality,owner,technologies
Portal do Cliente,Sistema de atendimento,Active,High,João Silva,Node.js 20|PostgreSQL 16|React 19
API Gateway,Gateway de microserviços,Active,Critical,Maria Santos,Node.js 20|Redis 7
```

### 4. Capabilities (capabilities.csv)

**Colunas obrigatórias:**
- `name` - Nome da capacidade
- `description` - Descrição
- `category` - Categoria (Business, Technical, Operations)
- `maturityLevel` - Nível de maturidade (1-5)
- `strategicImportance` - Importância (Low, Medium, High, Critical)

**Exemplo:**
```csv
name,description,category,maturityLevel,strategicImportance
Gestão de Clientes,Capacidade de CRM,Business,4,High
DevOps e CI/CD,Automação de deploy,Technical,4,High
Processamento de Pagamentos,Transações financeiras,Business,5,Critical
```

### 5. Skills (skills.csv)

**Colunas obrigatórias:**
- `name` - Nome da habilidade
- `code` - Código único
- `description` - Descrição
- `guidanceNotes` - Notas de orientação
- `levelDescription` - Descrição dos níveis
- `technologies` - Tecnologias com formato: "Nome Versão:Nível:Data" separadas por `|`
- `developers` - Desenvolvedores com formato: "Nome:Nível:Data:Notas" separadas por `|`

**Formato especial:**

**Technologies:** `"Node.js 20:4:2024-01-01|PostgreSQL 16:5:2024-02-01"`
- Tecnologia: `Node.js 20`
- Nível: `4` (0-5)
- Data início: `2024-01-01`

**Developers:** `"João Silva:5:2024-06-01:Certificado AWS|Maria Santos:4:2024-07-01:"`
- Desenvolvedor: `João Silva`
- Nível: `5` (0-5)
- Data certificação: `2024-06-01`
- Notas: `Certificado AWS`

**Exemplo:**
```csv
name,code,description,guidanceNotes,levelDescription,technologies,developers
Desenvolvimento Backend,SKILL-BACK-001,APIs e serviços,Foco em Node.js,Níveis 0-5,"Node.js 20:4:2024-01-01|PostgreSQL 16:4:2024-01-01","João Silva:5:2024-06-01:Expert|Maria Santos:4:2024-05-15:"
Desenvolvimento Frontend,SKILL-FRONT-001,Interfaces modernas,React e Vue.js,Escala 0-5,"React 19:5:2024-01-01|TypeScript 5:4:2024-01-01","Pedro Oliveira:5:2024-07-01:"
```

---

## 💡 Exemplos Práticos

### Cenário 1: Importar Time de Desenvolvimento

```bash
# Passo 1: Criar arquivo de desenvolvedores
cat > data/team.csv << EOF
name,email,role,department
Alice Santos,alice@empresa.com,Senior Developer,Engineering
Bob Silva,bob@empresa.com,Developer,Engineering
Carol Oliveira,carol@empresa.com,Tech Lead,Engineering
EOF

# Passo 2: Importar
npm run import:csv owners data/team.csv

# Passo 3: Verificar
curl http://localhost:3000/api/owners | jq '.[] | {name, role}'
```

### Cenário 2: Importar Stack Tecnológica

```bash
# Criar arquivo de tecnologias
cat > data/stack.csv << EOF
name,version,category,description,vendor,licenseType,supportLevel
Node.js,20,Runtime,JavaScript runtime,OpenJS Foundation,Open Source,LTS
Express.js,5,Framework,Web framework,OpenJS Foundation,Open Source,Community
PostgreSQL,16,Database,SQL database,PostgreSQL,Open Source,Community
Redis,7,Cache,In-memory cache,Redis Ltd.,Open Source,Enterprise
Docker,24,Platform,Containerization,Docker Inc.,Open Source,Enterprise
EOF

# Importar
npm run import:csv technologies data/stack.csv

# Verificar
curl http://localhost:3000/api/technologies | jq '.[] | {name, version, category}'
```

### Cenário 3: Criar Aplicação via CURL com Tecnologias

```bash
# 1. Buscar IDs necessários
OWNER_ID=$(curl -s http://localhost:3000/api/owners | jq -r '.[0].id')
NODEJS_ID=$(curl -s http://localhost:3000/api/technologies | jq -r '.[] | select(.name=="Node.js") | .id')
PG_ID=$(curl -s http://localhost:3000/api/technologies | jq -r '.[] | select(.name=="PostgreSQL") | .id')

# 2. Criar aplicação
curl -X POST http://localhost:3000/api/applications \
  -H 'Content-Type: application/json' \
  -d "{
    \"name\": \"Sistema de Vendas\",
    \"description\": \"Plataforma de e-commerce\",
    \"status\": \"Active\",
    \"criticality\": \"High\",
    \"ownerId\": \"$OWNER_ID\",
    \"technologies\": [
      {
        \"technologyId\": \"$NODEJS_ID\",
        \"version\": \"20\",
        \"environment\": \"Production\"
      },
      {
        \"technologyId\": \"$PG_ID\",
        \"version\": \"16\",
        \"environment\": \"Production\"
      }
    ]
  }" | jq

# 3. Verificar
curl http://localhost:3000/api/applications | jq '.[] | {name, technologies: .technologies | length}'
```

### Cenário 4: Criar Skill Completa via CURL

```bash
# 1. Buscar IDs
TECH_ID=$(curl -s http://localhost:3000/api/technologies | jq -r '.[0].id')
DEV_ID=$(curl -s http://localhost:3000/api/owners | jq -r '.[0].id')

# 2. Criar skill
curl -X POST http://localhost:3000/api/skills \
  -H 'Content-Type: application/json' \
  -d "{
    \"name\": \"Full Stack Development\",
    \"code\": \"SKILL-FULL-001\",
    \"description\": \"Desenvolvimento completo frontend e backend\",
    \"guidanceNotes\": \"Domínio de stack completa\",
    \"levelDescription\": \"0=Iniciante, 5=Expert\",
    \"technologies\": [
      {
        \"technologyId\": \"$TECH_ID\",
        \"proficiencyLevel\": 4,
        \"startDate\": \"2024-01-01\",
        \"endDate\": null
      }
    ],
    \"developers\": [
      {
        \"ownerId\": \"$DEV_ID\",
        \"proficiencyLevel\": 5,
        \"certificationDate\": \"$(date +%Y-%m-%d)\",
        \"notes\": \"Certificado Full Stack\"
      }
    ]
  }" | jq

# 3. Verificar com detalhes
curl "http://localhost:3000/api/skills" | jq '.[] | {name, code, techCount: .technologies|length, devCount: .developers|length}'
```

### Cenário 5: Importação Completa Automatizada

```bash
#!/bin/bash
# import-all.sh

set -e

API_URL=http://localhost:3000/api
DATA_DIR=./data

echo "🚀 Importação Completa - Enterprise Architect"
echo "=============================================="
echo ""

# Verificar se servidor está rodando
if ! curl -s $API_URL/owners > /dev/null; then
  echo "❌ API não está respondendo em $API_URL"
  exit 1
fi

echo "✅ API está online"
echo ""

# 1. Owners
echo "📝 [1/5] Importando Owners..."
npm run import:csv owners $DATA_DIR/owners.csv
OWNERS_COUNT=$(curl -s $API_URL/owners | jq 'length')
echo "   ✅ $OWNERS_COUNT owners importados"
echo ""

# 2. Technologies
echo "💻 [2/5] Importando Technologies..."
npm run import:csv technologies $DATA_DIR/technologies.csv
TECH_COUNT=$(curl -s $API_URL/technologies | jq 'length')
echo "   ✅ $TECH_COUNT technologies importadas"
echo ""

# 3. Applications
echo "📱 [3/5] Importando Applications..."
npm run import:csv applications $DATA_DIR/applications.csv
APP_COUNT=$(curl -s $API_URL/applications | jq 'length')
echo "   ✅ $APP_COUNT applications importadas"
echo ""

# 4. Capabilities
echo "🎯 [4/5] Importando Capabilities..."
npm run import:csv capabilities $DATA_DIR/capabilities.csv
CAP_COUNT=$(curl -s $API_URL/capabilities | jq 'length')
echo "   ✅ $CAP_COUNT capabilities importadas"
echo ""

# 5. Skills
echo "🎓 [5/5] Importando Skills..."
npm run import:csv skills $DATA_DIR/skills.csv
SKILL_COUNT=$(curl -s $API_URL/skills | jq 'length')
echo "   ✅ $SKILL_COUNT skills importadas"
echo ""

# Resumo
echo "=============================================="
echo "✅ IMPORTAÇÃO CONCLUÍDA!"
echo "=============================================="
echo ""
echo "📊 Resumo:"
echo "   • Owners: $OWNERS_COUNT"
echo "   • Technologies: $TECH_COUNT"
echo "   • Applications: $APP_COUNT"
echo "   • Capabilities: $CAP_COUNT"
echo "   • Skills: $SKILL_COUNT"
echo ""
echo "🌐 Acesse: http://localhost:5173"
echo ""
```

Salve como `import-all.sh` e execute:

```bash
chmod +x import-all.sh
./import-all.sh
```

---

## 🔧 Troubleshooting

### Problema: "csv-parse not found"

**Solução:**
```bash
npm install csv-parse
```

### Problema: "Owner não encontrado"

Ao importar Applications ou Skills, certifique-se que os Owners foram importados primeiro.

**Solução:**
```bash
# Verificar owners existentes
curl http://localhost:3000/api/owners | jq '.[] | .name'

# Importar owners primeiro
npm run import:csv owners data/owners.csv
```

### Problema: "Technology não encontrada"

**Solução:**
```bash
# Verificar technologies
curl http://localhost:3000/api/technologies | jq '.[] | "\(.name) \(.version)"'

# Importar technologies
npm run import:csv technologies data/technologies.csv
```

### Problema: "Connection refused"

A API não está rodando.

**Solução:**
```bash
# Iniciar servidor
npm run server:dev

# Em outro terminal, verificar
curl http://localhost:3000/api/owners
```

### Problema: Encoding de CSV

Se você tem caracteres especiais (acentos), salve o CSV com encoding UTF-8.

**Solução Excel/LibreOffice:**
1. Salvar Como → CSV
2. Encoding: UTF-8
3. Separador: vírgula

**Solução Terminal:**
```bash
# Converter para UTF-8
iconv -f ISO-8859-1 -t UTF-8 arquivo.csv > arquivo-utf8.csv
```

### Problema: Erro de transação no Skills

**Solução:**
```bash
# Verificar IDs existentes antes de importar
curl http://localhost:3000/api/owners | jq '.[] | {id, name}'
curl http://localhost:3000/api/technologies | jq '.[] | {id, name, version}'

# Ajustar CSV com nomes exatos
```

### Problema: jq não instalado

**Solução macOS:**
```bash
brew install jq
```

**Solução Linux:**
```bash
sudo apt-get install jq  # Debian/Ubuntu
sudo yum install jq      # CentOS/RHEL
```

---

## 📚 Recursos Adicionais

### Validar JSON antes de enviar

```bash
# Criar JSON em arquivo
cat > payload.json << EOF
{
  "name": "Test Owner",
  "email": "test@empresa.com",
  "role": "Developer",
  "department": "Engineering"
}
EOF

# Validar JSON
jq . payload.json

# Enviar se válido
curl -X POST http://localhost:3000/api/owners \
  -H 'Content-Type: application/json' \
  -d @payload.json
```

### Monitorar importação em tempo real

```bash
# Em um terminal
watch -n 1 'echo "Owners: $(curl -s http://localhost:3000/api/owners | jq length)"'

# Em outro terminal, executar importação
npm run import:csv owners data/owners.csv
```

### Exportar dados existentes para CSV

```bash
# Exportar owners
curl -s http://localhost:3000/api/owners | \
  jq -r '["name","email","role","department"], (.[] | [.name, .email, .role, .department]) | @csv' \
  > export-owners.csv
```

### Backup antes de importar

```bash
# Criar backup de todos os dados
mkdir -p backups
curl -s http://localhost:3000/api/owners > backups/owners-$(date +%Y%m%d).json
curl -s http://localhost:3000/api/technologies > backups/technologies-$(date +%Y%m%d).json
curl -s http://localhost:3000/api/applications > backups/applications-$(date +%Y%m%d).json
curl -s http://localhost:3000/api/capabilities > backups/capabilities-$(date +%Y%m%d).json
curl -s http://localhost:3000/api/skills > backups/skills-$(date +%Y%m%d).json
```

---

## ✅ Checklist de Importação

- [ ] API está rodando (`npm run server:dev`)
- [ ] Dependência csv-parse instalada (`npm install csv-parse`)
- [ ] Arquivos CSV criados e validados
- [ ] Owners importados primeiro
- [ ] Technologies importadas em segundo
- [ ] Applications/Capabilities importadas
- [ ] Skills importadas por último
- [ ] Dados verificados no browser (http://localhost:5173)
- [ ] Backup dos dados criado

---

**Documentação criada em:** 13/10/2025  
**Versão:** 1.0.0  
**Última atualização:** 13/10/2025
