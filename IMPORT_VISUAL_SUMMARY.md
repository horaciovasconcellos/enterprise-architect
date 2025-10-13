# 🎯 Sistema de Importação - Resumo Visual

```
╔══════════════════════════════════════════════════════════════════════════╗
║                                                                          ║
║                    📥 SISTEMA DE IMPORTAÇÃO COMPLETO                     ║
║                        Enterprise Architect v1.0                         ║
║                                                                          ║
╚══════════════════════════════════════════════════════════════════════════╝
```

## 🗂️ Arquivos Criados

```
enterprise-architect/
├── scripts/
│   ├── import-csv.ts          ✅ Script TypeScript de importação CSV
│   ├── import-all.sh          ✅ Script completo de importação
│   ├── curl-examples.sh       ✅ 400+ linhas de exemplos curl
│   ├── curl-quick.sh          ✅ Comandos curl rápidos
│   └── demo-import.sh         ✅ Demo interativa
│
├── data/
│   ├── owners.csv             ✅ 10 desenvolvedores exemplo
│   ├── technologies.csv       ✅ 20 tecnologias exemplo
│   ├── applications.csv       ✅ 10 aplicações exemplo
│   ├── capabilities.csv       ✅ 15 capacidades exemplo
│   └── skills.csv             ✅ 5 skills completas exemplo
│
├── docs/
│   ├── IMPORT_GUIDE.md        ✅ Guia completo (800+ linhas)
│   ├── IMPORT_QUICKSTART.md   ✅ Quick start
│   ├── IMPORT_TUTORIAL.md     ✅ Tutorial passo a passo
│   └── CSV_IMPORT_SUMMARY.md  ✅ Resumo executivo
│
└── package.json               ✅ Script npm adicionado
```

---

## 🚀 3 Formas de Importar

### 1️⃣ Script Completo (Recomendado)

```bash
./scripts/import-all.sh
```

**O que faz:**
- ✅ Verifica conectividade da API
- ✅ Valida arquivos CSV
- ✅ Importa tudo na ordem correta
- ✅ Mostra progresso em tempo real
- ✅ Relatório final com estatísticas

**Output:**
```
╔════════════════════════════════════════════════════════════╗
║          🚀 IMPORTAÇÃO COMPLETA - CSV TO API               ║
╚════════════════════════════════════════════════════════════╝

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

---

### 2️⃣ CSV Individual

```bash
npm run import:csv <tipo> <arquivo>
```

**Exemplos:**
```bash
npm run import:csv owners data/owners.csv
npm run import:csv technologies data/technologies.csv
npm run import:csv skills data/skills.csv
```

**Quando usar:**
- Importar apenas um tipo de dado
- Testar importação
- Adicionar novos registros

---

### 3️⃣ CURL Direto

```bash
curl -X POST http://localhost:3000/api/owners \
  -H 'Content-Type: application/json' \
  -d '{ "name": "João", ... }'
```

**Quando usar:**
- Criar registros individuais
- Integração com outros sistemas
- Automação customizada
- Testes da API

---

## 📊 Formatos CSV

### Owners (Simples)
```csv
name,email,role,department
João Silva,joao@empresa.com,Developer,Engineering
```

### Technologies (Simples)
```csv
name,version,category,description,vendor,licenseType,supportLevel
Node.js,20,Runtime,JavaScript runtime,OpenJS,Open Source,Community
```

### Applications (Com Relações)
```csv
name,description,status,criticality,owner,technologies
Portal,Web system,Active,High,João Silva,Node.js 20|PostgreSQL 16
```
**📌 Nota:** Technologies separadas por `|`

### Skills (Complexo)
```csv
name,code,description,guidanceNotes,levelDescription,technologies,developers
Backend,SKILL-001,API dev,Focus Node.js,Levels 0-5,"Node.js 20:4:2024-01-01","João Silva:5:2024-06-01:Expert"
```

**📌 Formato Technologies:** `"Nome Versão:Nível(0-5):Data|Próxima:Nível:Data"`

**📌 Formato Developers:** `"Nome:Nível(0-5):DataCert:Notas|Próximo:..."`

---

## ⚡ Quick Start

```bash
# 1. Iniciar servidor
npm run server:dev

# 2. Importar tudo
./scripts/import-all.sh

# 3. Verificar
curl http://localhost:3000/api/owners | jq 'length'

# 4. Acessar app
open http://localhost:5173
```

---

## 🎯 Ordem de Importação

```
ORDEM CORRETA:

1. Owners       ← Sem dependências
2. Technologies ← Sem dependências
        ↓
3. Applications ← Precisa de Owners + Technologies
4. Capabilities ← Sem dependências
        ↓
5. Skills       ← Precisa de Owners + Technologies
```

**❌ ERRADO:**
```bash
npm run import:csv applications data/applications.csv  # ❌ Falha!
npm run import:csv owners data/owners.csv              # Precisa vir antes
```

**✅ CORRETO:**
```bash
npm run import:csv owners data/owners.csv
npm run import:csv technologies data/technologies.csv
npm run import:csv applications data/applications.csv
```

---

## 🔍 Comandos Úteis

### Verificar Dados
```bash
# Contar registros
curl -s http://localhost:3000/api/owners | jq 'length'

# Listar nomes
curl -s http://localhost:3000/api/owners | jq '.[] | .name'

# Buscar por ID
curl http://localhost:3000/api/owners/OWNER_ID | jq
```

### Backup Antes de Importar
```bash
mkdir -p backups
curl -s http://localhost:3000/api/owners > backups/owners-backup.json
```

### Monitorar Importação
```bash
# Em outro terminal
watch -n 1 'curl -s http://localhost:3000/api/owners | jq "length"'
```

---

## 📚 Documentação

| Arquivo | Descrição | Linhas |
|---------|-----------|--------|
| **IMPORT_QUICKSTART.md** | Referência rápida | 150+ |
| **IMPORT_TUTORIAL.md** | Tutorial passo a passo | 500+ |
| **IMPORT_GUIDE.md** | Guia completo | 800+ |
| **CSV_IMPORT_SUMMARY.md** | Resumo executivo | 400+ |

---

## 🎨 Scripts Disponíveis

| Script | Comando | Descrição |
|--------|---------|-----------|
| **import-all.sh** | `./scripts/import-all.sh` | Importação completa |
| **import-csv.ts** | `npm run import:csv <tipo> <csv>` | Importação individual |
| **curl-examples.sh** | `./scripts/curl-examples.sh` | Ver exemplos curl |
| **curl-quick.sh** | `./scripts/curl-quick.sh` | Comandos rápidos |
| **demo-import.sh** | `./scripts/demo-import.sh` | Demo interativa |

---

## ✅ Checklist

### Antes de Importar
- [ ] API rodando (`npm run server:dev`)
- [ ] `csv-parse` instalado (`npm install csv-parse`)
- [ ] Arquivos CSV criados
- [ ] Backup dos dados (opcional)

### Ordem de Importação
- [ ] 1. Owners
- [ ] 2. Technologies
- [ ] 3. Applications
- [ ] 4. Capabilities
- [ ] 5. Skills

### Após Importação
- [ ] Verificar no browser (http://localhost:5173)
- [ ] Validar contagem via curl
- [ ] Testar CRUD na interface

---

## 🔧 Troubleshooting

| Erro | Solução |
|------|---------|
| "csv-parse not found" | `npm install csv-parse` |
| "Owner não encontrado" | Importar owners primeiro |
| "API não responde" | `npm run server:dev` |
| Encoding errado | Salvar CSV como UTF-8 |
| "Technology não encontrada" | Verificar nome exato no CSV |

---

## 💡 Dicas

### Excel/LibreOffice
- Salvar Como → CSV UTF-8
- Separador: vírgula
- Sem aspas extras

### Criar CSV Rápido
```bash
cat > data/test.csv << EOF
name,email,role,department
Test User,test@empresa.com,Developer,Engineering
EOF

npm run import:csv owners data/test.csv
```

### Exportar para CSV
```bash
curl -s http://localhost:3000/api/owners | \
  jq -r '["name","email","role"], (.[] | [.name, .email, .role]) | @csv' \
  > export.csv
```

---

## 🎓 Exemplos Práticos

### 1. Importar 1 Desenvolvedor
```bash
echo "name,email,role,department" > dev.csv
echo "Maria Santos,maria@empresa.com,Developer,Engineering" >> dev.csv
npm run import:csv owners dev.csv
```

### 2. Criar via CURL
```bash
curl -X POST http://localhost:3000/api/owners \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Carlos Souza",
    "email": "carlos@empresa.com",
    "role": "Tech Lead",
    "department": "Engineering"
  }' | jq
```

### 3. Importar Stack Completa
```bash
# Criar stack.csv
cat > stack.csv << EOF
name,version,category,description,vendor,licenseType,supportLevel
Python,3.12,Language,Programming,PSF,Open Source,Community
Django,5,Framework,Web framework,Django,Open Source,Community
EOF

# Importar
npm run import:csv technologies stack.csv

# Verificar
curl http://localhost:3000/api/technologies | jq '.[] | {name, version}'
```

---

## 🌟 Features

- ✅ Parser CSV robusto (UTF-8 BOM support)
- ✅ Validação de dependências
- ✅ Resolução automática de IDs
- ✅ Transações ACID
- ✅ Relatórios detalhados
- ✅ Logs coloridos
- ✅ Progress tracking
- ✅ Error handling completo
- ✅ Rollback em caso de falha
- ✅ Formatos complexos (N:N relationships)

---

## 📞 Suporte

**Documentação Completa:** [IMPORT_GUIDE.md](./IMPORT_GUIDE.md)

**Quick Start:** [IMPORT_QUICKSTART.md](./IMPORT_QUICKSTART.md)

**Tutorial:** [IMPORT_TUTORIAL.md](./IMPORT_TUTORIAL.md)

**Scripts:** `./scripts/curl-examples.sh`

---

```
╔══════════════════════════════════════════════════════════════════════════╗
║                                                                          ║
║                    ✅ SISTEMA 100% FUNCIONAL                             ║
║                                                                          ║
║                  Pronto para Importação em Produção!                     ║
║                                                                          ║
╚══════════════════════════════════════════════════════════════════════════╝
```

**Data:** 13/10/2025  
**Versão:** 1.0.0  
**Status:** ✅ Production Ready
