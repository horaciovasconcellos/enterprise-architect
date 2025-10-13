# Migrações do Banco de Dados

Este diretório contém scripts de migração para atualizar o schema do banco de dados.

## Como Aplicar as Migrações

### Migração: Adicionar Campos de Tecnologia (add_technology_fields.sql)

Esta migração adiciona os seguintes campos à tabela `technologies`:
- `version` - Versão da tecnologia
- `vendor` - Fornecedor da tecnologia
- `license_type` - Tipo de licenciamento
- `support_level` - Nível de suporte
- `deployment_type` - Tipo de deployment

### Migração: Adicionar Tabela de Contratos (add_contracts_table.sql)

Esta migração cria uma nova tabela `contracts` para armazenar contratos de aplicações:
- `id` - Identificador único do contrato
- `application_id` - ID da aplicação (foreign key)
- `contract_number` - Número do contrato
- `contract_cost` - Custo do contrato
- `contract_start_date` - Data de início
- `contract_end_date` - Data de término

#### Aplicar via linha de comando:

```bash
mysql -u root -p < database/migrations/add_technology_fields.sql
mysql -u root -p < database/migrations/add_contracts_table.sql
```

Ou se estiver usando Docker:

```bash
docker exec -i <container_name> mysql -u root -p<password> < database/migrations/add_technology_fields.sql
docker exec -i <container_name> mysql -u root -p<password> < database/migrations/add_contracts_table.sql
```

#### Aplicar via MySQL Workbench ou outro cliente:

1. Abra o arquivo SQL desejado
2. Execute o script no seu banco de dados

#### Verificar se as migrações foram aplicadas:

```sql
USE enterprise_architect;
DESCRIBE technologies;
DESCRIBE contracts;
```

Você deve ver as novas colunas/tabelas listadas na estrutura.

## Ordem de Aplicação

1. `add_technology_fields.sql` - Adiciona campos à tabela technologies
2. `add_contracts_table.sql` - Cria tabela contracts

## Notas Importantes

- ⚠️ **Sempre faça backup do banco de dados antes de aplicar migrações**
- As migrações usam `IF NOT EXISTS`, então são seguras para executar múltiplas vezes
- Após aplicar migrações, reinicie o servidor da aplicação para garantir que as mudanças sejam reconhecidas

