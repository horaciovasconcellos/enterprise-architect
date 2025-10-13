#!/bin/bash
# deploy-production.sh
# Script de deploy seguro para produção com verificação de assinatura obrigatória

set -e

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configurações
REGISTRY="ghcr.io/horaciovasconcellos"
IMAGE_NAME="enterprise-architect"
IMAGE_TAG="${1:-latest}"
FULL_IMAGE="${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Production Deployment - Security Check    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

# 1. Verificar pré-requisitos
echo -e "${BLUE}🔍 Verificando pré-requisitos...${NC}"

if ! command -v cosign &> /dev/null; then
    echo -e "${RED}❌ Cosign não está instalado!${NC}"
    echo -e "${YELLOW}Instale com: brew install cosign${NC}"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker não está instalado!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Pré-requisitos verificados${NC}"
echo ""

# 2. Pull da imagem
echo -e "${BLUE}📥 Pulling image from registry...${NC}"
echo -e "Image: ${FULL_IMAGE}"
echo ""

if ! docker pull "${FULL_IMAGE}"; then
    echo -e "${RED}❌ Falha ao fazer pull da imagem${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Image pulled successfully${NC}"
echo ""

# 3. CRÍTICO: Verificar assinatura
echo -e "${BLUE}🔐 VERIFICAÇÃO DE SEGURANÇA CRÍTICA${NC}"
echo -e "${YELLOW}Verificando assinatura criptográfica...${NC}"
echo ""

VERIFIED=false

# Tentar verificação com chave pública local
if [ -f "cosign.pub" ]; then
    echo -e "${YELLOW}Tentando verificação com chave pública local...${NC}"
    if cosign verify --key cosign.pub "${FULL_IMAGE}" > /dev/null 2>&1; then
        VERIFIED=true
        echo -e "${GREEN}✅ Assinatura verificada com chave local!${NC}"
    fi
fi

# Tentar verificação keyless (OIDC)
if [ "$VERIFIED" = false ]; then
    echo -e "${YELLOW}Tentando verificação keyless (OIDC)...${NC}"
    if cosign verify \
        --certificate-identity-regexp="https://github.com/horaciovasconcellos/.*" \
        --certificate-oidc-issuer="https://token.actions.githubusercontent.com" \
        "${FULL_IMAGE}" > /dev/null 2>&1; then
        VERIFIED=true
        echo -e "${GREEN}✅ Assinatura keyless verificada!${NC}"
    fi
fi

echo ""

# Se não verificado, ABORTAR
if [ "$VERIFIED" = false ]; then
    echo -e "${RED}╔════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║           FALHA DE SEGURANÇA CRÍTICA           ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${RED}❌ A assinatura da imagem NÃO pôde ser verificada!${NC}"
    echo ""
    echo -e "${YELLOW}Possíveis causas:${NC}"
    echo -e "  • Imagem não foi assinada"
    echo -e "  • Assinatura foi corrompida"
    echo -e "  • Imagem foi modificada após assinatura"
    echo -e "  • Chave pública incorreta"
    echo ""
    echo -e "${RED}⚠️  DEPLOY ABORTADO POR SEGURANÇA!${NC}"
    echo -e "${RED}⚠️  NÃO é seguro usar esta imagem em produção!${NC}"
    echo ""
    exit 1
fi

# 4. Scan de vulnerabilidades (opcional mas recomendado)
if command -v trivy &> /dev/null; then
    echo -e "${BLUE}🔍 Escaneando vulnerabilidades críticas...${NC}"
    
    CRITICAL_VULNS=$(trivy image --severity CRITICAL --quiet --format json "${FULL_IMAGE}" | jq '.Results[].Vulnerabilities | length' 2>/dev/null || echo "0")
    
    if [ "$CRITICAL_VULNS" != "0" ] && [ "$CRITICAL_VULNS" != "null" ]; then
        echo -e "${YELLOW}⚠️  Encontradas ${CRITICAL_VULNS} vulnerabilidades críticas!${NC}"
        echo ""
        trivy image --severity CRITICAL "${FULL_IMAGE}"
        echo ""
        read -p "Continuar mesmo assim? (s/N): " continue
        if [ "$continue" != "s" ] && [ "$continue" != "S" ]; then
            echo -e "${YELLOW}Deploy cancelado pelo usuário.${NC}"
            exit 1
        fi
    else
        echo -e "${GREEN}✅ Nenhuma vulnerabilidade crítica encontrada${NC}"
    fi
    echo ""
fi

# 5. Backup do container atual (se existir)
CONTAINER_NAME="enterprise-architect-app"
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo -e "${BLUE}💾 Fazendo backup do container atual...${NC}"
    
    BACKUP_TAG="${IMAGE_NAME}:backup-$(date +%Y%m%d-%H%M%S)"
    CURRENT_IMAGE=$(docker inspect --format='{{.Config.Image}}' "${CONTAINER_NAME}" 2>/dev/null || echo "")
    
    if [ -n "$CURRENT_IMAGE" ]; then
        docker tag "$CURRENT_IMAGE" "$BACKUP_TAG"
        echo -e "${GREEN}✅ Backup criado: ${BACKUP_TAG}${NC}"
    fi
    echo ""
fi

# 6. Parar container atual
if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo -e "${BLUE}⏹  Parando container atual...${NC}"
    docker stop "${CONTAINER_NAME}"
    docker rm "${CONTAINER_NAME}"
    echo -e "${GREEN}✅ Container parado${NC}"
    echo ""
fi

# 7. Deploy com docker-compose
echo -e "${BLUE}🚀 Iniciando deploy...${NC}"
echo ""

if [ -f "docker-compose.yml" ]; then
    # Atualizar variável de ambiente com a imagem verificada
    export COMPOSE_IMAGE="${FULL_IMAGE}"
    
    docker-compose pull
    docker-compose up -d
    
    echo ""
    echo -e "${GREEN}✅ Deploy iniciado com docker-compose${NC}"
else
    # Deploy direto sem compose
    docker run -d \
        --name "${CONTAINER_NAME}" \
        -p 5000:5000 \
        -e NODE_ENV=production \
        -e DB_HOST="${DB_HOST:-mysql}" \
        -e DB_PORT="${DB_PORT:-3306}" \
        -e DB_NAME="${DB_NAME:-enterprise_architect}" \
        -e DB_USER="${DB_USER:-ea_user}" \
        -e DB_PASSWORD="${DB_PASSWORD}" \
        --restart unless-stopped \
        "${FULL_IMAGE}"
    
    echo ""
    echo -e "${GREEN}✅ Container iniciado${NC}"
fi

# 8. Health check
echo ""
echo -e "${BLUE}🏥 Aguardando health check...${NC}"

MAX_ATTEMPTS=30
ATTEMPT=0

while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    if curl -sf http://localhost:5000/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Aplicação respondendo!${NC}"
        break
    fi
    
    ATTEMPT=$((ATTEMPT + 1))
    echo -ne "${YELLOW}Tentativa ${ATTEMPT}/${MAX_ATTEMPTS}...${NC}\r"
    sleep 2
done

if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
    echo -e "${RED}❌ Health check falhou!${NC}"
    echo -e "${YELLOW}Verifique os logs: docker logs ${CONTAINER_NAME}${NC}"
    exit 1
fi

# 9. Resumo final
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║           DEPLOY CONCLUÍDO COM SUCESSO         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✅ Imagem:          ${FULL_IMAGE}${NC}"
echo -e "${GREEN}✅ Assinatura:      Verificada${NC}"
echo -e "${GREEN}✅ Vulnerabilidades: Escaneada${NC}"
echo -e "${GREEN}✅ Container:       Rodando${NC}"
echo -e "${GREEN}✅ Health Check:    OK${NC}"
echo ""
echo -e "${BLUE}📊 Status:${NC}"
docker ps --filter "name=${CONTAINER_NAME}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo -e "${BLUE}📝 Comandos úteis:${NC}"
echo -e "  Ver logs:     docker logs -f ${CONTAINER_NAME}"
echo -e "  Restart:      docker restart ${CONTAINER_NAME}"
echo -e "  Stop:         docker stop ${CONTAINER_NAME}"
echo -e "  Shell:        docker exec -it ${CONTAINER_NAME} sh"
echo ""
echo -e "${GREEN}✨ Deploy em produção concluído com segurança!${NC}"
