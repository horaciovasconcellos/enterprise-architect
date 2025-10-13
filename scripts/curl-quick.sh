#!/bin/bash

##############################################################################
# Quick CURL Commands - Enterprise Architect API
#
# Comandos curl rápidos e diretos para teste
##############################################################################

API_URL="${API_URL:-http://localhost:3000/api}"

# 1. CRIAR OWNER
curl -X POST ${API_URL}/owners \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "João Silva",
    "email": "joao.silva@empresa.com",
    "role": "Senior Developer",
    "department": "Engineering"
  }'

# 2. CRIAR TECNOLOGIA
curl -X POST ${API_URL}/technologies \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Node.js",
    "version": "20",
    "category": "Runtime",
    "description": "JavaScript runtime",
    "vendor": "OpenJS Foundation",
    "licenseType": "Open Source",
    "supportLevel": "Community"
  }'

# 3. CRIAR APLICAÇÃO
# Substitua OWNER_ID e TECH_ID pelos IDs retornados acima
curl -X POST ${API_URL}/applications \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Portal do Cliente",
    "description": "Sistema de atendimento",
    "status": "Active",
    "criticality": "High",
    "ownerId": "OWNER_ID",
    "technologies": [
      {
        "technologyId": "TECH_ID",
        "version": "20",
        "environment": "Production"
      }
    ]
  }'

# 4. CRIAR CAPACIDADE
curl -X POST ${API_URL}/capabilities \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Gestão de Clientes",
    "description": "Capacidade de CRM",
    "category": "Business",
    "maturityLevel": 4,
    "strategicImportance": "High"
  }'

# 5. CRIAR SKILL
# Substitua TECH_ID e OWNER_ID pelos IDs reais
curl -X POST ${API_URL}/skills \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Desenvolvimento Backend",
    "code": "SKILL-BACK-001",
    "description": "Desenvolvimento de APIs",
    "guidanceNotes": "Foco em Node.js",
    "levelDescription": "Níveis 0-5",
    "technologies": [
      {
        "technologyId": "TECH_ID",
        "proficiencyLevel": 4,
        "startDate": "2024-01-01",
        "endDate": null
      }
    ],
    "developers": [
      {
        "ownerId": "OWNER_ID",
        "proficiencyLevel": 5,
        "certificationDate": "2024-06-01",
        "notes": "Expert"
      }
    ]
  }'

# LISTAR TUDO
echo "=== OWNERS ==="
curl -s ${API_URL}/owners | jq

echo "=== TECHNOLOGIES ==="
curl -s ${API_URL}/technologies | jq

echo "=== APPLICATIONS ==="
curl -s ${API_URL}/applications | jq

echo "=== CAPABILITIES ==="
curl -s ${API_URL}/capabilities | jq

echo "=== SKILLS ==="
curl -s ${API_URL}/skills | jq
