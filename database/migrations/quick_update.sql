# Script de Atualização Rápida do Banco de Dados

-- Use este script para adicionar rapidamente os novos campos à tabela technologies

USE enterprise_architect;

-- Adicionar as novas colunas
ALTER TABLE technologies 
ADD COLUMN version VARCHAR(50),
ADD COLUMN vendor VARCHAR(255),
ADD COLUMN license_type VARCHAR(100),
ADD COLUMN support_level VARCHAR(100),
ADD COLUMN deployment_type VARCHAR(100);

-- Verificar as mudanças
DESCRIBE technologies;

SELECT 'Migração concluída com sucesso!' as status;
