-- Migração: Adicionar tabela de Contratos
-- Data: 2025-10-13

USE enterprise_architect;

-- Criar tabela de contratos
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

-- Adicionar índices para performance
CREATE INDEX IF NOT EXISTS idx_contracts_application ON contracts(application_id);
CREATE INDEX IF NOT EXISTS idx_contracts_dates ON contracts(contract_start_date, contract_end_date);

-- Verificar resultado
DESCRIBE contracts;

SELECT 'Tabela de contratos criada com sucesso!' as status;
