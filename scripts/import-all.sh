#!/bin/bash

##############################################################################
# Import All Data - Enterprise Architect
#
# Script completo para importar todos os dados de arquivos CSV
#
# Uso:
#   chmod +x scripts/import-all.sh
#   ./scripts/import-all.sh
##############################################################################

set -e

API_URL="${API_BASE_URL:-http://localhost:3000/api}"
DATA_DIR="./data"

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                            ║${NC}"
echo -e "${BLUE}║          🚀 IMPORTAÇÃO COMPLETA - CSV TO API               ║${NC}"
echo -e "${BLUE}║              Enterprise Architect Data Import              ║${NC}"
echo -e "${BLUE}║                                                            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar se servidor está rodando
echo -e "${YELLOW}🔍 Verificando conectividade da API...${NC}"
if ! curl -s --max-time 5 "$API_URL/owners" > /dev/null 2>&1; then
  echo -e "${RED}❌ API não está respondendo em $API_URL${NC}"
  echo -e "${YELLOW}💡 Inicie o servidor com: npm run server:dev${NC}"
  exit 1
fi
echo -e "${GREEN}✅ API está online e respondendo${NC}"
echo ""

# Verificar se arquivos CSV existem
echo -e "${YELLOW}📁 Verificando arquivos CSV...${NC}"
MISSING_FILES=0

for file in owners technologies applications capabilities skills; do
  if [ ! -f "$DATA_DIR/${file}.csv" ]; then
    echo -e "${RED}   ❌ Arquivo não encontrado: $DATA_DIR/${file}.csv${NC}"
    MISSING_FILES=$((MISSING_FILES + 1))
  else
    LINES=$(wc -l < "$DATA_DIR/${file}.csv")
    echo -e "${GREEN}   ✅ ${file}.csv encontrado ($LINES linhas)${NC}"
  fi
done

if [ $MISSING_FILES -gt 0 ]; then
  echo -e "${RED}❌ $MISSING_FILES arquivo(s) CSV não encontrado(s)${NC}"
  exit 1
fi
echo ""

# Perguntar confirmação
echo -e "${YELLOW}⚠️  Esta operação irá importar dados para a API${NC}"
echo -e "${YELLOW}   API URL: $API_URL${NC}"
echo -e "${YELLOW}   Data Dir: $DATA_DIR${NC}"
echo ""
read -p "Deseja continuar? (s/N): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[SsYy]$ ]]; then
  echo -e "${YELLOW}❌ Importação cancelada pelo usuário${NC}"
  exit 0
fi
echo ""

START_TIME=$(date +%s)

# 1. Importar Owners
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║ [1/5] 📝 IMPORTANDO OWNERS (Proprietários/Desenvolvedores)║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
npm run import:csv owners "$DATA_DIR/owners.csv"
OWNERS_COUNT=$(curl -s "$API_URL/owners" | jq 'length' 2>/dev/null || echo "?")
echo -e "${GREEN}✅ Owners importados: $OWNERS_COUNT${NC}"
echo ""
sleep 1

# 2. Importar Technologies
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║ [2/5] 💻 IMPORTANDO TECHNOLOGIES (Tecnologias)            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
npm run import:csv technologies "$DATA_DIR/technologies.csv"
TECH_COUNT=$(curl -s "$API_URL/technologies" | jq 'length' 2>/dev/null || echo "?")
echo -e "${GREEN}✅ Technologies importadas: $TECH_COUNT${NC}"
echo ""
sleep 1

# 3. Importar Applications
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║ [3/5] 📱 IMPORTANDO APPLICATIONS (Aplicações)             ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
npm run import:csv applications "$DATA_DIR/applications.csv"
APP_COUNT=$(curl -s "$API_URL/applications" | jq 'length' 2>/dev/null || echo "?")
echo -e "${GREEN}✅ Applications importadas: $APP_COUNT${NC}"
echo ""
sleep 1

# 4. Importar Capabilities
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║ [4/5] 🎯 IMPORTANDO CAPABILITIES (Capacidades)            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
npm run import:csv capabilities "$DATA_DIR/capabilities.csv"
CAP_COUNT=$(curl -s "$API_URL/capabilities" | jq 'length' 2>/dev/null || echo "?")
echo -e "${GREEN}✅ Capabilities importadas: $CAP_COUNT${NC}"
echo ""
sleep 1

# 5. Importar Skills
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║ [5/5] 🎓 IMPORTANDO SKILLS (Habilidades)                  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
npm run import:csv skills "$DATA_DIR/skills.csv"
SKILL_COUNT=$(curl -s "$API_URL/skills" | jq 'length' 2>/dev/null || echo "?")
echo -e "${GREEN}✅ Skills importadas: $SKILL_COUNT${NC}"
echo ""

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))

# Resumo final
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                                                            ║${NC}"
echo -e "${GREEN}║              ✅ IMPORTAÇÃO CONCLUÍDA COM SUCESSO!          ║${NC}"
echo -e "${GREEN}║                                                            ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📊 RESUMO DA IMPORTAÇÃO:${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "   ${GREEN}•${NC} Owners (Proprietários):    ${YELLOW}$OWNERS_COUNT${NC}"
echo -e "   ${GREEN}•${NC} Technologies (Tecnologias): ${YELLOW}$TECH_COUNT${NC}"
echo -e "   ${GREEN}•${NC} Applications (Aplicações):  ${YELLOW}$APP_COUNT${NC}"
echo -e "   ${GREEN}•${NC} Capabilities (Capacidades): ${YELLOW}$CAP_COUNT${NC}"
echo -e "   ${GREEN}•${NC} Skills (Habilidades):       ${YELLOW}$SKILL_COUNT${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "   ${GREEN}⏱️  Tempo total:${NC} ${DURATION}s"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}🌐 Acesse a aplicação:${NC} ${BLUE}http://localhost:5173${NC}"
echo -e "${GREEN}📡 API disponível em:${NC} ${BLUE}$API_URL${NC}"
echo ""
echo -e "${YELLOW}💡 Próximos passos:${NC}"
echo -e "   1. Acesse http://localhost:5173 no navegador"
echo -e "   2. Navegue pelo menu lateral para ver os dados importados"
echo -e "   3. Edite, crie ou remova registros pela interface"
echo ""
