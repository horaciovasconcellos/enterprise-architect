# 📁 Arquivos CSV de Exemplo

Este diretório contém arquivos CSV de exemplo prontos para importação.

---

## 📋 Arquivos Disponíveis

### 1. **owners.csv** (10 registros)
Desenvolvedores e proprietários de sistemas.

**Colunas:**
- `name` - Nome completo
- `email` - Email corporativo
- `role` - Cargo (Developer, Tech Lead, etc.)
- `department` - Departamento (Engineering, Infrastructure, etc.)

**Exemplo:**
```csv
name,email,role,department
João Silva,joao.silva@empresa.com,Senior Developer,Engineering
Maria Santos,maria.santos@empresa.com,Tech Lead,Engineering
```

---

### 2. **technologies.csv** (20 registros)
Tecnologias utilizadas na empresa.

**Colunas:**
- `name` - Nome da tecnologia
- `version` - Versão
- `category` - Categoria (Runtime, Framework, Database, etc.)
- `description` - Descrição
- `vendor` - Fornecedor
- `licenseType` - Tipo de licença
- `supportLevel` - Nível de suporte

**Exemplo:**
```csv
name,version,category,description,vendor,licenseType,supportLevel
Node.js,20,Runtime,JavaScript runtime,OpenJS Foundation,Open Source,Community
PostgreSQL,16,Database,SQL database,PostgreSQL,Open Source,Community
```

---

### 3. **applications.csv** (10 registros)
Aplicações da empresa.

**Colunas:**
- `name` - Nome da aplicação
- `description` - Descrição
- `status` - Status (Active, Inactive, Development)
- `criticality` - Criticidade (Low, Medium, High, Critical)
- `owner` - Nome do proprietário (deve existir em owners.csv)
- `technologies` - Tecnologias separadas por `|` (formato: "Nome Versão")

**Exemplo:**
```csv
name,description,status,criticality,owner,technologies
Portal do Cliente,Sistema de atendimento,Active,High,João Silva,Node.js 20|PostgreSQL 16
```

**Nota:** O campo `technologies` usa separador `|` para múltiplas tecnologias.

---

### 4. **capabilities.csv** (15 registros)
Capacidades de negócio da empresa.

**Colunas:**
- `name` - Nome da capacidade
- `description` - Descrição
- `category` - Categoria (Business, Technical, Operations, Analytics)
- `maturityLevel` - Nível de maturidade (1-5)
- `strategicImportance` - Importância estratégica (Low, Medium, High, Critical)

**Exemplo:**
```csv
name,description,category,maturityLevel,strategicImportance
Gestão de Clientes,Capacidade de CRM,Business,4,High
DevOps e CI/CD,Automação de deploy,Technical,4,High
```

---

### 5. **skills.csv** (5 registros)
Habilidades técnicas com desenvolvedores e tecnologias.

**Colunas:**
- `name` - Nome da habilidade
- `code` - Código único
- `description` - Descrição
- `guidanceNotes` - Notas de orientação
- `levelDescription` - Descrição dos níveis
- `technologies` - Tecnologias com níveis (formato especial)
- `developers` - Desenvolvedores com níveis (formato especial)

**Formato de `technologies`:**
```
"Node.js 20:4:2024-01-01|PostgreSQL 16:5:2024-02-01"
```
- Tecnologia: `Node.js 20`
- Nível: `4` (0-5)
- Data início: `2024-01-01`
- Separador: `|` para múltiplas

**Formato de `developers`:**
```
"João Silva:5:2024-06-01:Certificado AWS|Maria Santos:4:2024-07-01:"
```
- Desenvolvedor: `João Silva`
- Nível: `5` (0-5)
- Data certificação: `2024-06-01`
- Notas: `Certificado AWS`
- Separador: `|` para múltiplos

**Exemplo:**
```csv
name,code,description,guidanceNotes,levelDescription,technologies,developers
Desenvolvimento Backend,SKILL-BACK-001,APIs e serviços,Foco em Node.js,Níveis 0-5,"Node.js 20:4:2024-01-01","João Silva:5:2024-06-01:Expert"
```

---

## 🚀 Como Usar

### Importar Tudo de Uma Vez

```bash
./scripts/import-all.sh
```

### Importar Individualmente

```bash
npm run import:csv owners data/owners.csv
npm run import:csv technologies data/technologies.csv
npm run import:csv applications data/applications.csv
npm run import:csv capabilities data/capabilities.csv
npm run import:csv skills data/skills.csv
```

### Ordem Obrigatória

⚠️ **IMPORTANTE:** Sempre importe nesta ordem:

1. `owners.csv` (primeiro)
2. `technologies.csv` (primeiro)
3. `applications.csv` (depois de owners e technologies)
4. `capabilities.csv` (independente)
5. `skills.csv` (depois de owners e technologies)

---

## ✏️ Editando os Arquivos

### Excel
1. Abrir o CSV
2. Editar os dados
3. **Salvar Como** → CSV UTF-8
4. Separador: vírgula

### LibreOffice Calc
1. Abrir o CSV
2. Editar os dados
3. **Salvar Como** → Text CSV
4. Encoding: UTF-8
5. Separador: vírgula

### Editor de Texto
Qualquer editor de texto funciona:
- VS Code
- Sublime Text
- Vim/Nano

**Importante:** Salvar com encoding UTF-8!

---

## 📝 Criando Seus Próprios CSV

### Template Básico

```csv
coluna1,coluna2,coluna3
valor1,valor2,valor3
valor4,valor5,valor6
```

**Regras:**
- Primeira linha = cabeçalhos
- Valores separados por vírgula
- Sem espaços extras
- UTF-8 encoding
- Uma linha = um registro

### Exemplo: Criar Owners Customizados

```bash
cat > data/my-team.csv << EOF
name,email,role,department
Alice Santos,alice@empresa.com,Developer,Engineering
Bob Silva,bob@empresa.com,Tech Lead,Engineering
Carol Lima,carol@empresa.com,DevOps,Infrastructure
EOF

npm run import:csv owners data/my-team.csv
```

---

## 🔍 Validando CSV

### Contar Linhas
```bash
wc -l data/owners.csv
# 11 data/owners.csv  (10 registros + 1 header)
```

### Ver Conteúdo
```bash
cat data/owners.csv
head -n 5 data/owners.csv  # Primeiras 5 linhas
```

### Validar Formato
```bash
# Ver estrutura
head -n 1 data/owners.csv  # Header
tail -n 1 data/owners.csv  # Última linha
```

---

## 🐛 Problemas Comuns

### Encoding Errado

**Sintoma:** Acentos aparecem como `├®`

**Solução:**
```bash
# Converter para UTF-8
iconv -f ISO-8859-1 -t UTF-8 arquivo.csv > arquivo-utf8.csv
```

### Vírgulas Extras

**Problema:** CSV mal formatado

**Solução:** Usar aspas duplas em campos com vírgulas:
```csv
name,description
Portal,"Sistema de CRM, vendas e atendimento"
```

### Linhas Vazias

**Problema:** Linhas em branco no CSV

**Solução:** Remover linhas vazias:
```bash
sed '/^$/d' arquivo.csv > arquivo-limpo.csv
```

---

## 📊 Estatísticas dos Arquivos

| Arquivo | Registros | Tamanho | Relações |
|---------|-----------|---------|----------|
| owners.csv | 10 | ~600 bytes | Nenhuma |
| technologies.csv | 20 | ~2 KB | Nenhuma |
| applications.csv | 10 | ~1.5 KB | → owners, technologies |
| capabilities.csv | 15 | ~1.2 KB | Nenhuma |
| skills.csv | 5 | ~1 KB | → owners, technologies |

**Total:** 60 registros de exemplo

---

## 🎯 Próximos Passos

1. ✅ Importar arquivos de exemplo
2. ✅ Verificar na aplicação (http://localhost:5173)
3. ✅ Criar seus próprios CSV
4. ✅ Importar dados reais
5. ✅ Personalizar conforme sua necessidade

---

## 📚 Documentação

Para mais informações:

- **[IMPORT_QUICKSTART.md](../IMPORT_QUICKSTART.md)** - Referência rápida
- **[IMPORT_TUTORIAL.md](../IMPORT_TUTORIAL.md)** - Tutorial passo a passo
- **[IMPORT_GUIDE.md](../IMPORT_GUIDE.md)** - Guia completo
- **[CSV_IMPORT_SUMMARY.md](../CSV_IMPORT_SUMMARY.md)** - Resumo executivo

---

**Dica:** Use `./scripts/import-all.sh` para importar todos os arquivos de uma vez! 🚀
