# 📦 Resumo da Configuração Docker + Cosign

## ✅ Arquivos Criados

### 🐳 Docker
1. **Dockerfile** - Multi-stage build otimizado com Node.js 20 Alpine
2. **.dockerignore** - Otimização de build
3. **docker-compose.yml** - Orquestração completa (App + MySQL)
4. **DOCKER.md** - Documentação completa do Docker

### 🔐 Cosign (Assinatura)
5. **COSIGN.md** - Guia completo de assinatura de containers
6. **build-and-sign.sh** - Script automatizado de build e assinatura
7. **verify-signature.sh** - Script de verificação de assinaturas
8. **.github/workflows/build-and-sign.yml** - CI/CD automatizado

### 🛠️ Ferramentas
9. **Makefile** - Comandos simplificados para todas as operações
10. **QUICKSTART.md** - Guia de início rápido
11. **.gitignore** - Atualizado com regras para chaves Cosign

## 🚀 Como Usar

### Início Rápido (3 comandos)

```bash
# 1. Instalar Cosign
brew install cosign

# 2. Gerar chaves
make generate-keys

# 3. Build, assinar e verificar
make test-verify
```

### Desenvolvimento Local

```bash
# Subir tudo (App + MySQL)
docker-compose up -d

# Ver logs
docker-compose logs -f

# Acessar: http://localhost:5000
```

### Assinatura Manual

```bash
# Build
docker build -t enterprise-architect:latest .

# Assinar
cosign sign --key cosign.key enterprise-architect:latest

# Verificar
cosign verify --key cosign.pub enterprise-architect:latest
```

### Usando Scripts

```bash
# Build + Assinar (interativo)
./build-and-sign.sh

# Verificar assinatura
./verify-signature.sh enterprise-architect:latest
```

### Usando Makefile (Recomendado)

```bash
# Ver todos os comandos
make help

# Build e assinar
make build-and-sign

# Verificar
make verify

# Subir com docker-compose
make docker-compose-up

# Escanear vulnerabilidades
make scan-critical

# Gerar SBOM
make sbom

# Limpar tudo
make clean-all
```

## 🤖 CI/CD Automático

O workflow GitHub Actions já está configurado e será executado em:
- ✅ Push para branch `main`
- ✅ Push de tags `v*` (ex: v1.0.0)
- ✅ Pull Requests

O workflow automaticamente:
1. 🔨 Faz build da imagem
2. 🔐 Assina com OIDC (keyless)
3. 📊 Gera SBOM
4. 🔍 Escaneia vulnerabilidades
5. 📤 Faz push para GitHub Container Registry
6. ✅ Verifica assinaturas

## 📊 Comandos Essenciais do Makefile

```bash
make build              # Build da imagem
make sign               # Assinar imagem
make verify             # Verificar assinatura
make build-and-sign     # Build + assinatura
make test-verify        # Teste completo

make run                # Executar container
make stop               # Parar container
make logs               # Ver logs

make docker-compose-up  # Subir App + MySQL
make docker-compose-down # Parar tudo

make scan               # Escanear vulnerabilidades
make scan-critical      # Apenas críticas/altas
make sbom               # Gerar SBOM

make clean              # Limpar imagens
make clean-all          # Limpeza completa
make info               # Info da imagem
make status             # Status dos containers
```

## 🔐 Segurança

### Chaves Locais (Desenvolvimento)
- ✅ Chave privada: `cosign.key` (NUNCA commitar!)
- ✅ Chave pública: `cosign.pub` (pode compartilhar)
- ✅ Já adicionado ao `.gitignore`

### Keyless (Produção/CI/CD)
- ✅ Usa OpenID Connect (GitHub, Google, Microsoft)
- ✅ Sem necessidade de gerenciar chaves
- ✅ Ideal para automação

## 📚 Documentação

### Guias Completos
- **[QUICKSTART.md](./QUICKSTART.md)** - Início rápido (5 minutos)
- **[DOCKER.md](./DOCKER.md)** - Guia completo de Docker
- **[COSIGN.md](./COSIGN.md)** - Guia completo de Cosign

### Estrutura Docker
```
Dockerfile                 # Multi-stage build otimizado
├── Stage 1: Build        # Compila frontend (React/Vite)
└── Stage 2: Production   # Imagem final (~150MB)
```

### Workflow CI/CD
```
.github/workflows/build-and-sign.yml
├── Build & Push          # Build multi-arch (amd64, arm64)
├── Sign with OIDC        # Assinatura keyless
├── Generate SBOM         # Software Bill of Materials
├── Scan Vulnerabilities  # Trivy scan
└── Upload Results        # GitHub Security
```

## 🎯 Características

### Docker
✅ Multi-stage build otimizado
✅ Imagem Alpine leve (~150MB)
✅ MySQL com dados iniciais
✅ Health checks automáticos
✅ Volumes persistentes
✅ Rede isolada
✅ Usuário não-root (segurança)
✅ Pronto para produção

### Cosign
✅ Assinatura criptográfica de containers
✅ Suporta chaves locais e keyless (OIDC)
✅ Verificação automática
✅ SBOM (Software Bill of Materials)
✅ Attestations
✅ Integração com CI/CD
✅ Compliance (SLSA, FIPS)

## 🔍 Verificação em Produção

### Script de Deploy Seguro

```bash
#!/bin/bash
IMAGE="enterprise-architect:latest"

# Verificar assinatura antes de deploy
if cosign verify --key cosign.pub "$IMAGE"; then
    echo "✅ Assinatura válida"
    docker-compose up -d
else
    echo "❌ Assinatura inválida! Abortando."
    exit 1
fi
```

### Policy-as-Code

```yaml
# cosign-policy.yaml
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
            "identities": [
              {
                "issuer": "https://token.actions.githubusercontent.com",
                "subjectRegExp": "https://github.com/horaciovasconcellos/.*"
              }
            ]
          }
        }
      ]
    }
```

## 📊 Monitoramento

### Escanear Vulnerabilidades

```bash
# Todas as vulnerabilidades
make scan

# Apenas críticas e altas
make scan-critical

# Com output JSON
trivy image --format json enterprise-architect:latest > scan-report.json
```

### Gerar SBOM

```bash
# SBOM em formato SPDX
make sbom

# Anexar SBOM à imagem
cosign attest --predicate sbom.spdx.json --key cosign.key enterprise-architect:latest
```

## 🆘 Troubleshooting

### Cosign não encontrado
```bash
brew install cosign
```

### Build falha
```bash
make clean
make build-no-cache
```

### Verificação falha
```bash
# Ver árvore de assinaturas
cosign tree enterprise-architect:latest

# Re-assinar
make sign
```

### Porta em uso
```bash
# Verificar o que está usando a porta
lsof -i :5000

# Ou alterar no .env
APP_PORT=5001
```

## 🎓 Próximos Passos

1. ✅ **Gerar chaves**: `make generate-keys`
2. ✅ **Teste local**: `make test-verify`
3. ✅ **Configurar secrets**: GitHub → Settings → Secrets
4. ✅ **Push código**: Workflow roda automaticamente
5. ✅ **Deploy produção**: Com verificação obrigatória

## 📞 Recursos Adicionais

- **Cosign Docs**: https://docs.sigstore.dev/cosign/overview/
- **Docker Docs**: https://docs.docker.com/
- **Sigstore**: https://www.sigstore.dev/
- **SLSA**: https://slsa.dev/

## 💡 Melhores Práticas

1. ✅ **Sempre** verificar assinaturas em produção
2. ✅ **Nunca** commitar chaves privadas
3. ✅ Usar **keyless** para CI/CD
4. ✅ Escanear **vulnerabilidades** regularmente
5. ✅ Gerar **SBOM** para compliance
6. ✅ Manter **logs de auditoria**
7. ✅ Rotacionar **chaves periodicamente**
8. ✅ Testar **localmente** antes do push

---

## 🎉 Tudo Pronto!

Sua aplicação agora tem:
- 🐳 Containerização com Docker
- 🔐 Assinatura criptográfica com Cosign
- 🤖 CI/CD automatizado
- 🔍 Scan de vulnerabilidades
- 📊 SBOM automático
- ✅ Pronto para produção

**Execute:** `make help` para ver todos os comandos disponíveis!

**Documentação:** Leia [QUICKSTART.md](./QUICKSTART.md) para começar em 5 minutos!
