-- Dados de exemplo para o Enterprise Architect

USE enterprise_architect;

-- Inserir proprietários de exemplo
INSERT INTO owners (id, matricula, nome, area) VALUES
('owner-1', 'EMP001', 'João Silva', 'Tecnologia da Informação'),
('owner-2', 'EMP002', 'Maria Santos', 'Recursos Humanos'),
('owner-3', 'EMP003', 'Pedro Costa', 'Financeiro'),
('owner-4', 'EMP004', 'Ana Oliveira', 'Marketing');

-- Inserir tecnologias de exemplo
INSERT INTO technologies (id, name, description, category, maturity_level, adoption_score, strategic_fit) VALUES
('tech-1', 'React', 'Biblioteca JavaScript para construção de interfaces', 'Frontend', 'MAINSTREAM', 95, 'EXCELENTE'),
('tech-2', 'Node.js', 'Runtime JavaScript para backend', 'Backend', 'MAINSTREAM', 90, 'BOM'),
('tech-3', 'MySQL', 'Sistema de gerenciamento de banco de dados', 'Database', 'MAINSTREAM', 85, 'BOM'),
('tech-4', 'Docker', 'Plataforma de containerização', 'DevOps', 'MAINSTREAM', 88, 'EXCELENTE'),
('tech-5', 'Python', 'Linguagem de programação', 'Backend', 'MAINSTREAM', 92, 'EXCELENTE');

-- Inserir capacidades de negócio de exemplo
INSERT INTO capabilities (id, name, description, criticality, coverage_score) VALUES
('cap-1', 'Gestão de Clientes', 'Capacidade de gerenciar informações e relacionamento com clientes', 'CRÍTICA', 85),
('cap-2', 'Gestão Financeira', 'Capacidade de controlar finanças e contabilidade', 'CRÍTICA', 90),
('cap-3', 'Recursos Humanos', 'Capacidade de gerenciar funcionários e processos de RH', 'ALTA', 75),
('cap-4', 'Marketing Digital', 'Capacidade de executar campanhas de marketing digital', 'MÉDIA', 70);

-- Inserir processos de exemplo
INSERT INTO processes (id, name, description, criticality, efficiency_score, automation_level) VALUES
('proc-1', 'Processo de Vendas', 'Processo completo desde lead até fechamento', 'CRÍTICA', 80, 'SEMI_AUTOMATIZADO'),
('proc-2', 'Processo de Contratação', 'Processo de recrutamento e seleção', 'ALTA', 75, 'MANUAL'),
('proc-3', 'Processo de Faturamento', 'Processo de emissão e controle de faturas', 'CRÍTICA', 90, 'AUTOMATIZADO'),
('proc-4', 'Processo de Suporte', 'Processo de atendimento ao cliente', 'ALTA', 70, 'SEMI_AUTOMATIZADO');

-- Inserir aplicações de exemplo
INSERT INTO applications (id, name, description, lifecycle_phase, criticality, hosting_type, health_score, technical_fit, functional_fit, estimated_cost, currency) VALUES
('app-1', 'Sistema CRM', 'Sistema de gestão de relacionamento com clientes', 'PRODUCAO', 'CRITICA', 'NUVEM_PUBLICA', 85, 'BOM', 'EXCELENTE', 120000.00, 'BRL'),
('app-2', 'Sistema ERP', 'Sistema integrado de gestão empresarial', 'PRODUCAO', 'CRITICA', 'ON_PREMISE', 78, 'ADEQUADO', 'BOM', 250000.00, 'BRL'),
('app-3', 'Portal RH', 'Portal de autoatendimento para funcionários', 'PRODUCAO', 'ALTA', 'NUVEM_PRIVADA', 82, 'BOM', 'BOM', 45000.00, 'BRL'),
('app-4', 'E-commerce', 'Plataforma de vendas online', 'DESENVOLVIMENTO', 'ALTA', 'NUVEM_PUBLICA', 75, 'EXCELENTE', 'BOM', 180000.00, 'BRL');

-- Inserir interfaces de exemplo
INSERT INTO interfaces (id, source_app, target_app, interface_type, frequency, description) VALUES
('int-1', 'Sistema CRM', 'Sistema ERP', 'API_REST', 'TEMPO_REAL', 'Sincronização de dados de clientes'),
('int-2', 'E-commerce', 'Sistema ERP', 'API_REST', 'TEMPO_REAL', 'Integração de pedidos'),
('int-3', 'Portal RH', 'Sistema ERP', 'ARQUIVO_BATCH', 'DIARIO', 'Importação de dados de funcionários');

-- Relacionamentos entre aplicações e capacidades
INSERT INTO application_capabilities (application_id, capability_id) VALUES
('app-1', 'cap-1'),
('app-2', 'cap-2'),
('app-2', 'cap-3'),
('app-3', 'cap-3'),
('app-4', 'cap-1'),
('app-4', 'cap-4');

-- Relacionamentos entre aplicações e processos
INSERT INTO application_processes (application_id, process_id) VALUES
('app-1', 'proc-1'),
('app-1', 'proc-4'),
('app-2', 'proc-3'),
('app-3', 'proc-2'),
('app-4', 'proc-1');

-- Relacionamentos entre aplicações e tecnologias
INSERT INTO application_technologies (application_id, technology_id) VALUES
('app-1', 'tech-1'),
('app-1', 'tech-2'),
('app-1', 'tech-3'),
('app-2', 'tech-5'),
('app-2', 'tech-3'),
('app-3', 'tech-1'),
('app-3', 'tech-2'),
('app-4', 'tech-1'),
('app-4', 'tech-2'),
('app-4', 'tech-4');

-- Relacionamentos entre proprietários e aplicações
INSERT INTO owner_applications (owner_id, application_id, relationship_type) VALUES
('owner-1', 'app-1', 'owner'),
('owner-1', 'app-4', 'developer'),
('owner-2', 'app-3', 'owner'),
('owner-3', 'app-2', 'owner'),
('owner-4', 'app-4', 'owner');