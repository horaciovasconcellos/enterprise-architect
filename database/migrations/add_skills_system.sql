-- Migration: Add Skills System
-- Data: 2025-10-13
-- Descrição: Adiciona tabelas para sistema de habilidades (Skills) com associação a desenvolvedores e tecnologias

USE enterprise_architect;

-- Tabela de Habilidades (Skills)
CREATE TABLE IF NOT EXISTS skills (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    guidance_notes TEXT COMMENT 'Notas de orientação sobre a habilidade',
    level_description TEXT COMMENT 'Descrição dos níveis de proficiência',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Habilidades/Skills do sistema';

-- Tabela de Tecnologias associadas a Habilidades
CREATE TABLE IF NOT EXISTS skill_technologies (
    id VARCHAR(36) PRIMARY KEY,
    skill_id VARCHAR(36) NOT NULL,
    technology_id VARCHAR(36) NOT NULL,
    proficiency_level INT NOT NULL DEFAULT 0 CHECK (proficiency_level BETWEEN 0 AND 5) COMMENT '0=Sem conhecimento, 1=Superficial, 2=Fundamentado, 3=Relacional, 4=Crítico, 5=Amplo',
    start_date DATE COMMENT 'Data de início do conhecimento',
    end_date DATE COMMENT 'Data de término/validade',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    FOREIGN KEY (technology_id) REFERENCES technologies(id) ON DELETE CASCADE,
    UNIQUE KEY unique_skill_technology (skill_id, technology_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Tecnologias associadas às habilidades';

-- Tabela de Desenvolvedores associados a Habilidades
CREATE TABLE IF NOT EXISTS skill_developers (
    id VARCHAR(36) PRIMARY KEY,
    skill_id VARCHAR(36) NOT NULL,
    owner_id VARCHAR(36) NOT NULL COMMENT 'Referência ao desenvolvedor (owner)',
    proficiency_level INT NOT NULL DEFAULT 0 CHECK (proficiency_level BETWEEN 0 AND 5) COMMENT '0=Sem conhecimento, 1=Superficial, 2=Fundamentado, 3=Relacional, 4=Crítico, 5=Amplo',
    certification_date DATE COMMENT 'Data de certificação/validação',
    notes TEXT COMMENT 'Notas adicionais sobre a proficiência',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (skill_id) REFERENCES skills(id) ON DELETE CASCADE,
    FOREIGN KEY (owner_id) REFERENCES owners(id) ON DELETE CASCADE,
    UNIQUE KEY unique_skill_developer (skill_id, owner_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Desenvolvedores associados às habilidades';

-- Criar índices para performance
CREATE INDEX idx_skills_code ON skills(code);
CREATE INDEX idx_skill_technologies_skill ON skill_technologies(skill_id);
CREATE INDEX idx_skill_technologies_technology ON skill_technologies(technology_id);
CREATE INDEX idx_skill_technologies_level ON skill_technologies(proficiency_level);
CREATE INDEX idx_skill_developers_skill ON skill_developers(skill_id);
CREATE INDEX idx_skill_developers_owner ON skill_developers(owner_id);
CREATE INDEX idx_skill_developers_level ON skill_developers(proficiency_level);

-- Inserir dados de exemplo
INSERT INTO skills (id, name, code, description, guidance_notes, level_description) VALUES
(UUID(), 'Desenvolvimento Backend', 'DEV-BACK-001', 'Desenvolvimento de aplicações server-side', 'Conhecimento em APIs REST, bancos de dados, e arquitetura de backend', 'Nível 0: Sem conhecimento\nNível 1: Conhecimento superficial\nNível 2: Conhecimento fundamentado\nNível 3: Conhecimento relacional\nNível 4: Conhecimento crítico\nNível 5: Conhecimento amplo e profundo'),
(UUID(), 'Desenvolvimento Frontend', 'DEV-FRONT-001', 'Desenvolvimento de interfaces web', 'Conhecimento em frameworks JavaScript, HTML, CSS, e UX', 'Nível 0: Sem conhecimento\nNível 1: Conhecimento superficial\nNível 2: Conhecimento fundamentado\nNível 3: Conhecimento relacional\nNível 4: Conhecimento crítico\nNível 5: Conhecimento amplo e profundo'),
(UUID(), 'DevOps e Cloud', 'DEV-OPS-001', 'Infraestrutura e automação', 'CI/CD, containers, orquestração, e cloud computing', 'Nível 0: Sem conhecimento\nNível 1: Conhecimento superficial\nNível 2: Conhecimento fundamentado\nNível 3: Conhecimento relacional\nNível 4: Conhecimento crítico\nNível 5: Conhecimento amplo e profundo');

SELECT 'Migration completed successfully!' as status;
