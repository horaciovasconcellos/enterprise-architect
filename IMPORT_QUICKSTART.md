# 🚀 Quick Start - Importação de Dados

## Opção 1: Importação Completa (Recomendado)

```bash
# 1. Iniciar servidor
npm run server:dev

# 2. Em outro terminal, importar tudo
./scripts/import-all.sh
```

## Opção 2: Importação Individual

```bash
# Importar apenas owners
npm run import:csv owners data/owners.csv

# Importar apenas technologies
npm run import:csv technologies data/technologies.csv

# Importar apenas applications
npm run import:csv applications data/applications.csv

# Importar apenas capabilities
npm run import:csv capabilities data/capabilities.csv

# Importar apenas skills
npm run import:csv skills data/skills.csv
```

## Opção 3: Usando CURL

```bash
# Ver exemplos completos
./scripts/curl-examples.sh

# Ou comandos rápidos
./scripts/curl-quick.sh
```

## Comandos CURL Básicos

### Criar Owner
```bash
curl -X POST http://localhost:3000/api/owners \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "João Silva",
    "email": "joao@empresa.com",
    "role": "Developer",
    "department": "Engineering"
  }'
```

### Criar Technology
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
  }'
```

### Listar Todos
```bash
curl http://localhost:3000/api/owners | jq
curl http://localhost:3000/api/technologies | jq
curl http://localhost:3000/api/applications | jq
curl http://localhost:3000/api/capabilities | jq
curl http://localhost:3000/api/skills | jq
```

## Arquivos CSV de Exemplo

Todos os arquivos CSV de exemplo estão em `data/`:
- `data/owners.csv` - 10 desenvolvedores de exemplo
- `data/technologies.csv` - 20 tecnologias de exemplo
- `data/applications.csv` - 10 aplicações de exemplo
- `data/capabilities.csv` - 15 capacidades de exemplo
- `data/skills.csv` - 5 habilidades completas de exemplo

## Documentação Completa

📖 **Guia completo:** [IMPORT_GUIDE.md](./IMPORT_GUIDE.md)

Inclui:
- Formatos detalhados de CSV
- Exemplos avançados de curl
- Troubleshooting
- Scripts de automação
- Queries úteis

## Ordem de Importação

⚠️ **IMPORTANTE:** Sempre importe nesta ordem:

1. **Owners** (sem dependências)
2. **Technologies** (sem dependências)
3. **Applications** (depende de Owners e Technologies)
4. **Capabilities** (sem dependências)
5. **Skills** (depende de Owners e Technologies)

## Verificar Importação

```bash
# Contar registros
echo "Owners: $(curl -s http://localhost:3000/api/owners | jq 'length')"
echo "Technologies: $(curl -s http://localhost:3000/api/technologies | jq 'length')"
echo "Applications: $(curl -s http://localhost:3000/api/applications | jq 'length')"
echo "Capabilities: $(curl -s http://localhost:3000/api/capabilities | jq 'length')"
echo "Skills: $(curl -s http://localhost:3000/api/skills | jq 'length')"
```

## Acessar Aplicação

Após importação:
- **Frontend:** http://localhost:5173
- **API:** http://localhost:3000/api

---

**Dica:** Use o script `import-all.sh` para importar tudo de uma vez! 🚀
