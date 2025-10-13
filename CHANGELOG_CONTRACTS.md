# Atualização: Sistema de Contratos para Aplicações

## 📋 Resumo das Alterações

Data: 13 de outubro de 2025

### ✅ Arquivos Criados/Modificados

#### 🆕 Novos Arquivos

1. **`src/services/ContractService.ts`** - Serviço completo para gerenciamento de contratos
2. **`database/migrations/add_contracts_table.sql`** - Script de migração para criar tabela de contratos

#### 📝 Arquivos Modificados

1. **`src/components/forms/ApplicationForm.tsx`**
   - Adicionada interface `Contract`
   - Campo `contracts` na interface `Application`
   - Funções para gerenciar contratos: `addContract`, `updateContract`, `removeContract`
   - Seção "Informações Financeiras" com tabela de contratos

2. **`src/services/ApplicationService.ts`**
   - Importação do `ContractService`
   - Interface `Contract` adicionada
   - Campo `contracts` na interface `Application`
   - Integração para buscar contratos ao carregar aplicações
   - Método para criar contratos ao criar aplicação
   - Método para sincronizar contratos ao atualizar aplicação

3. **`database/schema.sql`**
   - Tabela `contracts` adicionada
   - Índices de performance para contratos

4. **`database/migrations/README.md`**
   - Documentação atualizada com instruções para migração de contratos

---

## 🗄️ Estrutura do Banco de Dados

### Nova Tabela: `contracts`

```sql
CREATE TABLE IF NOT EXISTS contracts (
    id VARCHAR(36) PRIMARY KEY,
    application_id VARCHAR(36) NOT NULL,
    contract_number VARCHAR(100) NOT NULL,
    contract_cost DECIMAL(15,2),
    contract_start_date DATE,
    contract_end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);
```

### Índices Criados

```sql
CREATE INDEX idx_contracts_application ON contracts(application_id);
CREATE INDEX idx_contracts_dates ON contracts(contract_start_date, contract_end_date);
```

---

## 📊 Interface do Formulário

### Campos de Contrato

| Campo | Tipo | Descrição |
|-------|------|-----------|
| **Número do Contrato** | Texto | Identificador único (Ex: CTR-2024-001) |
| **Custo do Contrato** | Decimal | Valor total do contrato |
| **Data de Início** | Date | Data de início da vigência |
| **Data de Término** | Date | Data de término da vigência |

### Layout da Tabela

```
┌────────────────────────────────────────────────────────────────────┐
│ Contratos                               [+ Adicionar Contrato]     │
├────────────────────────────────────────────────────────────────────┤
│ Número      │ Custo      │ Data Início │ Data Término │ Ações      │
├────────────────────────────────────────────────────────────────────┤
│ [Input]     │ [Number]   │ [Date]      │ [Date]       │  [X]       │
│ [Input]     │ [Number]   │ [Date]      │ [Date]       │  [X]       │
└────────────────────────────────────────────────────────────────────┘
```

---

## 🔧 API do ContractService

### Métodos Disponíveis

#### `findByApplicationId(applicationId: string): Promise<Contract[]>`
Busca todos os contratos de uma aplicação específica.

#### `create(applicationId: string, data: ContractData): Promise<Contract>`
Cria um novo contrato vinculado a uma aplicação.

#### `update(id: string, data: ContractData): Promise<void>`
Atualiza um contrato existente.

#### `delete(id: string): Promise<void>`
Remove um contrato específico.

#### `deleteByApplicationId(applicationId: string): Promise<void>`
Remove todos os contratos de uma aplicação.

#### `syncContracts(applicationId: string, contracts: Contract[]): Promise<void>`
Sincroniza contratos (remove todos os antigos e cria os novos).

---

## 🚀 Como Usar

### 1. Aplicar Migração no Banco de Dados

```bash
mysql -u root -p enterprise_architect < database/migrations/add_contracts_table.sql
```

**Ou via Docker:**

```bash
docker exec -i mysql_container mysql -u root -psenha < database/migrations/add_contracts_table.sql
```

### 2. Verificar Migração

```sql
USE enterprise_architect;
DESCRIBE contracts;
```

### 3. Reiniciar Servidor

```bash
npm run dev
```

### 4. Testar no Frontend

1. Abra a aplicação
2. Vá para "Aplicações"
3. Clique em "Nova Aplicação" ou edite uma existente
4. Na seção "Informações Financeiras", clique em "+ Adicionar Contrato"
5. Preencha os campos do contrato
6. Salve a aplicação

---

## 📦 Estrutura de Dados

### Exemplo de Aplicação com Contratos

```json
{
  "id": "uuid-123",
  "name": "Sistema CRM",
  "description": "Sistema de gestão de clientes",
  "estimatedCost": 100000,
  "currency": "BRL",
  "contracts": [
    {
      "contractNumber": "CTR-2024-001",
      "contractCost": 50000,
      "contractStartDate": "2024-01-01",
      "contractEndDate": "2024-12-31"
    },
    {
      "contractNumber": "CTR-2024-002",
      "contractCost": 30000,
      "contractStartDate": "2024-06-01",
      "contractEndDate": "2025-05-31"
    }
  ]
}
```

---

## ✨ Funcionalidades

✅ **Múltiplos Contratos:** Uma aplicação pode ter vários contratos  
✅ **CRUD Completo:** Criar, ler, atualizar e deletar contratos  
✅ **Interface Tabular:** Visualização organizada em formato de tabela  
✅ **Sincronização Automática:** Contratos são atualizados ao salvar aplicação  
✅ **Cascade Delete:** Ao deletar aplicação, contratos são removidos automaticamente  
✅ **Validação de Datas:** Campos de data com seletor nativo  
✅ **Estado Vazio:** Mensagem informativa quando não há contratos  

---

## 🔄 Fluxo de Dados

### Criar Aplicação com Contratos

1. Usuário preenche formulário de aplicação
2. Adiciona um ou mais contratos
3. Ao salvar, `ApplicationService.create()` é chamado
4. Aplicação é criada no banco
5. Para cada contrato, `ContractService.create()` é chamado
6. Contratos são vinculados à aplicação

### Atualizar Aplicação com Contratos

1. Usuário edita aplicação existente
2. Modifica/adiciona/remove contratos
3. Ao salvar, `ApplicationService.update()` é chamado
4. Aplicação é atualizada
5. `ContractService.syncContracts()` é chamado
6. Contratos antigos são deletados
7. Novos contratos são criados

### Deletar Aplicação

1. Usuário deleta aplicação
2. `ApplicationService.delete()` é chamado
3. Banco de dados remove aplicação
4. `ON DELETE CASCADE` remove automaticamente todos os contratos

---

## 🎯 Próximas Melhorias Sugeridas

- [ ] Adicionar campo de status do contrato (Ativo, Vencido, Cancelado)
- [ ] Implementar alertas de contratos próximos ao vencimento
- [ ] Adicionar anexos/documentos aos contratos
- [ ] Relatório de custos totais por aplicação
- [ ] Histórico de alterações de contratos
- [ ] Validação de datas (início < término)
- [ ] Cálculo automático de custo mensal

---

## 📚 Referências

- **Formulário:** `src/components/forms/ApplicationForm.tsx`
- **Serviço de Contratos:** `src/services/ContractService.ts`
- **Serviço de Aplicações:** `src/services/ApplicationService.ts`
- **Schema do Banco:** `database/schema.sql`
- **Migração:** `database/migrations/add_contracts_table.sql`
