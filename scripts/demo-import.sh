#!/bin/bash

##############################################################################
# DEMO - Importação de Dados Enterprise Architect
#
# Este script demonstra como importar dados usando curl
##############################################################################

API_URL="http://localhost:3000/api"

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         DEMO - Importação de Dados via CURL                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# 1. Criar Owner
echo -e "${YELLOW}[1/5] Criando Owner...${NC}"
OWNER_RESPONSE=$(curl -s -X POST ${API_URL}/owners \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Demo Developer",
    "email": "demo@empresa.com",
    "role": "Full Stack Developer",
    "department": "Engineering"
  }')

OWNER_ID=$(echo $OWNER_RESPONSE | jq -r '.id')
echo -e "${GREEN}✅ Owner criado: $OWNER_ID${NC}"
echo "$OWNER_RESPONSE" | jq '.'
echo ""
sleep 1

# 2. Criar Technology
echo -e "${YELLOW}[2/5] Criando Technology...${NC}"
TECH_RESPONSE=$(curl -s -X POST ${API_URL}/technologies \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Node.js",
    "version": "20",
    "category": "Runtime",
    "description": "JavaScript runtime built on V8 engine - Demo",
    "vendor": "OpenJS Foundation",
    "licenseType": "Open Source",
    "supportLevel": "Community"
  }')

TECH_ID=$(echo $TECH_RESPONSE | jq -r '.id')
echo -e "${GREEN}✅ Technology criada: $TECH_ID${NC}"
echo "$TECH_RESPONSE" | jq '.'
echo ""
sleep 1

# 3. Criar Application
echo -e "${YELLOW}[3/5] Criando Application com Technology...${NC}"
APP_RESPONSE=$(curl -s -X POST ${API_URL}/applications \
  -H 'Content-Type: application/json' \
  -d "{
    \"name\": \"Demo Application\",
    \"description\": \"Aplicação de demonstração criada via curl\",
    \"status\": \"Active\",
    \"criticality\": \"High\",
    \"ownerId\": \"$OWNER_ID\",
    \"technologies\": [
      {
        \"technologyId\": \"$TECH_ID\",
        \"version\": \"20\",
        \"environment\": \"Production\"
      }
    ]
  }")

APP_ID=$(echo $APP_RESPONSE | jq -r '.id')
echo -e "${GREEN}✅ Application criada: $APP_ID${NC}"
echo "$APP_RESPONSE" | jq '.'
echo ""
sleep 1

# 4. Criar Capability
echo -e "${YELLOW}[4/5] Criando Capability...${NC}"
CAP_RESPONSE=$(curl -s -X POST ${API_URL}/capabilities \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Demo Capability",
    "description": "Capacidade de demonstração",
    "category": "Technical",
    "maturityLevel": 3,
    "strategicImportance": "Medium"
  }')

CAP_ID=$(echo $CAP_RESPONSE | jq -r '.id')
echo -e "${GREEN}✅ Capability criada: $CAP_ID${NC}"
echo "$CAP_RESPONSE" | jq '.'
echo ""
sleep 1

# 5. Criar Skill
echo -e "${YELLOW}[5/5] Criando Skill com Developer e Technology...${NC}"
SKILL_RESPONSE=$(curl -s -X POST ${API_URL}/skills \
  -H 'Content-Type: application/json' \
  -d "{
    \"name\": \"Demo Full Stack Skill\",
    \"code\": \"DEMO-SKILL-001\",
    \"description\": \"Habilidade demonstrativa de desenvolvimento full stack\",
    \"guidanceNotes\": \"Esta é uma skill de demonstração criada via curl\",
    \"levelDescription\": \"Níveis de 0 a 5 conforme proficiência\",
    \"technologies\": [
      {
        \"technologyId\": \"$TECH_ID\",
        \"proficiencyLevel\": 4,
        \"startDate\": \"$(date +%Y-%m-%d)\",
        \"endDate\": null
      }
    ],
    \"developers\": [
      {
        \"ownerId\": \"$OWNER_ID\",
        \"proficiencyLevel\": 5,
        \"certificationDate\": \"$(date +%Y-%m-%d)\",
        \"notes\": \"Developer demo com certificação\"
      }
    ]
  }")

SKILL_ID=$(echo $SKILL_RESPONSE | jq -r '.id')
echo -e "${GREEN}✅ Skill criada: $SKILL_ID${NC}"
echo "$SKILL_RESPONSE" | jq '.'
echo ""

# Resumo
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    DEMO CONCLUÍDA!                         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}📊 Registros criados:${NC}"
echo -e "   • Owner:       ${YELLOW}$OWNER_ID${NC}"
echo -e "   • Technology:  ${YELLOW}$TECH_ID${NC}"
echo -e "   • Application: ${YELLOW}$APP_ID${NC}"
echo -e "   • Capability:  ${YELLOW}$CAP_ID${NC}"
echo -e "   • Skill:       ${YELLOW}$SKILL_ID${NC}"
echo ""
echo -e "${GREEN}🌐 Verifique na aplicação:${NC}"
echo -e "   ${BLUE}http://localhost:5173${NC}"
echo ""
echo -e "${GREEN}🔍 Listar todos via curl:${NC}"
echo -e "   curl ${API_URL}/owners | jq"
echo -e "   curl ${API_URL}/technologies | jq"
echo -e "   curl ${API_URL}/applications | jq"
echo -e "   curl ${API_URL}/capabilities | jq"
echo -e "   curl ${API_URL}/skills | jq"
echo ""
