# ✅ Checklist - Sistema de Importação

Use este checklist para garantir que tudo está funcionando corretamente.

---

## 📋 Pré-requisitos

- [ ] Node.js instalado
- [ ] MySQL rodando
- [ ] Dependências instaladas (`npm install`)
- [ ] Database criado e migrado
- [ ] `csv-parse` instalado (`npm install csv-parse`)
- [ ] `jq` instalado (opcional: `brew install jq`)

---

## 🚀 Teste Rápido (5 minutos)

### Passo 1: Iniciar Servidor
```bash
npm run server:dev
```

**Verificar:**
- [ ] Console mostra "✅ Database connected"
- [ ] Console mostra "🚀 Server running on http://localhost:3000"
- [ ] Sem erros no console

### Passo 2: Testar API
```bash
curl http://localhost:3000/api/owners
```

**Verificar:**
- [ ] Retorna JSON (pode ser array vazio: `[]`)
- [ ] Sem erro 404 ou 500
- [ ] Response code 200

### Passo 3: Executar Importação
```bash
./scripts/import-all.sh
```

**Verificar:**
- [ ] Script executa sem erros
- [ ] Mostra progresso de importação
- [ ] Exibe "✅ IMPORTAÇÃO CONCLUÍDA COM SUCESSO!"
- [ ] Mostra estatísticas finais

### Passo 4: Verificar Dados
```bash
curl http://localhost:3000/api/owners | jq 'length'
```

**Verificar:**
- [ ] Retorna número > 0 (esperado: 10)
- [ ] Dados aparecem corretamente

### Passo 5: Acessar Interface
```bash
open http://localhost:5173
```

**Verificar:**
- [ ] Aplicação carrega sem erros
- [ ] Menu lateral visível
- [ ] Dados aparecem nas views
- [ ] Pode navegar entre as páginas

---

## 📊 Testes Individuais

### Teste CSV Individual

```bash
npm run import:csv owners data/owners.csv
```

**Verificar:**
- [ ] Comando executa
- [ ] Mostra "✅ [X/10] Owner criado"
- [ ] Sem erros de importação
- [ ] Estatísticas finais corretas

### Teste CURL Manual

```bash
curl -X POST http://localhost:3000/api/owners \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Test User",
    "email": "test@empresa.com",
    "role": "Developer",
    "department": "Engineering"
  }' | jq
```

**Verificar:**
- [ ] Retorna JSON com o owner criado
- [ ] Contém campo `id` (UUID)
- [ ] Todos os campos presentes
- [ ] Response code 200

### Teste Demo Script

```bash
./scripts/demo-import.sh
```

**Verificar:**
- [ ] Cria 5 registros (Owner, Technology, Application, Capability, Skill)
- [ ] Mostra IDs de cada registro criado
- [ ] Sem erros
- [ ] Resumo final exibido

---

## 🔍 Validação de Dados

### Contar Registros

```bash
echo "Owners: $(curl -s http://localhost:3000/api/owners | jq 'length')"
echo "Technologies: $(curl -s http://localhost:3000/api/technologies | jq 'length')"
echo "Applications: $(curl -s http://localhost:3000/api/applications | jq 'length')"
echo "Capabilities: $(curl -s http://localhost:3000/api/capabilities | jq 'length')"
echo "Skills: $(curl -s http://localhost:3000/api/skills | jq 'length')"
```

**Resultados esperados (após import-all.sh):**
- [ ] Owners: 10
- [ ] Technologies: 20
- [ ] Applications: 10
- [ ] Capabilities: 15
- [ ] Skills: 5

### Verificar Relações

```bash
# Skills com tecnologias
curl -s http://localhost:3000/api/skills | \
  jq '.[] | {name, techs: .technologies | length, devs: .developers | length}'
```

**Verificar:**
- [ ] Cada skill tem tecnologias (> 0)
- [ ] Cada skill tem desenvolvedores (> 0)
- [ ] Dados estruturados corretamente

### Verificar Integridade

```bash
# Applications devem ter owner válido
curl -s http://localhost:3000/api/applications | \
  jq '.[] | select(.ownerId == null or .ownerId == "") | .name'
```

**Verificar:**
- [ ] Não retorna nada (todas as apps têm owner)

---

## 📝 Testes de Arquivos

### Verificar CSVs

```bash
ls -lh data/*.csv
```

**Verificar:**
- [ ] 5 arquivos CSV existem
- [ ] Todos com tamanho > 0
- [ ] Permissões de leitura OK

### Validar Formato CSV

```bash
head -n 3 data/owners.csv
```

**Verificar:**
- [ ] Primeira linha = header
- [ ] Segunda linha = dados
- [ ] Formato: valor,valor,valor
- [ ] Sem caracteres estranhos

### Verificar Encoding

```bash
file data/owners.csv
```

**Verificar:**
- [ ] Contém "UTF-8" ou "ASCII"
- [ ] Não é ISO-8859 ou outro encoding

---

## 🔧 Testes de Scripts

### Scripts São Executáveis

```bash
ls -la scripts/*.sh
```

**Verificar:**
- [ ] Todos têm permissão de execução (x)
- [ ] Formato: `-rwxr-xr-x` ou similar

### Scripts Funcionam

```bash
./scripts/curl-examples.sh 2>&1 | head -n 20
```

**Verificar:**
- [ ] Executa sem erro de permissão
- [ ] Mostra exemplos formatados
- [ ] Cores aparecem corretamente

---

## 🌐 Testes de Interface

### Frontend Carrega

```bash
# Em outro terminal
npm run dev
```

**Verificar (no browser):**
- [ ] http://localhost:5173 carrega
- [ ] Sem erros no console (F12)
- [ ] Menu lateral visível
- [ ] Logo/header aparecem

### Navegação Funciona

**Verificar (clicando no menu):**
- [ ] Owners view carrega
- [ ] Technologies view carrega
- [ ] Applications view carrega
- [ ] Capabilities view carrega
- [ ] Skills view carrega

### Dados Aparecem

**Verificar:**
- [ ] Cards/tabelas com dados
- [ ] Botões "Criar", "Editar", "Deletar" visíveis
- [ ] Estatísticas (KPIs) mostram números corretos
- [ ] Sem "loading" infinito

---

## 📚 Documentação

### Arquivos Existem

```bash
ls -lh *.md
```

**Verificar:**
- [ ] IMPORT_QUICKSTART.md
- [ ] IMPORT_TUTORIAL.md
- [ ] IMPORT_GUIDE.md
- [ ] CSV_IMPORT_SUMMARY.md
- [ ] IMPORT_VISUAL_SUMMARY.md
- [ ] IMPORT_DELIVERY.md

### Documentação Está Completa

```bash
wc -l IMPORT_GUIDE.md
```

**Verificar:**
- [ ] IMPORT_GUIDE.md tem 800+ linhas
- [ ] Todos os arquivos têm conteúdo
- [ ] Links internos funcionam

---

## 🐛 Teste de Erros

### Importar com API Offline

```bash
# Parar servidor (Ctrl+C)
./scripts/import-all.sh
```

**Verificar:**
- [ ] Script detecta API offline
- [ ] Mostra erro claro
- [ ] Sugere iniciar servidor
- [ ] Não trava ou dá timeout infinito

### Importar CSV Inválido

```bash
echo "invalido" > /tmp/test.csv
npm run import:csv owners /tmp/test.csv
```

**Verificar:**
- [ ] Script detecta erro
- [ ] Mostra mensagem de erro
- [ ] Não quebra o banco de dados

### CURL com Dados Inválidos

```bash
curl -X POST http://localhost:3000/api/owners \
  -H 'Content-Type: application/json' \
  -d '{"name": ""}' | jq
```

**Verificar:**
- [ ] Retorna erro de validação
- [ ] Response code 400 ou 422
- [ ] Mensagem de erro descritiva

---

## ✅ Checklist Final

### Sistema Funcional
- [ ] ✅ API respondendo
- [ ] ✅ Frontend carregando
- [ ] ✅ Dados importados
- [ ] ✅ CRUD funcionando
- [ ] ✅ Relações preservadas

### Scripts Funcionais
- [ ] ✅ import-all.sh executa
- [ ] ✅ import:csv funciona
- [ ] ✅ curl-examples.sh mostra exemplos
- [ ] ✅ demo-import.sh cria registros

### Documentação
- [ ] ✅ 6 arquivos markdown criados
- [ ] ✅ 2.500+ linhas de documentação
- [ ] ✅ Exemplos práticos incluídos
- [ ] ✅ Troubleshooting documentado

### CSV e Dados
- [ ] ✅ 5 arquivos CSV de exemplo
- [ ] ✅ 60 registros prontos
- [ ] ✅ Formatos documentados
- [ ] ✅ README em data/ criado

---

## 🎯 Resultado Esperado

Após completar todos os itens:

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║              ✅ TODOS OS TESTES PASSARAM!                    ║
║                                                              ║
║          Sistema de Importação 100% Funcional               ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

Registros importados:
   • Owners: 10
   • Technologies: 20
   • Applications: 10
   • Capabilities: 15
   • Skills: 5

Scripts funcionando:
   • import-all.sh ✅
   • import-csv.ts ✅
   • curl-examples.sh ✅
   • demo-import.sh ✅

Interface:
   • Frontend carregando ✅
   • Dados visíveis ✅
   • CRUD funcionando ✅

Documentação:
   • 6 arquivos markdown ✅
   • 2.500+ linhas ✅
   • Exemplos práticos ✅
```

---

## 🆘 Se Algo Falhar

### Problema: Script não executa

**Solução:**
```bash
chmod +x scripts/*.sh
```

### Problema: csv-parse não encontrado

**Solução:**
```bash
npm install csv-parse
```

### Problema: API não responde

**Solução:**
```bash
npm run server:dev
# Verificar logs de erro
```

### Problema: Dados não aparecem

**Solução:**
```bash
# Verificar se foram importados
curl http://localhost:3000/api/owners | jq 'length'

# Re-importar se necessário
./scripts/import-all.sh
```

---

## 📞 Documentação de Suporte

Se precisar de ajuda:

1. **Quick Start:** [IMPORT_QUICKSTART.md](./IMPORT_QUICKSTART.md)
2. **Tutorial:** [IMPORT_TUTORIAL.md](./IMPORT_TUTORIAL.md)
3. **Guia Completo:** [IMPORT_GUIDE.md](./IMPORT_GUIDE.md)
4. **Troubleshooting:** IMPORT_GUIDE.md seção "Troubleshooting"

---

**Data:** 13/10/2025  
**Versão Checklist:** 1.0.0  
**Status:** ✅ Pronto para Validação
