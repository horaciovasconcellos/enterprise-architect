# 🔐 Assinatura de Container com Cosign

Este guia explica como assinar e verificar imagens Docker do Enterprise Architect usando Cosign.

## 📋 O que é Cosign?

Cosign é uma ferramenta da Sigstore para assinar, verificar e armazenar assinaturas de containers. Garante:
- ✅ **Autenticidade**: A imagem foi construída por você
- ✅ **Integridade**: A imagem não foi modificada
- ✅ **Rastreabilidade**: Auditoria completa da cadeia de build

## 🛠️ Instalação do Cosign

### macOS (Homebrew)
```bash
brew install cosign
```

### Linux (Binary)
```bash
LATEST_VERSION=$(curl -s https://api.github.com/repos/sigstore/cosign/releases/latest | grep '"tag_name":' | sed -E 's/.*"v([^"]+)".*/\1/')
curl -LO "https://github.com/sigstore/cosign/releases/download/v${LATEST_VERSION}/cosign-linux-amd64"
sudo mv cosign-linux-amd64 /usr/local/bin/cosign
sudo chmod +x /usr/local/bin/cosign
```

### Verificar instalação
```bash
cosign version
```

## 🔑 Gerando Chaves de Assinatura

### Opção 1: Chaves Locais (Desenvolvimento)

```bash
# Gerar par de chaves
cosign generate-key-pair

# Isso criará:
# - cosign.key (chave privada - NUNCA commitar!)
# - cosign.pub (chave pública - pode compartilhar)
```

**⚠️ IMPORTANTE**: Adicione `cosign.key` ao `.gitignore`!

### Opção 2: Keyless Signing (Recomendado para Produção)

Usa OpenID Connect (GitHub, Google, Microsoft) - sem gerenciar chaves:

```bash
# Assinar usando OIDC (keyless)
cosign sign --yes $IMAGE_NAME
```

## 📦 Build e Assinatura da Imagem

### Script Completo de Build e Assinatura

Crie um arquivo `build-and-sign.sh`:

```bash
#!/bin/bash
set -e

# Configurações
IMAGE_NAME="enterprise-architect"
IMAGE_TAG="${1:-latest}"
REGISTRY="${DOCKER_REGISTRY:-ghcr.io/horaciovasconcellos}"
FULL_IMAGE="${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"

echo "🔨 Building Docker image..."
docker build -t "${FULL_IMAGE}" .

echo "📊 Image built successfully: ${FULL_IMAGE}"
docker images | grep "${IMAGE_NAME}"

echo ""
echo "🔐 Signing image with Cosign..."

# Opção A: Assinar com chaves locais
if [ -f "cosign.key" ]; then
    echo "Using local key (cosign.key)"
    cosign sign --key cosign.key "${FULL_IMAGE}"
else
    # Opção B: Assinar com keyless (OIDC)
    echo "Using keyless signing (OIDC)"
    cosign sign --yes "${FULL_IMAGE}"
fi

echo ""
echo "✅ Image signed successfully!"
echo ""
echo "📋 Verification command:"
if [ -f "cosign.pub" ]; then
    echo "cosign verify --key cosign.pub ${FULL_IMAGE}"
else
    echo "cosign verify ${FULL_IMAGE}"
fi
```

Tornar executável:
```bash
chmod +x build-and-sign.sh
```

### Executar Build e Assinatura

```bash
# Build e assinar com tag latest
./build-and-sign.sh

# Build e assinar com tag específica
./build-and-sign.sh v1.0.0
```

## ✍️ Assinando Imagem Existente

### Com chaves locais

```bash
# Assinar imagem local
cosign sign --key cosign.key enterprise-architect:latest

# Assinar imagem em registry
cosign sign --key cosign.key ghcr.io/horaciovasconcellos/enterprise-architect:latest
```

### Keyless (sem chaves)

```bash
# Assinar usando navegador para autenticação OIDC
cosign sign --yes enterprise-architect:latest
```

## ✅ Verificando Assinaturas

### Com chave pública

```bash
# Verificar imagem local
cosign verify --key cosign.pub enterprise-architect:latest

# Verificar imagem em registry
cosign verify --key cosign.pub ghcr.io/horaciovasconcellos/enterprise-architect:latest
```

### Keyless

```bash
# Verificar com OIDC
cosign verify \
  --certificate-identity-regexp="https://github.com/horaciovasconcellos/*" \
  --certificate-oidc-issuer="https://token.actions.githubusercontent.com" \
  ghcr.io/horaciovasconcellos/enterprise-architect:latest
```

### Saída esperada de verificação bem-sucedida:

```json
[
  {
    "critical": {
      "identity": {
        "docker-reference": "ghcr.io/horaciovasconcellos/enterprise-architect"
      },
      "image": {
        "docker-manifest-digest": "sha256:..."
      },
      "type": "cosign container image signature"
    },
    "optional": {
      "Bundle": {...},
      "Issuer": "https://token.actions.githubusercontent.com",
      "Subject": "https://github.com/horaciovasconcellos/enterprise-architect/..."
    }
  }
]
```

## 🔍 Inspecionando Assinaturas

```bash
# Ver todas as assinaturas de uma imagem
cosign tree ghcr.io/horaciovasconcellos/enterprise-architect:latest

# Ver detalhes da assinatura
cosign verify --key cosign.pub enterprise-architect:latest | jq
```

## 🤖 CI/CD com GitHub Actions

Crie `.github/workflows/build-and-sign.yml`:

```yaml
name: Build, Sign and Push

on:
  push:
    branches: [main]
    tags: ['v*']
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-sign:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
      id-token: write  # Necessário para keyless signing

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Install Cosign
        uses: sigstore/cosign-installer@v3
        with:
          cosign-release: 'v2.2.0'

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=ref,event=branch
            type=ref,event=pr
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}
            type=sha

      - name: Build and push
        id: build-and-push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Sign the image with GitHub OIDC
        env:
          DIGEST: ${{ steps.build-and-push.outputs.digest }}
          TAGS: ${{ steps.meta.outputs.tags }}
        run: |
          images=""
          for tag in ${TAGS}; do
            images+="${tag}@${DIGEST} "
          done
          cosign sign --yes ${images}

      - name: Verify signatures
        env:
          DIGEST: ${{ steps.build-and-push.outputs.digest }}
          TAGS: ${{ steps.meta.outputs.tags }}
        run: |
          for tag in ${TAGS}; do
            cosign verify \
              --certificate-identity-regexp="https://github.com/${{ github.repository }}/.*" \
              --certificate-oidc-issuer="https://token.actions.githubusercontent.com" \
              "${tag}@${DIGEST}"
          done
```

## 🔒 Política de Segurança com Cosign

### Criar política de verificação

Crie `cosign-policy.yaml`:

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: cosign-policy
data:
  policy.json: |
    {
      "authorities": [
        {
          "name": "official-builds",
          "keyless": {
            "url": "https://fulcio.sigstore.dev",
            "identities": [
              {
                "issuer": "https://token.actions.githubusercontent.com",
                "subjectRegExp": "https://github.com/horaciovasconcellos/enterprise-architect/.*"
              }
            ]
          }
        }
      ]
    }
```

### Aplicar política no Kubernetes

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: enterprise-architect
spec:
  containers:
  - name: app
    image: ghcr.io/horaciovasconcellos/enterprise-architect:latest
    imagePullPolicy: Always
  initContainers:
  - name: cosign-verify
    image: gcr.io/projectsigstore/cosign:v2.2.0
    command:
    - cosign
    - verify
    - --key
    - /cosign/cosign.pub
    - ghcr.io/horaciovasconcellos/enterprise-architect:latest
    volumeMounts:
    - name: cosign-key
      mountPath: /cosign
  volumes:
  - name: cosign-key
    secret:
      secretName: cosign-public-key
```

## 📝 Atestações e SBOMs

### Gerar SBOM (Software Bill of Materials)

```bash
# Gerar SBOM com Syft
syft enterprise-architect:latest -o spdx-json > sbom.spdx.json

# Anexar SBOM à imagem
cosign attest --predicate sbom.spdx.json --key cosign.key enterprise-architect:latest

# Verificar atestação
cosign verify-attestation --key cosign.pub enterprise-architect:latest
```

### Anexar metadados customizados

```bash
# Anexar informações de build
cosign attach attest --predicate build-info.json \
  --type custom \
  enterprise-architect:latest
```

## 🎯 Docker Compose com Verificação

Atualize `docker-compose.yml`:

```yaml
version: '3.8'

services:
  verify-signature:
    image: gcr.io/projectsigstore/cosign:v2.2.0
    container_name: cosign-verifier
    command: >
      verify --key /keys/cosign.pub 
      enterprise-architect:latest
    volumes:
      - ./cosign.pub:/keys/cosign.pub:ro
    networks:
      - app-network

  app:
    image: enterprise-architect:latest
    container_name: enterprise-architect-app
    depends_on:
      verify-signature:
        condition: service_completed_successfully
    # ... resto da configuração
```

## 🔐 Melhores Práticas

### Segurança de Chaves

1. **NUNCA commite `cosign.key`** no Git
2. Use keyless signing para CI/CD
3. Armazene chaves em secret managers:
   ```bash
   # GitHub Secrets
   gh secret set COSIGN_PRIVATE_KEY < cosign.key
   gh secret set COSIGN_PASSWORD
   ```

4. Rotacione chaves periodicamente

### Verificação em Produção

```bash
# Sempre verificar antes de deploy
cosign verify --key cosign.pub $IMAGE || exit 1
docker-compose up -d
```

### Policy-as-Code

```bash
# Usar Cosign com OPA (Open Policy Agent)
cosign verify --policy policy.rego enterprise-architect:latest
```

## 📊 Auditoria e Logs

```bash
# Ver histórico de assinaturas
cosign tree ghcr.io/horaciovasconcellos/enterprise-architect:latest

# Exportar logs de verificação
cosign verify --key cosign.pub enterprise-architect:latest 2>&1 | tee verify.log
```

## ❓ Troubleshooting

### Erro: "no matching signatures"

```bash
# Verificar se a imagem tem assinatura
cosign tree enterprise-architect:latest

# Re-assinar se necessário
cosign sign --key cosign.key enterprise-architect:latest
```

### Erro: "image reference not found"

```bash
# Verificar se a imagem existe
docker images | grep enterprise-architect

# Fazer pull se necessário
docker pull enterprise-architect:latest
```

### Erro: "private key password"

```bash
# Definir senha como variável
export COSIGN_PASSWORD="your-password"
cosign sign --key cosign.key enterprise-architect:latest
```

## 📚 Recursos Adicionais

- [Cosign Documentation](https://docs.sigstore.dev/cosign/overview/)
- [Sigstore](https://www.sigstore.dev/)
- [Supply Chain Security Best Practices](https://slsa.dev/)
- [GitHub Actions Security](https://docs.github.com/en/actions/security-guides)

## 🎓 Certificações e Compliance

Cosign suporta:
- ✅ SLSA (Supply chain Levels for Software Artifacts)
- ✅ FIPS 140-2 compliance
- ✅ SOC 2 Type II
- ✅ ISO 27001

---

**Próximos Passos:**
1. Gerar par de chaves Cosign
2. Configurar GitHub Actions para build automatizado
3. Implementar política de verificação obrigatória
4. Integrar com ferramentas de scanning (Trivy, Grype)
5. Configurar notificações de segurança
