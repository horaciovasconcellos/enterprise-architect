#!/bin/bash

##############################################################################
# CURL Examples - Enterprise Architect API
#
# Exemplos de requisições curl para todas as entidades da API
#
# Uso:
#   chmod +x scripts/curl-examples.sh
#   ./scripts/curl-examples.sh
#
# Variáveis:
#   API_URL - URL base da API (padrão: http://localhost:3000/api)
##############################################################################

API_URL="${API_URL:-http://localhost:3000/api}"

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para exibir título de seção
section() {
  echo ""
  echo -e "${BLUE}========================================${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}========================================${NC}"
  echo ""
}

# Função para exibir comando
show_command() {
  echo -e "${YELLOW}Comando:${NC}"
  echo -e "${GREEN}$1${NC}"
  echo ""
}

# Função para executar curl e mostrar resultado
run_curl() {
  local description=$1
  local curl_command=$2
  
  echo -e "${YELLOW}📝 ${description}${NC}"
  show_command "$curl_command"
  
  echo -e "${YELLOW}Resposta:${NC}"
  eval "$curl_command"
  echo -e "\n"
}

##############################################################################
# 1. OWNERS (Proprietários/Desenvolvedores)
##############################################################################

section "1️⃣  OWNERS - Proprietários/Desenvolvedores"

# CREATE Owner
run_curl "Criar novo proprietário" \
"curl -X POST ${API_URL}/owners \\
  -H 'Content-Type: application/json' \\
  -d '{
    \"name\": \"João Silva\",
    \"email\": \"joao.silva@empresa.com\",
    \"role\": \"Senior Developer\",
    \"department\": \"Engineering\"
  }' | jq"

# GET All Owners
run_curl "Listar todos os proprietários" \
"curl -X GET ${API_URL}/owners | jq"

# GET Owner by ID
run_curl "Buscar proprietário por ID (substitua OWNER_ID)" \
"curl -X GET ${API_URL}/owners/OWNER_ID | jq"

# UPDATE Owner
run_curl "Atualizar proprietário (substitua OWNER_ID)" \
"curl -X PUT ${API_URL}/owners/OWNER_ID \\
  -H 'Content-Type: application/json' \\
  -d '{
    \"name\": \"João Silva\",
    \"email\": \"joao.silva@empresa.com\",
    \"role\": \"Tech Lead\",
    \"department\": \"Engineering\"
  }' | jq"

# DELETE Owner
run_curl "Deletar proprietário (substitua OWNER_ID)" \
"curl -X DELETE ${API_URL}/owners/OWNER_ID | jq"

##############################################################################
# 2. TECHNOLOGIES (Tecnologias)
##############################################################################

section "2️⃣  TECHNOLOGIES - Tecnologias"

# CREATE Technology
run_curl "Criar nova tecnologia" \
"curl -X POST ${API_URL}/technologies \\
  -H 'Content-Type: application/json' \\
  -d '{
    \"name\": \"Node.js\",
    \"version\": \"20\",
    \"category\": \"Runtime\",
    \"description\": \"JavaScript runtime built on Chrome V8 engine\",
    \"vendor\": \"OpenJS Foundation\",
    \"licenseType\": \"Open Source\",
    \"supportLevel\": \"Community\"
  }' | jq"

# GET All Technologies
run_curl "Listar todas as tecnologias" \
"curl -X GET ${API_URL}/technologies | jq"

# GET Technology by ID
run_curl "Buscar tecnologia por ID (substitua TECH_ID)" \
"curl -X GET ${API_URL}/technologies/TECH_ID | jq"

# UPDATE Technology
run_curl "Atualizar tecnologia (substitua TECH_ID)" \
"curl -X PUT ${API_URL}/technologies/TECH_ID \\
  -H 'Content-Type: application/json' \\
  -d '{
    \"name\": \"Node.js\",
    \"version\": \"20.10\",
    \"category\": \"Runtime\",
    \"description\": \"JavaScript runtime - Updated\",
    \"vendor\": \"OpenJS Foundation\",
    \"licenseType\": \"Open Source\",
    \"supportLevel\": \"LTS\"
  }' | jq"

# DELETE Technology
run_curl "Deletar tecnologia (substitua TECH_ID)" \
"curl -X DELETE ${API_URL}/technologies/TECH_ID | jq"

##############################################################################
# 3. APPLICATIONS (Aplicações)
##############################################################################

section "3️⃣  APPLICATIONS - Aplicações"

# CREATE Application
run_curl "Criar nova aplicação com tecnologias" \
"curl -X POST ${API_URL}/applications \\
  -H 'Content-Type: application/json' \\
  -d '{
    \"name\": \"Portal do Cliente\",
    \"description\": \"Sistema de atendimento ao cliente\",
    \"status\": \"Active\",
    \"criticality\": \"High\",
    \"ownerId\": \"OWNER_ID\",
    \"technologies\": [
      {
        \"technologyId\": \"TECH_ID_1\",
        \"version\": \"20\",
        \"environment\": \"Production\"
      },
      {
        \"technologyId\": \"TECH_ID_2\",
        \"version\": \"16\",
        \"environment\": \"Production\"
      }
    ]
  }' | jq"

# GET All Applications
run_curl "Listar todas as aplicações" \
"curl -X GET ${API_URL}/applications | jq"

# GET Application by ID
run_curl "Buscar aplicação por ID (substitua APP_ID)" \
"curl -X GET ${API_URL}/applications/APP_ID | jq"

# GET Application Technologies
run_curl "Listar tecnologias de uma aplicação (substitua APP_ID)" \
"curl -X GET ${API_URL}/applications/APP_ID/technologies | jq"

# UPDATE Application
run_curl "Atualizar aplicação (substitua APP_ID e IDs)" \
"curl -X PUT ${API_URL}/applications/APP_ID \\
  -H 'Content-Type: application/json' \\
  -d '{
    \"name\": \"Portal do Cliente - Atualizado\",
    \"description\": \"Sistema de atendimento ao cliente - v2\",
    \"status\": \"Active\",
    \"criticality\": \"Critical\",
    \"ownerId\": \"OWNER_ID\",
    \"technologies\": [
      {
        \"technologyId\": \"TECH_ID_1\",
        \"version\": \"20.10\",
        \"environment\": \"Production\"
      }
    ]
  }' | jq"

# DELETE Application
run_curl "Deletar aplicação (substitua APP_ID)" \
"curl -X DELETE ${API_URL}/applications/APP_ID | jq"

##############################################################################
# 4. CAPABILITIES (Capacidades)
##############################################################################

section "4️⃣  CAPABILITIES - Capacidades de Negócio"

# CREATE Capability
run_curl "Criar nova capacidade" \
"curl -X POST ${API_URL}/capabilities \\
  -H 'Content-Type: application/json' \\
  -d '{
    \"name\": \"Gestão de Clientes\",
    \"description\": \"Capacidade de gerenciar relacionamento com clientes\",
    \"category\": \"Business\",
    \"maturityLevel\": 4,
    \"strategicImportance\": \"High\"
  }' | jq"

# GET All Capabilities
run_curl "Listar todas as capacidades" \
"curl -X GET ${API_URL}/capabilities | jq"

# GET Capability by ID
run_curl "Buscar capacidade por ID (substitua CAP_ID)" \
"curl -X GET ${API_URL}/capabilities/CAP_ID | jq"

# UPDATE Capability
run_curl "Atualizar capacidade (substitua CAP_ID)" \
"curl -X PUT ${API_URL}/capabilities/CAP_ID \\
  -H 'Content-Type: application/json' \\
  -d '{
    \"name\": \"Gestão de Clientes\",
    \"description\": \"Capacidade avançada de CRM\",
    \"category\": \"Business\",
    \"maturityLevel\": 5,
    \"strategicImportance\": \"Critical\"
  }' | jq"

# DELETE Capability
run_curl "Deletar capacidade (substitua CAP_ID)" \
"curl -X DELETE ${API_URL}/capabilities/CAP_ID | jq"

##############################################################################
# 5. SKILLS (Habilidades)
##############################################################################

section "5️⃣  SKILLS - Habilidades Técnicas"

# CREATE Skill
run_curl "Criar nova habilidade com tecnologias e desenvolvedores" \
"curl -X POST ${API_URL}/skills \\
  -H 'Content-Type: application/json' \\
  -d '{
    \"name\": \"Desenvolvimento Backend\",
    \"code\": \"SKILL-BACK-001\",
    \"description\": \"Desenvolvimento de APIs e serviços server-side\",
    \"guidanceNotes\": \"Foco em Node.js e arquiteturas escaláveis\",
    \"levelDescription\": \"Níveis de 0 (sem conhecimento) a 5 (expert)\",
    \"technologies\": [
      {
        \"technologyId\": \"TECH_ID_1\",
        \"proficiencyLevel\": 4,
        \"startDate\": \"2024-01-01\",
        \"endDate\": null
      },
      {
        \"technologyId\": \"TECH_ID_2\",
        \"proficiencyLevel\": 5,
        \"startDate\": \"2024-01-01\",
        \"endDate\": null
      }
    ],
    \"developers\": [
      {
        \"ownerId\": \"OWNER_ID_1\",
        \"proficiencyLevel\": 5,
        \"certificationDate\": \"2024-06-01\",
        \"notes\": \"Certificado AWS Solutions Architect\"
      },
      {
        \"ownerId\": \"OWNER_ID_2\",
        \"proficiencyLevel\": 4,
        \"certificationDate\": \"2024-07-15\",
        \"notes\": \"Em desenvolvimento\"
      }
    ]
  }' | jq"

# GET All Skills
run_curl "Listar todas as habilidades" \
"curl -X GET ${API_URL}/skills | jq"

# GET Skill by ID
run_curl "Buscar habilidade por ID (substitua SKILL_ID)" \
"curl -X GET ${API_URL}/skills/SKILL_ID | jq"

# GET Skill Technologies
run_curl "Listar tecnologias de uma habilidade (substitua SKILL_ID)" \
"curl -X GET ${API_URL}/skills/SKILL_ID/technologies | jq"

# GET Skill Developers
run_curl "Listar desenvolvedores de uma habilidade (substitua SKILL_ID)" \
"curl -X GET ${API_URL}/skills/SKILL_ID/developers | jq"

# UPDATE Skill
run_curl "Atualizar habilidade (substitua SKILL_ID e IDs)" \
"curl -X PUT ${API_URL}/skills/SKILL_ID \\
  -H 'Content-Type: application/json' \\
  -d '{
    \"name\": \"Desenvolvimento Backend Avançado\",
    \"code\": \"SKILL-BACK-001\",
    \"description\": \"Desenvolvimento de APIs RESTful e GraphQL\",
    \"guidanceNotes\": \"Foco em arquiteturas serverless e microserviços\",
    \"levelDescription\": \"Escala 0-5 conforme complexidade de projetos\",
    \"technologies\": [
      {
        \"technologyId\": \"TECH_ID_1\",
        \"proficiencyLevel\": 5,
        \"startDate\": \"2024-01-01\",
        \"endDate\": null
      }
    ],
    \"developers\": [
      {
        \"ownerId\": \"OWNER_ID_1\",
        \"proficiencyLevel\": 5,
        \"certificationDate\": \"2024-08-01\",
        \"notes\": \"Expert certificado\"
      }
    ]
  }' | jq"

# DELETE Skill
run_curl "Deletar habilidade (substitua SKILL_ID)" \
"curl -X DELETE ${API_URL}/skills/SKILL_ID | jq"

##############################################################################
# 6. BULK OPERATIONS (Operações em lote)
##############################################################################

section "6️⃣  BULK OPERATIONS - Operações em Lote"

# Criar múltiplos owners
run_curl "Criar múltiplos proprietários de uma vez" \
"for name in 'Ana Costa' 'Carlos Souza' 'Maria Santos'; do
  curl -X POST ${API_URL}/owners \\
    -H 'Content-Type: application/json' \\
    -d '{
      \"name\": \"'\$name'\",
      \"email\": \"'\$(echo \$name | tr '[:upper:]' '[:lower:]' | tr ' ' '.')@empresa.com'\",
      \"role\": \"Developer\",
      \"department\": \"Engineering\"
    }'
  echo ''
done | jq -s"

# Buscar com filtros
run_curl "Buscar aplicações por status" \
"curl -X GET '${API_URL}/applications?status=Active' | jq"

run_curl "Buscar tecnologias por categoria" \
"curl -X GET '${API_URL}/technologies?category=Runtime' | jq"

##############################################################################
# 7. QUERIES ÚTEIS
##############################################################################

section "7️⃣  QUERIES ÚTEIS - Consultas Avançadas"

# Estatísticas gerais
run_curl "Contar total de cada entidade" \
"echo 'Owners:' && curl -s ${API_URL}/owners | jq 'length'
echo 'Technologies:' && curl -s ${API_URL}/technologies | jq 'length'
echo 'Applications:' && curl -s ${API_URL}/applications | jq 'length'
echo 'Capabilities:' && curl -s ${API_URL}/capabilities | jq 'length'
echo 'Skills:' && curl -s ${API_URL}/skills | jq 'length'"

# Listar apenas nomes
run_curl "Listar apenas nomes de todas as aplicações" \
"curl -s ${API_URL}/applications | jq '[.[] | {id, name, status}]'"

run_curl "Listar tecnologias agrupadas por categoria" \
"curl -s ${API_URL}/technologies | jq 'group_by(.category) | map({category: .[0].category, count: length, items: map(.name)})'"

# Buscar relações
run_curl "Buscar aplicações de um owner específico (substitua OWNER_ID)" \
"curl -s ${API_URL}/applications | jq '[.[] | select(.ownerId == \"OWNER_ID\")]'"

run_curl "Buscar skills de um desenvolvedor (substitua OWNER_ID)" \
"curl -s ${API_URL}/skills | jq -s 'map(select(.developers[]?.ownerId == \"OWNER_ID\"))'"

##############################################################################
# FIM
##############################################################################

section "✅ Exemplos Concluídos"

echo -e "${GREEN}Para executar um comando específico, copie e cole no terminal.${NC}"
echo -e "${GREEN}Lembre-se de substituir os IDs de exemplo (OWNER_ID, TECH_ID, etc.) pelos IDs reais.${NC}"
echo ""
echo -e "${YELLOW}Dica:${NC} Use 'jq' para formatar JSON: ${GREEN}| jq${NC}"
echo -e "${YELLOW}Dica:${NC} Salve resposta em arquivo: ${GREEN}> output.json${NC}"
echo ""
