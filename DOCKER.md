# 🐳 Guia Docker - Enterprise Architect

Este guia explica como executar a aplicação Enterprise Architect em containers Docker.

## 📋 Pré-requisitos

- Docker Desktop (macOS/Windows) ou Docker Engine (Linux)
- Docker Compose v2.x ou superior

## 🚀 Início Rápido

### 1. Configurar variáveis de ambiente

Copie o arquivo `.env.example` para `.env` e ajuste conforme necessário:

```bash
cp .env.example .env
```

### 2. Subir a aplicação completa (App + MySQL)

```bash
docker-compose up -d
```

Isso irá:
- ✅ Criar um container MySQL com o banco de dados
- ✅ Executar os scripts de schema e dados iniciais
- ✅ Construir e iniciar a aplicação Node.js
- ✅ Configurar a rede entre os containers

### 3. Acessar a aplicação

A aplicação estará disponível em:
- **Frontend/API**: http://localhost:5000

### 4. Verificar logs

```bash
# Logs de todos os serviços
docker-compose logs -f

# Logs apenas da aplicação
docker-compose logs -f app

# Logs apenas do MySQL
docker-compose logs -f mysql
```

### 5. Parar a aplicação

```bash
docker-compose down
```

Para remover também os volumes (dados do banco):
```bash
docker-compose down -v
```

## 🔧 Comandos Úteis

### Build e Execução

```bash
# Rebuild da imagem (após mudanças no código)
docker-compose build --no-cache

# Rebuild e restart
docker-compose up -d --build

# Executar em modo desenvolvimento (com logs visíveis)
docker-compose up
```

### Manutenção do Banco de Dados

```bash
# Conectar ao MySQL via CLI
docker exec -it enterprise-architect-db mysql -u ea_user -p

# Backup do banco de dados
docker exec enterprise-architect-db mysqldump -u ea_user -p enterprise_architect > backup.sql

# Restaurar backup
docker exec -i enterprise-architect-db mysql -u ea_user -p enterprise_architect < backup.sql
```

### Debug

```bash
# Acessar shell do container da aplicação
docker exec -it enterprise-architect-app sh

# Verificar saúde dos containers
docker-compose ps

# Inspecionar recursos
docker stats
```

## 🏗️ Build Manual (sem Docker Compose)

Se preferir construir apenas a aplicação:

```bash
# Build da imagem
docker build -t enterprise-architect:latest .

# Executar o container (assumindo MySQL externo)
docker run -d \
  -p 5000:5000 \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=3306 \
  -e DB_NAME=enterprise_architect \
  -e DB_USER=ea_user \
  -e DB_PASSWORD=ea_password \
  --name enterprise-architect-app \
  enterprise-architect:latest
```

## 📦 Estrutura do Docker

### Dockerfile

- **Multi-stage build**: Otimiza o tamanho da imagem final
- **Stage 1 (frontend-builder)**: Compila o frontend React/Vite
- **Stage 2 (production)**: Imagem final leve apenas com produção
- **Node.js 20 Alpine**: Base leve (~50MB vs ~900MB)
- **Usuário não-root**: Segurança aprimorada
- **Health check**: Monitora saúde da aplicação

### Docker Compose

- **Serviço MySQL**: Banco de dados com inicialização automática
- **Serviço App**: Aplicação Node.js com dependência no MySQL
- **Rede isolada**: Comunicação segura entre containers
- **Volumes persistentes**: Dados do MySQL e logs da aplicação
- **Health checks**: Garante ordem correta de inicialização

## 🔐 Segurança

### Produção

1. **Sempre altere as senhas padrão** no arquivo `.env`
2. **Não commite o arquivo .env** no Git
3. **Use secrets do Docker** para ambientes de produção:

```bash
echo "senha_secreta" | docker secret create db_password -
```

4. **Limite recursos** do container:

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
```

## 🌐 Deploy em Produção

### Docker Swarm

```bash
docker stack deploy -c docker-compose.yml enterprise-architect
```

### Kubernetes

Use os manifestos Kubernetes (criar separadamente) ou ferramentas como Kompose:

```bash
kompose convert -f docker-compose.yml
```

## 📊 Monitoramento

Adicione ao `docker-compose.yml` para monitoramento:

```yaml
  prometheus:
    image: prom/prometheus
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
    ports:
      - "9090:9090"

  grafana:
    image: grafana/grafana
    ports:
      - "3000:3000"
```

## ❓ Troubleshooting

### Porta já em uso

```bash
# Verificar o que está usando a porta 5000
lsof -i :5000

# Ou alterar a porta no .env
APP_PORT=5001
```

### Permissões de volume

```bash
# Ajustar permissões (Linux)
sudo chown -R $USER:$USER .
```

### Container não inicia

```bash
# Ver logs detalhados
docker-compose logs --tail=100 app

# Verificar configuração
docker-compose config
```

### MySQL não conecta

```bash
# Verificar se o MySQL está pronto
docker-compose exec mysql mysqladmin ping -h localhost

# Resetar volumes
docker-compose down -v
docker-compose up -d
```

## 📝 Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `DB_HOST` | Host do MySQL | `localhost` (compose: `mysql`) |
| `DB_PORT` | Porta do MySQL | `3306` |
| `DB_NAME` | Nome do banco | `enterprise_architect` |
| `DB_USER` | Usuário do banco | `ea_user` |
| `DB_PASSWORD` | Senha do banco | `ea_password` |
| `DB_ROOT_PASSWORD` | Senha root MySQL | `rootpassword` |
| `APP_PORT` | Porta da aplicação | `5000` |
| `NODE_ENV` | Ambiente Node | `production` |

## 🎯 Próximos Passos

1. Configure CI/CD para build automático
2. Implemente backup automático do banco
3. Configure SSL/TLS com reverse proxy (Nginx/Traefik)
4. Adicione monitoring e alertas
5. Configure log aggregation (ELK Stack)

---

Para mais informações, consulte:
- [Documentação Docker](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Best Practices](https://docs.docker.com/develop/dev-best-practices/)
