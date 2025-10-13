-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS enterprise_architect CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE enterprise_architect;

-- Tabela de Proprietários (Owners)
CREATE TABLE IF NOT EXISTS owners (
    id VARCHAR(36) PRIMARY KEY,
    matricula VARCHAR(50) NOT NULL UNIQUE,
    nome VARCHAR(255) NOT NULL,
    area VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Tecnologias
CREATE TABLE IF NOT EXISTS technologies (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    maturity_level ENUM('EXPERIMENTAL', 'EMERGING', 'MAINSTREAM', 'LEGACY') DEFAULT 'MAINSTREAM',
    adoption_score INT DEFAULT 0,
    strategic_fit ENUM('MUITO_RUIM', 'RUIM', 'ADEQUADO', 'BOM', 'EXCELENTE'),
    version VARCHAR(50),
    vendor VARCHAR(255),
    license_type VARCHAR(100),
    support_level VARCHAR(100),
    deployment_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Capacidades de Negócio
CREATE TABLE IF NOT EXISTS capabilities (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    criticality ENUM('BAIXA', 'MÉDIA', 'ALTA', 'CRÍTICA') DEFAULT 'MÉDIA',
    coverage_score INT DEFAULT 0,
    parent_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES capabilities(id) ON DELETE SET NULL
);

-- Tabela de Processos
CREATE TABLE IF NOT EXISTS processes (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    criticality ENUM('BAIXA', 'MÉDIA', 'ALTA', 'CRÍTICA') DEFAULT 'MÉDIA',
    efficiency_score INT DEFAULT 0,
    automation_level ENUM('MANUAL', 'SEMI_AUTOMATIZADO', 'AUTOMATIZADO') DEFAULT 'MANUAL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Aplicações
CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    lifecycle_phase ENUM('PLANEJAMENTO', 'DESENVOLVIMENTO', 'PRODUCAO', 'MANUTENCAO', 'DESATIVACAO', 'APOSENTADO') DEFAULT 'PRODUCAO',
    criticality ENUM('BAIXA', 'MEDIA', 'ALTA', 'CRITICA') DEFAULT 'MEDIA',
    hosting_type ENUM('ON_PREMISE', 'NUVEM_PRIVADA', 'NUVEM_PUBLICA', 'HIBRIDO', 'SAAS'),
    health_score INT DEFAULT 85,
    technical_fit ENUM('MUITO_RUIM', 'RUIM', 'ADEQUADO', 'BOM', 'EXCELENTE'),
    functional_fit ENUM('MUITO_RUIM', 'RUIM', 'ADEQUADO', 'BOM', 'EXCELENTE'),
    estimated_cost DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'BRL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Contratos
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

-- Tabela de Interfaces
CREATE TABLE IF NOT EXISTS interfaces (
    id VARCHAR(36) PRIMARY KEY,
    source_app VARCHAR(255) NOT NULL,
    target_app VARCHAR(255) NOT NULL,
    interface_type ENUM('API_REST', 'API_SOAP', 'ARQUIVO_BATCH', 'MENSAGERIA', 'BANCO_DADOS', 'WEBHOOK') DEFAULT 'API_REST',
    frequency ENUM('TEMPO_REAL', 'HORARIO', 'DIARIO', 'SEMANAL', 'MENSAL', 'SOB_DEMANDA') DEFAULT 'DIARIO',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabelas de relacionamentos (Many-to-Many)

-- Relacionamento entre Aplicações e Capacidades
CREATE TABLE IF NOT EXISTS application_capabilities (
    application_id VARCHAR(36),
    capability_id VARCHAR(36),
    PRIMARY KEY (application_id, capability_id),
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (capability_id) REFERENCES capabilities(id) ON DELETE CASCADE
);

-- Relacionamento entre Aplicações e Processos
CREATE TABLE IF NOT EXISTS application_processes (
    application_id VARCHAR(36),
    process_id VARCHAR(36),
    PRIMARY KEY (application_id, process_id),
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (process_id) REFERENCES processes(id) ON DELETE CASCADE
);

-- Relacionamento entre Aplicações e Tecnologias
CREATE TABLE IF NOT EXISTS application_technologies (
    application_id VARCHAR(36),
    technology_id VARCHAR(36),
    PRIMARY KEY (application_id, technology_id),
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (technology_id) REFERENCES technologies(id) ON DELETE CASCADE
);

-- Relacionamento entre Aplicações (aplicações relacionadas)
CREATE TABLE IF NOT EXISTS application_relationships (
    application_id VARCHAR(36),
    related_application_id VARCHAR(36),
    relationship_type ENUM('DEPENDS_ON', 'INTEGRATES_WITH', 'REPLACES', 'IS_REPLACED_BY') DEFAULT 'INTEGRATES_WITH',
    PRIMARY KEY (application_id, related_application_id),
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,
    FOREIGN KEY (related_application_id) REFERENCES applications(id) ON DELETE CASCADE
);

-- Relacionamento de proprietários (owners) com aplicações
CREATE TABLE IF NOT EXISTS owner_applications (
    owner_id VARCHAR(36),
    application_id VARCHAR(36),
    relationship_type ENUM('owner', 'developer') DEFAULT 'owner',
    PRIMARY KEY (owner_id, application_id),
    FOREIGN KEY (owner_id) REFERENCES owners(id) ON DELETE CASCADE,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

-- Tabela de Habilidades (Skills)
CREATE TABLE IF NOT EXISTS skills (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    guidance_notes TEXT,
    level_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Tecnologias associadas a Habilidades
CREATE TABLE IF NOT EXISTS skill_technologies (
    id VARCHAR(36) PRIMARY KEY,
    skill_id VARCHAR(36) NOT NULL,
    technology_id VARCHAR(36) NOT NULL,
    proficiency_level INT NOT NULL DEFAULT 0 CHECK (proficiency_level BETWEEN 0 AND 5),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    FOREIGN KEY (technology_id) REFERENCES technologies(id) ON DELETE CASCADE,
    UNIQUE KEY unique_skill_technology (skill_id, technology_id)
);

-- Tabela de Desenvolvedores associados a Habilidades
CREATE TABLE IF NOT EXISTS skill_developers (
    id VARCHAR(36) PRIMARY KEY,
    skill_id VARCHAR(36) NOT NULL,
    owner_id VARCHAR(36) NOT NULL,
    proficiency_level INT NOT NULL DEFAULT 0 CHECK (proficiency_level BETWEEN 0 AND 5),
    certification_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    FOREIGN KEY (owner_id) REFERENCES owners(id) ON DELETE CASCADE,
    UNIQUE KEY unique_skill_developer (skill_id, owner_id)
);

-- Índices para performance
CREATE INDEX idx_applications_lifecycle ON applications(lifecycle_phase);
CREATE INDEX idx_applications_criticality ON applications(criticality);
CREATE INDEX idx_capabilities_criticality ON capabilities(criticality);
CREATE INDEX idx_processes_criticality ON processes(criticality);
CREATE INDEX idx_technologies_category ON technologies(category);
CREATE INDEX idx_owners_area ON owners(area);
CREATE INDEX idx_contracts_application ON contracts(application_id);
CREATE INDEX idx_contracts_dates ON contracts(contract_start_date, contract_end_date);
CREATE INDEX idx_skills_code ON skills(code);
CREATE INDEX idx_skill_technologies_skill ON skill_technologies(skill_id);
CREATE INDEX idx_skill_technologies_technology ON skill_technologies(technology_id);
CREATE INDEX idx_skill_developers_skill ON skill_developers(skill_id);
CREATE INDEX idx_skill_developers_owner ON skill_developers(owner_id);
CREATE INDEX idx_skill_developers_level ON skill_developers(proficiency_level);