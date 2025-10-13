#!/bin/bash
set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
IMAGE_NAME="enterprise-architect"
IMAGE_TAG="${1:-latest}"
REGISTRY="${DOCKER_REGISTRY:-ghcr.io/horaciovasconcellos}"
FULL_IMAGE="${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
USE_KEYLESS="${USE_KEYLESS:-false}"

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║  Enterprise Architect - Build & Sign Script   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker não está rodando. Inicie o Docker Desktop.${NC}"
    exit 1
fi

# Verificar se Cosign está instalado
if ! command -v cosign &> /dev/null; then
    echo -e "${RED}❌ Cosign não está instalado.${NC}"
    echo -e "${YELLOW}Instale com: brew install cosign${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Pré-requisitos verificados${NC}"
echo ""

# Build da imagem
echo -e "${BLUE}🔨 Building Docker image...${NC}"
echo -e "Image: ${FULL_IMAGE}"
echo ""

docker build \
    --progress=plain \
    -t "${FULL_IMAGE}" \
    -t "${IMAGE_NAME}:${IMAGE_TAG}" \
    -t "${IMAGE_NAME}:latest" \
    .

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Build concluído com sucesso!${NC}"
else
    echo -e "${RED}❌ Falha no build${NC}"
    exit 1
fi

# Mostrar informações da imagem
echo ""
echo -e "${BLUE}📊 Informações da imagem:${NC}"
docker images | head -n 1
docker images | grep "${IMAGE_NAME}" | head -n 3
echo ""

# Obter o digest da imagem
IMAGE_DIGEST=$(docker inspect --format='{{index .RepoDigests 0}}' "${FULL_IMAGE}" 2>/dev/null || echo "")
if [ -z "$IMAGE_DIGEST" ]; then
    IMAGE_DIGEST=$(docker inspect --format='{{.Id}}' "${IMAGE_NAME}:${IMAGE_TAG}")
fi
echo -e "${BLUE}Digest: ${IMAGE_DIGEST}${NC}"
echo ""

# Decisão de método de assinatura
if [ "$USE_KEYLESS" = "true" ]; then
    echo -e "${YELLOW}🔐 Assinando com Keyless (OIDC)...${NC}"
    echo -e "${YELLOW}Você será redirecionado para autenticação no navegador${NC}"
    echo ""
    
    cosign sign --yes "${FULL_IMAGE}"
    VERIFY_CMD="cosign verify --certificate-identity-regexp='https://github.com/.*' --certificate-oidc-issuer='https://token.actions.githubusercontent.com' ${FULL_IMAGE}"
    
elif [ -f "cosign.key" ]; then
    echo -e "${YELLOW}🔐 Assinando com chave local (cosign.key)...${NC}"
    echo ""
    
    if [ -z "${COSIGN_PASSWORD}" ]; then
        echo -e "${YELLOW}Digite a senha da chave privada:${NC}"
        read -s COSIGN_PASSWORD
        export COSIGN_PASSWORD
    fi
    
    cosign sign --key cosign.key "${FULL_IMAGE}"
    VERIFY_CMD="cosign verify --key cosign.pub ${FULL_IMAGE}"
    
else
    echo -e "${YELLOW}⚠️  Nenhuma chave encontrada. Gerando par de chaves...${NC}"
    echo ""
    
    if [ ! -f "cosign.key" ]; then
        echo -e "${YELLOW}Digite uma senha para a chave privada:${NC}"
        cosign generate-key-pair
        
        # Adicionar ao .gitignore
        if ! grep -q "cosign.key" .gitignore 2>/dev/null; then
            echo "cosign.key" >> .gitignore
            echo -e "${GREEN}✅ cosign.key adicionado ao .gitignore${NC}"
        fi
    fi
    
    echo -e "${YELLOW}🔐 Assinando com chave recém-criada...${NC}"
    cosign sign --key cosign.key "${FULL_IMAGE}"
    VERIFY_CMD="cosign verify --key cosign.pub ${FULL_IMAGE}"
fi

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Imagem assinada com sucesso!${NC}"
else
    echo -e "${RED}❌ Falha na assinatura${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║              Resumo do Build                   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "📦 Imagem:     ${GREEN}${FULL_IMAGE}${NC}"
echo -e "🏷️  Tag:        ${GREEN}${IMAGE_TAG}${NC}"
echo -e "🔐 Assinatura: ${GREEN}Verificada${NC}"
echo ""

echo -e "${BLUE}📋 Comandos úteis:${NC}"
echo ""
echo -e "${YELLOW}Verificar assinatura:${NC}"
echo "  ${VERIFY_CMD}"
echo ""
echo -e "${YELLOW}Ver árvore de assinaturas:${NC}"
echo "  cosign tree ${FULL_IMAGE}"
echo ""
echo -e "${YELLOW}Executar container:${NC}"
echo "  docker run -d -p 5000:5000 --name ea-app ${IMAGE_NAME}:${IMAGE_TAG}"
echo ""
echo -e "${YELLOW}Push para registry:${NC}"
echo "  docker push ${FULL_IMAGE}"
echo ""

# Opção de verificar imediatamente
echo -e "${YELLOW}Deseja verificar a assinatura agora? (s/N)${NC}"
read -r response
if [[ "$response" =~ ^([sS][iI][mM]|[sS])$ ]]; then
    echo ""
    echo -e "${BLUE}🔍 Verificando assinatura...${NC}"
    eval "${VERIFY_CMD}"
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✅ Assinatura verificada com sucesso!${NC}"
    else
        echo -e "${RED}❌ Falha na verificação da assinatura${NC}"
    fi
fi

echo ""
echo -e "${GREEN}✨ Processo concluído!${NC}"
