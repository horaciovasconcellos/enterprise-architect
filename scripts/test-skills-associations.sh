#!/bin/bash

# 🧪 Teste Rápido - Skills Associations
# Valida se as associações estão sendo carregadas corretamente

set -e  # Sair em caso de erro

echo "🧪 Testando Skills Associations"
echo "================================"
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# URL base da API
API_BASE="http://localhost:3000/api"

echo "📡 Testando conectividade..."
if ! curl -sf "${API_BASE}/skills" > /dev/null 2>&1; then
    echo -e "${RED}❌ Erro: Servidor não está rodando em localhost:3000${NC}"
    echo ""
    echo "Para iniciar o servidor, execute:"
    echo "  npm run server:dev"
    exit 1
fi
echo -e "${GREEN}✅ Servidor está rodando${NC}"
echo ""

# Função para verificar se jq está instalado
check_jq() {
    if ! command -v jq &> /dev/null; then
        echo -e "${YELLOW}⚠️  jq não está instalado. Instalando...${NC}"
        
        if [[ "$OSTYPE" == "darwin"* ]]; then
            brew install jq
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            sudo apt-get install -y jq
        else
            echo -e "${RED}❌ Sistema operacional não suportado. Instale jq manualmente.${NC}"
            exit 1
        fi
    fi
}

check_jq

echo "🔍 Teste 1: Listar todas as skills"
echo "-----------------------------------"
RESPONSE=$(curl -s "${API_BASE}/skills")
SKILL_COUNT=$(echo "$RESPONSE" | jq '. | length')

if [ "$SKILL_COUNT" -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Nenhuma skill encontrada no banco${NC}"
    echo ""
    echo "Para criar skills de teste, execute:"
    echo "  ./scripts/import-all.sh"
    echo ""
    exit 0
fi

echo -e "${GREEN}✅ Encontradas $SKILL_COUNT skills${NC}"
echo ""

echo "🔍 Teste 2: Verificar associações"
echo "-----------------------------------"

# Pegar primeira skill
FIRST_SKILL=$(echo "$RESPONSE" | jq '.[0]')
SKILL_NAME=$(echo "$FIRST_SKILL" | jq -r '.name')
SKILL_ID=$(echo "$FIRST_SKILL" | jq -r '.id')

echo -e "${BLUE}Analisando skill: $SKILL_NAME${NC}"
echo ""

# Verificar se tem campo technologies
if echo "$FIRST_SKILL" | jq -e '.technologies' > /dev/null 2>&1; then
    TECH_COUNT=$(echo "$FIRST_SKILL" | jq '.technologies | length')
    echo -e "${GREEN}✅ Campo 'technologies' existe${NC}"
    echo "   Tecnologias: $TECH_COUNT"
    
    if [ "$TECH_COUNT" -gt 0 ]; then
        echo ""
        echo "   Tecnologias encontradas:"
        echo "$FIRST_SKILL" | jq -r '.technologies[] | "     - \(.technologyName) (nível \(.proficiencyLevel))"'
    fi
else
    echo -e "${RED}❌ Campo 'technologies' NÃO existe na resposta!${NC}"
    echo ""
    echo "Resposta da API:"
    echo "$FIRST_SKILL" | jq '.'
    exit 1
fi

echo ""

# Verificar se tem campo developers
if echo "$FIRST_SKILL" | jq -e '.developers' > /dev/null 2>&1; then
    DEV_COUNT=$(echo "$FIRST_SKILL" | jq '.developers | length')
    echo -e "${GREEN}✅ Campo 'developers' existe${NC}"
    echo "   Desenvolvedores: $DEV_COUNT"
    
    if [ "$DEV_COUNT" -gt 0 ]; then
        echo ""
        echo "   Desenvolvedores encontrados:"
        echo "$FIRST_SKILL" | jq -r '.developers[] | "     - \(.ownerName) (nível \(.proficiencyLevel))"'
    fi
else
    echo -e "${RED}❌ Campo 'developers' NÃO existe na resposta!${NC}"
    echo ""
    echo "Resposta da API:"
    echo "$FIRST_SKILL" | jq '.'
    exit 1
fi

echo ""
echo "-----------------------------------"
echo ""

echo "🔍 Teste 3: Verificar GET /api/skills/:id"
echo "-----------------------------------"
DETAIL_RESPONSE=$(curl -s "${API_BASE}/skills/${SKILL_ID}")

if echo "$DETAIL_RESPONSE" | jq -e '.technologies' > /dev/null 2>&1 && \
   echo "$DETAIL_RESPONSE" | jq -e '.developers' > /dev/null 2>&1; then
    DETAIL_TECH=$(echo "$DETAIL_RESPONSE" | jq '.technologies | length')
    DETAIL_DEV=$(echo "$DETAIL_RESPONSE" | jq '.developers | length')
    echo -e "${GREEN}✅ findById também retorna associações${NC}"
    echo "   Tecnologias: $DETAIL_TECH"
    echo "   Desenvolvedores: $DETAIL_DEV"
else
    echo -e "${RED}❌ findById NÃO retorna associações${NC}"
    exit 1
fi

echo ""
echo "-----------------------------------"
echo ""

echo "🔍 Teste 4: Verificar múltiplas skills"
echo "-----------------------------------"

SKILLS_WITH_TECH=0
SKILLS_WITH_DEV=0

for i in $(seq 0 $((SKILL_COUNT - 1))); do
    SKILL=$(echo "$RESPONSE" | jq ".[$i]")
    TECH_CNT=$(echo "$SKILL" | jq '.technologies | length')
    DEV_CNT=$(echo "$SKILL" | jq '.developers | length')
    
    if [ "$TECH_CNT" -gt 0 ]; then
        SKILLS_WITH_TECH=$((SKILLS_WITH_TECH + 1))
    fi
    
    if [ "$DEV_CNT" -gt 0 ]; then
        SKILLS_WITH_DEV=$((SKILLS_WITH_DEV + 1))
    fi
done

echo "Total de skills: $SKILL_COUNT"
echo "Skills com tecnologias: $SKILLS_WITH_TECH"
echo "Skills com desenvolvedores: $SKILLS_WITH_DEV"

if [ "$SKILLS_WITH_TECH" -gt 0 ] || [ "$SKILLS_WITH_DEV" -gt 0 ]; then
    echo -e "${GREEN}✅ Associações sendo carregadas corretamente${NC}"
else
    echo -e "${YELLOW}⚠️  Nenhuma skill tem associações cadastradas${NC}"
    echo ""
    echo "Para adicionar associações:"
    echo "1. Acesse http://localhost:5173"
    echo "2. Vá em Habilidades"
    echo "3. Edite uma skill existente"
    echo "4. Adicione tecnologias e desenvolvedores"
fi

echo ""
echo "================================"
echo -e "${GREEN}✅ Todos os testes passaram!${NC}"
echo ""
echo "📊 Resumo:"
echo "  - API respondendo: ✅"
echo "  - Campo technologies presente: ✅"
echo "  - Campo developers presente: ✅"
echo "  - findAll com associações: ✅"
echo "  - findById com associações: ✅"
echo ""
echo "🎉 Skills associations funcionando corretamente!"
