# 🚀 Início Rápido - Docker + Cosign

Guia rápido para build, assinatura e verificação de containers.

## ⚡ Setup Rápido (5 minutos)

### 1. Instalar Cosign

```bash
# macOS
brew install cosign

# Verificar instalação
cosign version
```

### 2. Gerar Chaves (Primeira vez apenas)

```bash
# Opção 1: Usando Makefile
make generate-keys

# Opção 2: Comando direto
cosign generate-key-pair
```

Isso cria:
- `cosign.key` - Chave privada (NÃO commitar!)
- `cosign.pub` - Chave pública (pode compartilhar)

### 3. Build e Assinar

```bash
# Opção 1: Script automatizado
./build-and-sign.sh

# Opção 2: Usando Makefile
make build-and-sign

# Opção 3: Comandos individuais
docker build -t enterprise-architect:latest .
cosign sign --key cosign.key enterprise-architect:latest
```

### 4. Verificar Assinatura

```bash
# Opção 1: Script automatizado
./verify-signature.sh enterprise-architect:latest

# Opção 2: Usando Makefile
make verify

# Opção 3: Comando direto
cosign verify --key cosign.pub enterprise-architect:latest
```

## 📦 Usando Docker Compose

```bash
# Subir aplicação completa (App + MySQL)
make docker-compose-up

# Ver logs
make docker-compose-logs

# Parar
make docker-compose-down
```

## 🎯 Comandos Essenciais

### Build
```bash
make build              # Build normal
make build-no-cache     # Build sem cache
```

### Assinatura
```bash
make sign               # Assinar imagem
make verify             # Verificar assinatura
make tree               # Ver árvore de assinaturas
```

### Execução
```bash
make run                # Rodar container
make stop               # Parar container
make logs               # Ver logs
make shell              # Acessar shell
```

### Segurança
```bash
make scan               # Escanear vulnerabilidades
make scan-critical      # Apenas críticas
make sbom               # Gerar SBOM
```

### Manutenção
```bash
make clean              # Limpar imagens
make clean-all          # Limpeza completa
make info               # Informações da imagem
make status             # Status dos containers
```

## 🌐 GitHub Actions (Automático)

O workflow já está configurado! Cada push para `main` ou tag:

1. ✅ Build da imagem
2. ✅ Assinatura com OIDC (keyless)
3. ✅ Geração de SBOM
4. ✅ Scan de vulnerabilidades
5. ✅ Push para GitHub Container Registry

Para ver o status: **Actions** tab no GitHub

## 🔐 Assinatura Keyless (Sem Chaves)

Perfeito para CI/CD:

```bash
# Build
docker build -t enterprise-architect:latest .

# Assinar (abre navegador para autenticação)
cosign sign --yes enterprise-architect:latest

# Verificar
cosign verify \
  --certificate-identity-regexp="https://github.com/.*" \
  --certificate-oidc-issuer="https://token.actions.githubusercontent.com" \
  enterprise-architect:latest
```

## 📊 Verificação em Produção

Sempre verificar antes de deploy:

```bash
#!/bin/bash
# deploy.sh

IMAGE="enterprise-architect:latest"

# Verificar assinatura
if cosign verify --key cosign.pub "$IMAGE"; then
    echo "✅ Assinatura válida. Prosseguindo com deploy..."
    docker-compose up -d
else
    echo "❌ Assinatura inválida! Abortando deploy."
    exit 1
fi
```

## 🆘 Troubleshooting

### "cosign: command not found"
```bash
brew install cosign
```

### "failed to verify signature"
```bash
# Verificar se a imagem tem assinatura
cosign tree enterprise-architect:latest

# Re-assinar se necessário
cosign sign --key cosign.key enterprise-architect:latest
```

### "permission denied"
```bash
# Tornar scripts executáveis
chmod +x build-and-sign.sh verify-signature.sh
```

### Build falha
```bash
# Limpar e tentar novamente
make clean
make build-no-cache
```

## 📚 Recursos

- **Documentação Completa**: [COSIGN.md](./COSIGN.md)
- **Docker Guide**: [DOCKER.md](./DOCKER.md)
- **Cosign Docs**: https://docs.sigstore.dev/cosign/overview/
- **Makefile Help**: `make help`

## 💡 Dicas

1. **Sempre** verifique assinaturas em produção
2. **Nunca** commite `cosign.key` no Git
3. Use **keyless** para CI/CD
4. Faça **scan** de vulnerabilidades regularmente
5. Gere **SBOM** para compliance

## 🎓 Fluxo Completo de Exemplo

```bash
# 1. Gerar chaves (primeira vez)
make generate-keys

# 2. Build e assinar
make build-and-sign

# 3. Verificar
make verify

# 4. Escanear vulnerabilidades
make scan-critical

# 5. Executar
make run

# 6. Verificar se está rodando
curl http://localhost:5000

# 7. Ver logs
make logs

# 8. Parar
make stop

# 9. Limpar
make clean
```

## 🚀 Deploy para Produção

```bash
# 1. Build com tag de versão
docker build -t enterprise-architect:v1.0.0 .

# 2. Assinar
cosign sign --key cosign.key enterprise-architect:v1.0.0

# 3. Push para registry
docker push ghcr.io/horaciovasconcellos/enterprise-architect:v1.0.0

# 4. Assinar imagem no registry
cosign sign --key cosign.key ghcr.io/horaciovasconcellos/enterprise-architect:v1.0.0

# 5. No servidor de produção, verificar antes de rodar
cosign verify --key cosign.pub ghcr.io/horaciovasconcellos/enterprise-architect:v1.0.0
docker pull ghcr.io/horaciovasconcellos/enterprise-architect:v1.0.0
docker-compose up -d
```

---

**Pronto! Seu container está assinado e seguro! 🔐✨**
