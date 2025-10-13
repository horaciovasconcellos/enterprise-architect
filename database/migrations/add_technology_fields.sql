-- Migração: Adicionar campos de Versão, Fornecedor, Licença, Suporte e Deployment à tabela technologies
-- Data: 2025-10-13

USE enterprise_architect;

-- Adicionar colunas se não existirem
ALTER TABLE technologies 
ADD COLUMN IF NOT EXISTS version VARCHAR(50) AFTER strategic_fit,
ADD COLUMN IF NOT EXISTS vendor VARCHAR(255) AFTER version,
ADD COLUMN IF NOT EXISTS license_type VARCHAR(100) AFTER vendor,
ADD COLUMN IF NOT EXISTS support_level VARCHAR(100) AFTER license_type,
ADD COLUMN IF NOT EXISTS deployment_type VARCHAR(100) AFTER support_level;

-- Verificar resultado
DESCRIBE technologies;
