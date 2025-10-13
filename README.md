# ✨ Enterprise Architect

Sistema de gerenciamento de arquitetura empresarial com suporte completo a containers Docker e assinatura criptográfica.

Este modelo é a sua tela em branco. 

Ele vem com uma configuração mínima para ajudar você a começar rapidamente com o desenvolvimento no Spark.

## 🚀 O que vem dentro?
- Um ambiente Spark limpo e minimalista
- Pré-configurado para desenvolvimento local
- Pronto para escalar com suas ideias
- 🐳 **Containerização com Docker** - Build otimizado e orquestração completa
- 🔐 **Assinatura de Containers** - Segurança com Cosign/Sigstore
- 🤖 **CI/CD Automatizado** - GitHub Actions para build, assinatura e deploy
- 📊 **SBOM e Vulnerability Scanning** - Compliance e segurança automatizados

## 🐳 Docker & Containers

### Início Rápido (3 comandos)

```bash
# 1. Instalar Cosign
brew install cosign

# 2. Gerar chaves de assinatura
make generate-keys

# 3. Build, assinar e verificar
make test-verify
```

### Executar com Docker Compose

```bash
# Subir aplicação completa (App + MySQL)
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar
docker-compose down
```

### Comandos Disponíveis

```bash
make help               # Ver todos os comandos
make build              # Build da imagem
make sign               # Assinar imagem
make verify             # Verificar assinatura
make run                # Executar container
make scan-critical      # Escanear vulnerabilidades
make sbom               # Gerar SBOM
```

## 🔐 Segurança com Cosign

Todos os containers são assinados criptograficamente usando Cosign:

```bash
# Verificar assinatura antes de usar
./verify-signature.sh enterprise-architect:latest

# Ou usando Makefile
make verify
```

### CI/CD Automático

O workflow GitHub Actions automaticamente:
- ✅ Faz build da imagem
- ✅ Assina com OIDC (keyless)
- ✅ Gera SBOM
- ✅ Escaneia vulnerabilidades
- ✅ Publica no GitHub Container Registry

## � Importação de Dados

### CSV Import (Recomendado)

Importe dados em massa usando arquivos CSV:

```bash
# Importação completa (todos os dados de uma vez)
./scripts/import-all.sh

# Ou individualmente
npm run import:csv owners data/owners.csv
npm run import:csv technologies data/technologies.csv
npm run import:csv applications data/applications.csv
npm run import:csv capabilities data/capabilities.csv
npm run import:csv skills data/skills.csv
```

### CURL API

Crie registros via API REST:

```bash
# Criar owner
curl -X POST http://localhost:3000/api/owners \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "João Silva",
    "email": "joao@empresa.com",
    "role": "Developer",
    "department": "Engineering"
  }'

# Ver exemplos completos
./scripts/curl-examples.sh
```

### Arquivos CSV de Exemplo

O diretório `data/` contém exemplos prontos:
- `owners.csv` - 10 desenvolvedores
- `technologies.csv` - 20 tecnologias
- `applications.csv` - 10 aplicações
- `capabilities.csv` - 15 capacidades
- `skills.csv` - 5 habilidades completas

## �📚 Documentação Completa

### Docker & Containers
- **[QUICKSTART.md](./QUICKSTART.md)** - Comece em 5 minutos
- **[DOCKER.md](./DOCKER.md)** - Guia completo de Docker
- **[COSIGN.md](./COSIGN.md)** - Assinatura de containers
- **[DOCKER-COSIGN-SUMMARY.md](./DOCKER-COSIGN-SUMMARY.md)** - Resumo completo

### Importação de Dados
- **[IMPORT_QUICKSTART.md](./IMPORT_QUICKSTART.md)** - Quick start para importação
- **[IMPORT_GUIDE.md](./IMPORT_GUIDE.md)** - Guia completo de CSV/CURL (800+ linhas)
- **[CSV_IMPORT_SUMMARY.md](./CSV_IMPORT_SUMMARY.md)** - Resumo do sistema de importação

### Sistema de Habilidades
- **[SKILLS_SYSTEM.md](./SKILLS_SYSTEM.md)** - Documentação completa do sistema de Skills
- **[SKILLS_IMPLEMENTATION_SUMMARY.md](./SKILLS_IMPLEMENTATION_SUMMARY.md)** - Resumo de implementação

## 🧠 O que você pode fazer?

Por enquanto, este é apenas um ponto de partida — o lugar perfeito para começar a construir e testar seus aplicativos Spark.

🧹 Apenas explorando?
Sem problemas! Se você estava apenas verificando as coisas e não precisa manter este código:

- Basta excluir seu Spark.
- Tudo será limpo — sem vestígios deixados para trás.

📄 Licença para Recursos de Modelos do Spark

Os arquivos e recursos de modelos do Spark do GitHub são licenciados sob os termos da licença MIT, Copyright GitHub, Inc.

