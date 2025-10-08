# 🗄️ Configuração do MySQL para Enterprise Architect

Este guia mostra como configurar e executar a aplicação Enterprise Architect com banco de dados MySQL local.

## 📋 Pré-requisitos

### 1. MySQL Server
- **MySQL 8.0 ou superior** instalado e rodando
- Acesso às credenciais de administrador do MySQL

### 2. Node.js
- **Node.js 18 ou superior**
- npm, yarn ou pnpm

## 🚀 Configuração Passo a Passo

### 1. Instalar e Configurar MySQL

#### macOS (usando Homebrew):
```bash
# Instalar MySQL
brew install mysql

# Iniciar o serviço MySQL
brew services start mysql

# Configurar senha do root (se necessário)
mysql_secure_installation
```

#### Ubuntu/Debian:
```bash
# Instalar MySQL
sudo apt update
sudo apt install mysql-server

# Iniciar MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# Configurar segurança
sudo mysql_secure_installation
```

#### Windows:
- Baixar MySQL Installer do site oficial
- Seguir o assistente de instalação
- Configurar senha do usuário root

### 2. Criar o Banco de Dados

Acesse o MySQL como administrador:
```bash
mysql -u root -p
```

Execute o script de criação do banco:
```sql
-- No terminal MySQL
source /caminho/para/database/schema.sql;
```

Ou importe diretamente:
```bash
# Fora do MySQL, no terminal
mysql -u root -p < database/schema.sql
```

### 3. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas credenciais:
```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha_aqui
DB_NAME=enterprise_architect

# Server Configuration
PORT=3001
```

### 4. Instalar Dependências

```bash
npm install
```

### 5. Popular o Banco com Dados de Exemplo (Opcional)

```bash
mysql -u root -p enterprise_architect < database/sample-data.sql
```

## 🏃‍♂️ Executando a Aplicação

### Opção 1: Executar Frontend e Backend Separadamente

**Terminal 1 - Backend (API):**
```bash
npm run server:dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

### Opção 2: Executar Tudo Junto (Recomendado)

```bash
npm run dev:full
```

## 🔍 Verificar se Está Funcionando

### 1. Verificar o Backend
Acesse: http://localhost:3001/api/health

Deve retornar:
```json
{
  "status": "ok",
  "database": "connected",
  "timestamp": "2025-01-08T..."
}
```

### 2. Verificar o Frontend
Acesse: http://localhost:5000

A aplicação deve carregar e mostrar dados do MySQL ao invés do armazenamento local.

### 3. Testar APIs Diretamente

```bash
# Listar aplicações
curl http://localhost:3001/api/applications

# Listar capacidades
curl http://localhost:3001/api/capabilities

# Listar tecnologias
curl http://localhost:3001/api/technologies
```

## 🛠️ Comandos Úteis

### Scripts Disponíveis

- `npm run dev` - Executar apenas o frontend
- `npm run server` - Executar apenas o backend
- `npm run server:dev` - Executar backend em modo desenvolvimento
- `npm run dev:full` - Executar frontend e backend juntos

### MySQL Comandos Úteis

```sql
-- Verificar tabelas criadas
USE enterprise_architect;
SHOW TABLES;

-- Verificar dados em uma tabela
SELECT * FROM applications LIMIT 5;

-- Verificar estrutura de uma tabela
DESCRIBE applications;

-- Resetar dados (cuidado!)
DROP DATABASE enterprise_architect;
```

## 🔧 Solução de Problemas

### ❌ Erro de Conexão com MySQL

**Problema:** `Error: connect ECONNREFUSED 127.0.0.1:3306`

**Soluções:**
1. Verificar se MySQL está rodando:
   ```bash
   # macOS
   brew services list | grep mysql
   
   # Linux
   sudo systemctl status mysql
   ```

2. Verificar credenciais no arquivo `.env`

3. Testar conexão manual:
   ```bash
   mysql -u root -p -h localhost
   ```

### ❌ Erro de Permissão

**Problema:** `Access denied for user 'root'@'localhost'`

**Solução:**
```sql
-- Entrar como root
sudo mysql

-- Alterar método de autenticação
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'sua_senha';
FLUSH PRIVILEGES;
```

### ❌ Banco de Dados Não Existe

**Problema:** `Unknown database 'enterprise_architect'`

**Solução:**
```sql
CREATE DATABASE enterprise_architect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### ❌ Porta em Uso

**Problema:** `Port 3001 is already in use`

**Solução:**
```bash
# Encontrar processo usando a porta
sudo lsof -i :3001

# Matar o processo (substitua PID pelo número real)
kill -9 PID

# Ou usar uma porta diferente no .env
PORT=3002
```

## 📊 Estrutura do Banco de Dados

### Tabelas Principais:
- **applications** - Aplicações do portfólio
- **capabilities** - Capacidades de negócio
- **technologies** - Tecnologias utilizadas
- **processes** - Processos empresariais
- **owners** - Proprietários/responsáveis
- **interfaces** - Interfaces entre aplicações

### Tabelas de Relacionamento:
- **application_capabilities** - Aplicações ↔ Capacidades
- **application_processes** - Aplicações ↔ Processos
- **application_technologies** - Aplicações ↔ Tecnologias
- **application_relationships** - Aplicações ↔ Aplicações
- **owner_applications** - Proprietários ↔ Aplicações

## 🎯 Próximos Passos

1. **Migração de Dados:** Se você já tinha dados no armazenamento local, precisará migrá-los para o MySQL
2. **Backup:** Configure backups regulares do banco de dados
3. **Performance:** Monitore e otimize consultas conforme necessário
4. **Segurança:** Configure usuários específicos ao invés de usar root em produção

## 🚨 Importante

- ⚠️ **Nunca use credenciais de root em produção**
- ⚠️ **Sempre faça backup antes de modificar o schema**
- ⚠️ **Use HTTPS em produção**
- ⚠️ **Configure firewall adequadamente**

---

Se você encontrar problemas não cobertos neste guia, verifique os logs do servidor (`npm run server:dev`) para mais detalhes sobre erros específicos.




create database enterprise_architect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
 GRANT ALL PRIVILEGES ON enterprise_architect.* TO 'togaf'@'localhost';
 FLUSH PRIVILEGES;