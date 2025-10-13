#!/bin/bash
set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
IMAGE_NAME="${1:-enterprise-architect:latest}"
USE_KEYLESS="${USE_KEYLESS:-false}"

echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Cosign Signature Verification Tool        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

# Verificar se Cosign está instalado
if ! command -v cosign &> /dev/null; then
    echo -e "${RED}❌ Cosign não está instalado.${NC}"
    echo -e "${YELLOW}Instale com: brew install cosign${NC}"
    exit 1
fi

echo -e "${BLUE}🔍 Verificando imagem: ${GREEN}${IMAGE_NAME}${NC}"
echo ""

# Verificar se a imagem existe
if ! docker image inspect "${IMAGE_NAME}" > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Imagem não encontrada localmente. Tentando pull...${NC}"
    docker pull "${IMAGE_NAME}" || {
        echo -e "${RED}❌ Não foi possível obter a imagem${NC}"
        exit 1
    }
fi

# Obter informações da imagem
echo -e "${BLUE}📊 Informações da imagem:${NC}"
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}" | grep -E "(REPOSITORY|${IMAGE_NAME%:*})"
echo ""

# Obter digest
IMAGE_DIGEST=$(docker inspect --format='{{index .RepoDigests 0}}' "${IMAGE_NAME}" 2>/dev/null || echo "")
if [ -n "$IMAGE_DIGEST" ]; then
    echo -e "${BLUE}Digest: ${GREEN}${IMAGE_DIGEST}${NC}"
    echo ""
fi

# Ver árvore de assinaturas
echo -e "${BLUE}🌳 Árvore de assinaturas:${NC}"
cosign tree "${IMAGE_NAME}" || echo -e "${YELLOW}Nenhuma assinatura encontrada${NC}"
echo ""

# Verificação de assinatura
echo -e "${BLUE}🔐 Verificando assinatura...${NC}"
echo ""

VERIFIED=false

# Tentar verificação com chave local
if [ -f "cosign.pub" ] && [ "$USE_KEYLESS" != "true" ]; then
    echo -e "${YELLOW}Tentando verificação com chave local (cosign.pub)...${NC}"
    if cosign verify --key cosign.pub "${IMAGE_NAME}" 2>&1 | tee /tmp/cosign-verify.log; then
        VERIFIED=true
        echo ""
        echo -e "${GREEN}✅ Assinatura verificada com chave local!${NC}"
    else
        echo -e "${YELLOW}⚠️  Verificação com chave local falhou${NC}"
    fi
    echo ""
fi

# Tentar verificação keyless
if [ "$VERIFIED" = false ] || [ "$USE_KEYLESS" = "true" ]; then
    echo -e "${YELLOW}Tentando verificação keyless (OIDC)...${NC}"
    
    # Tentar diferentes issuers
    ISSUERS=(
        "https://token.actions.githubusercontent.com"
        "https://oauth2.sigstore.dev/auth"
    )
    
    for issuer in "${ISSUERS[@]}"; do
        echo -e "${BLUE}Tentando issuer: ${issuer}${NC}"
        if cosign verify \
            --certificate-identity-regexp="https://github.com/.*" \
            --certificate-oidc-issuer="${issuer}" \
            "${IMAGE_NAME}" 2>&1 | tee /tmp/cosign-verify-keyless.log; then
            VERIFIED=true
            echo ""
            echo -e "${GREEN}✅ Assinatura keyless verificada!${NC}"
            break
        fi
    done
fi

echo ""

# Verificar attestations
echo -e "${BLUE}📋 Verificando attestations...${NC}"
if cosign verify-attestation --key cosign.pub "${IMAGE_NAME}" 2>/dev/null || \
   cosign verify-attestation \
     --certificate-identity-regexp="https://github.com/.*" \
     --certificate-oidc-issuer="https://token.actions.githubusercontent.com" \
     "${IMAGE_NAME}" 2>/dev/null; then
    echo -e "${GREEN}✅ Attestations encontradas e verificadas${NC}"
else
    echo -e "${YELLOW}⚠️  Nenhuma attestation encontrada${NC}"
fi

echo ""

# Resultado final
echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║              Resultado da Verificação          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"
echo ""

if [ "$VERIFIED" = true ]; then
    echo -e "${GREEN}✅ VERIFICAÇÃO BEM-SUCEDIDA${NC}"
    echo ""
    echo -e "${GREEN}A imagem foi assinada e a assinatura é válida.${NC}"
    echo -e "${GREEN}É seguro usar esta imagem.${NC}"
    echo ""
    exit 0
else
    echo -e "${RED}❌ VERIFICAÇÃO FALHOU${NC}"
    echo ""
    echo -e "${RED}A assinatura não pôde ser verificada.${NC}"
    echo -e "${YELLOW}Possíveis causas:${NC}"
    echo -e "  • A imagem não está assinada"
    echo -e "  • A chave pública não está disponível"
    echo -e "  • A assinatura foi corrompida"
    echo -e "  • A imagem foi modificada após a assinatura"
    echo ""
    echo -e "${RED}⚠️  NÃO é recomendado usar esta imagem em produção!${NC}"
    echo ""
    exit 1
fi
