# 🎯 Tutorial Passo a Passo - Importação de Dados

Este tutorial mostra 3 formas diferentes de importar dados para o Enterprise Architect.

---

## 🚀 Forma 1: Script Completo (Mais Fácil)

### Passo 1: Iniciar o Servidor

```bash
# Terminal 1
npm run server:dev
```

Aguarde até ver:
```
✅ Database connected
🚀 Server running on http://localhost:3000
```

### Passo 2: Executar Importação

```bash
# Terminal 2
./scripts/import-all.sh
```

Você verá algo como:
```
╔════════════════════════════════════════════════════════════╗
║          🚀 IMPORTAÇÃO COMPLETA - CSV TO API               ║
╚════════════════════════════════════════════════════════════╝

✅ API está online e respondendo
✅ owners.csv encontrado (11 linhas)
✅ technologies.csv encontrado (21 linhas)
...

[1/5] 📝 IMPORTANDO OWNERS
✅ [1/10] Owner criado: João Silva
✅ [2/10] Owner criado: Maria Santos
...

✅ IMPORTAÇÃO CONCLUÍDA COM SUCESSO!
   • Owners: 10
   • Technologies: 20
   • Applications: 10
   • Capabilities: 15
   • Skills: 5
```

### Passo 3: Verificar na Aplicação

```bash
# Abrir aplicação no navegador
open http://localhost:5173
```

**Pronto!** Todos os dados foram importados. 🎉

---

## 📝 Forma 2: CSV Individual

Para importar apenas um tipo de dado específico:

### Exemplo: Importar apenas Owners

```bash
# 1. Iniciar servidor
npm run server:dev

# 2. Importar owners
npm run import:csv owners data/owners.csv
```

Output esperado:
```
📁 Lendo arquivo: data/owners.csv
🔗 API: http://localhost:3000/api
📊 Tipo: owners

✅ 10 registros encontrados

✅ [1/10] Owner criado: João Silva
✅ [2/10] Owner criado: Maria Santos
...

📊 RESULTADO DA IMPORTAÇÃO
✅ Sucesso: 10
❌ Falhas: 0
⏱️  Tempo: 2.5s
```

### Ordem Correta de Importação

⚠️ **IMPORTANTE:** Sempre importe nesta ordem:

```bash
# 1. Entidades sem dependências
npm run import:csv owners data/owners.csv
npm run import:csv technologies data/technologies.csv

# 2. Entidades que dependem das anteriores
npm run import:csv applications data/applications.csv
npm run import:csv capabilities data/capabilities.csv

# 3. Skills (depende de owners e technologies)
npm run import:csv skills data/skills.csv
```

---

## 🌐 Forma 3: CURL (API Direta)

Para criar registros diretamente via API REST.

### Exemplo Completo: Criar Application

#### Passo 1: Criar Owner

```bash
curl -X POST http://localhost:3000/api/owners \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "João Silva",
    "email": "joao.silva@empresa.com",
    "role": "Senior Developer",
    "department": "Engineering"
  }' | jq
```

Resposta:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "João Silva",
  "email": "joao.silva@empresa.com",
  "role": "Senior Developer",
  "department": "Engineering"
}
```

**Copie o `id` retornado!**

#### Passo 2: Criar Technology

```bash
curl -X POST http://localhost:3000/api/technologies \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Node.js",
    "version": "20",
    "category": "Runtime",
    "description": "JavaScript runtime",
    "vendor": "OpenJS Foundation",
    "licenseType": "Open Source",
    "supportLevel": "Community"
  }' | jq
```

Resposta:
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440000",
  "name": "Node.js",
  "version": "20",
  "category": "Runtime"
}
```

**Copie o `id` da tecnologia também!**

#### Passo 3: Criar Application

```bash
# Substitua OWNER_ID e TECH_ID pelos IDs copiados acima
curl -X POST http://localhost:3000/api/applications \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Portal do Cliente",
    "description": "Sistema de atendimento ao cliente",
    "status": "Active",
    "criticality": "High",
    "ownerId": "550e8400-e29b-41d4-a716-446655440000",
    "technologies": [
      {
        "technologyId": "660e8400-e29b-41d4-a716-446655440000",
        "version": "20",
        "environment": "Production"
      }
    ]
  }' | jq
```

Resposta:
```json
{
  "id": "770e8400-e29b-41d4-a716-446655440000",
  "name": "Portal do Cliente",
  "description": "Sistema de atendimento ao cliente",
  "status": "Active",
  "criticality": "High",
  "ownerId": "550e8400-e29b-41d4-a716-446655440000",
  "technologies": [
    {
      "technologyId": "660e8400-e29b-41d4-a716-446655440000",
      "version": "20",
      "environment": "Production"
    }
  ]
}
```

**Sucesso!** Application criada com tecnologia associada. 🎉

### Script de Demo Automatizado

Para ver um exemplo completo funcionando:

```bash
./scripts/demo-import.sh
```

Este script:
1. Cria 1 Owner
2. Cria 1 Technology
3. Cria 1 Application (associando os dois)
4. Cria 1 Capability
5. Cria 1 Skill (com developer e technology)

---

## 🎨 Criando Seus Próprios CSV

### Template: owners.csv

```csv
name,email,role,department
Seu Nome,seu.email@empresa.com,Developer,Engineering
Outro Nome,outro@empresa.com,Tech Lead,Engineering
```

**Dicas:**
- Use encoding UTF-8
- Separe por vírgulas
- Primeira linha = cabeçalho
- Sem espaços extras

### Template: technologies.csv

```csv
name,version,category,description,vendor,licenseType,supportLevel
Python,3.12,Language,Programming language,PSF,Open Source,Community
Django,5,Framework,Web framework,Django Foundation,Open Source,Community
```

### Template: applications.csv

```csv
name,description,status,criticality,owner,technologies
Minha App,Descrição da app,Active,High,Seu Nome,Python 3.12|Django 5
```

**Formato especial para `technologies`:**
- Separe múltiplas tecnologias com `|`
- Formato: `Nome Versão`
- Exemplo: `Node.js 20|PostgreSQL 16|React 19`

### Template: skills.csv

```csv
name,code,description,guidanceNotes,levelDescription,technologies,developers
Python Dev,SKILL-PY-001,Python development,Focus on Django,Levels 0-5,"Python 3.12:4:2024-01-01","Seu Nome:5:2024-06-01:Expert"
```

**Formato especial:**

**Technologies:** `"Nome Versão:Nível:Data|Outro:Nível:Data"`
- Nome da tecnologia com versão
- Nível de 0 a 5
- Data no formato YYYY-MM-DD
- Separar múltiplas com `|`

**Developers:** `"Nome:Nível:Data:Notas|Outro:Nível:Data:Notas"`
- Nome do desenvolvedor (deve existir em owners.csv)
- Nível de 0 a 5
- Data de certificação
- Notas opcionais

---

## 🔍 Verificando os Dados

### Via Curl

```bash
# Listar todos os owners
curl http://localhost:3000/api/owners | jq

# Listar apenas nomes
curl http://localhost:3000/api/owners | jq '.[] | .name'

# Contar registros
curl -s http://localhost:3000/api/owners | jq 'length'

# Buscar por ID
curl http://localhost:3000/api/owners/OWNER_ID | jq
```

### Via Browser

1. Abrir http://localhost:5173
2. Clicar no menu lateral
3. Navegar para a entidade desejada
4. Ver dados em formato de cards/tabela

---

## ❌ Erros Comuns

### 1. "API não está respondendo"

**Problema:** Servidor não está rodando

**Solução:**
```bash
npm run server:dev
```

### 2. "Owner não encontrado"

**Problema:** Tentou importar Application antes de Owner

**Solução:** Importe na ordem correta:
```bash
npm run import:csv owners data/owners.csv
npm run import:csv applications data/applications.csv
```

### 3. "Technology não encontrada"

**Problema:** Nome da tecnologia no CSV não confere

**Solução:** Verificar tecnologias existentes:
```bash
curl http://localhost:3000/api/technologies | jq '.[] | "\(.name) \(.version)"'
```

Use o nome EXATO no CSV.

### 4. "csv-parse module not found"

**Problema:** Dependência não instalada

**Solução:**
```bash
npm install csv-parse
```

### 5. Caracteres acentuados aparecem errados

**Problema:** Encoding do CSV incorreto

**Solução:** Salvar CSV com encoding UTF-8
- Excel: Salvar Como → CSV UTF-8
- LibreOffice: Salvar Como → Encoding: UTF-8
- Terminal: `iconv -f ISO-8859-1 -t UTF-8 arquivo.csv > novo.csv`

---

## 📊 Exemplo Prático Completo

### Cenário: Importar time de 3 desenvolvedores com skills

#### 1. Criar CSV de Owners

```bash
cat > data/my-team.csv << EOF
name,email,role,department
Alice Santos,alice@empresa.com,Senior Developer,Engineering
Bob Silva,bob@empresa.com,Developer,Engineering
Carol Oliveira,carol@empresa.com,Tech Lead,Engineering
EOF
```

#### 2. Criar CSV de Technologies

```bash
cat > data/my-stack.csv << EOF
name,version,category,description,vendor,licenseType,supportLevel
Python,3.12,Language,Programming language,PSF,Open Source,Community
FastAPI,0.110,Framework,Web framework,Sebastián Ramírez,Open Source,Community
PostgreSQL,16,Database,SQL database,PostgreSQL,Open Source,Community
EOF
```

#### 3. Criar CSV de Skills

```bash
cat > data/my-skills.csv << EOF
name,code,description,guidanceNotes,levelDescription,technologies,developers
Python Backend,SKILL-001,Backend with Python,Focus FastAPI,Levels 0-5,"Python 3.12:4:2024-01-01|FastAPI 0.110:4:2024-01-01","Alice Santos:5:2024-06-01:Expert|Bob Silva:3:2024-05-01:"
Database Admin,SKILL-002,Database management,PostgreSQL DBA,Levels 0-5,"PostgreSQL 16:5:2024-01-01","Carol Oliveira:5:2024-07-01:DBA Certified"
EOF
```

#### 4. Importar Tudo

```bash
# Importar owners primeiro
npm run import:csv owners data/my-team.csv

# Depois technologies
npm run import:csv technologies data/my-stack.csv

# Por último skills
npm run import:csv skills data/my-skills.csv
```

#### 5. Verificar

```bash
# Ver todos os desenvolvedores
curl http://localhost:3000/api/owners | jq '.[] | {name, role}'

# Ver todas as skills com desenvolvedores
curl http://localhost:3000/api/skills | jq '.[] | {name, developers: .developers | length}'

# Ver skills da Alice
curl -s http://localhost:3000/api/skills | \
  jq '.[] | select(.developers[]?.name == "Alice Santos") | {name, code}'
```

---

## 🎓 Próximos Passos

1. ✅ Importar dados de exemplo
2. ✅ Verificar na aplicação web
3. ✅ Criar seus próprios CSV
4. ✅ Importar dados reais
5. ✅ Explorar a API com curl

---

## 📚 Documentação Completa

- **[IMPORT_QUICKSTART.md](./IMPORT_QUICKSTART.md)** - Referência rápida
- **[IMPORT_GUIDE.md](./IMPORT_GUIDE.md)** - Guia completo (800+ linhas)
- **[CSV_IMPORT_SUMMARY.md](./CSV_IMPORT_SUMMARY.md)** - Resumo do sistema

---

**Boa sorte com suas importações!** 🚀

Se tiver dúvidas, consulte a documentação completa ou execute `./scripts/curl-examples.sh` para ver todos os exemplos disponíveis.
