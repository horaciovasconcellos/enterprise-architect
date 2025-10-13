#!/usr/bin/env tsx

/**
 * CSV Import Tool
 * 
 * Importa dados de arquivos CSV para a API do Enterprise Architect
 * 
 * Uso:
 *   npm run import:csv <tipo> <arquivo.csv>
 * 
 * Tipos suportados:
 *   - owners
 *   - technologies
 *   - applications
 *   - capabilities
 *   - skills
 * 
 * Exemplos:
 *   npm run import:csv owners data/owners.csv
 *   npm run import:csv technologies data/technologies.csv
 *   npm run import:csv skills data/skills.csv
 */

import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

interface ImportResult {
  success: number;
  failed: number;
  errors: Array<{ row: number; error: string; data: any }>;
}

/**
 * Faz requisição HTTP para a API
 */
async function apiRequest(endpoint: string, method: string, data?: any) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  return response.json();
}

/**
 * Lê arquivo CSV e retorna array de objetos
 */
function readCSV(filePath: string): any[] {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true, // Suporta UTF-8 BOM
  });

  return records;
}

/**
 * Importa Proprietários (Owners)
 */
async function importOwners(records: any[]): Promise<ImportResult> {
  const result: ImportResult = { success: 0, failed: 0, errors: [] };

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    
    try {
      const owner = {
        name: record.name || record.Nome,
        email: record.email || record.Email,
        role: record.role || record.Cargo || 'Developer',
        department: record.department || record.Departamento || 'Engineering',
      };

      await apiRequest('/owners', 'POST', owner);
      result.success++;
      console.log(`✅ [${i + 1}/${records.length}] Owner criado: ${owner.name}`);
    } catch (error: any) {
      result.failed++;
      result.errors.push({
        row: i + 1,
        error: error.message,
        data: record,
      });
      console.error(`❌ [${i + 1}/${records.length}] Erro: ${error.message}`);
    }
  }

  return result;
}

/**
 * Importa Tecnologias
 */
async function importTechnologies(records: any[]): Promise<ImportResult> {
  const result: ImportResult = { success: 0, failed: 0, errors: [] };

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    
    try {
      const technology = {
        name: record.name || record.Nome,
        version: record.version || record.Versao || '',
        category: record.category || record.Categoria || 'Other',
        description: record.description || record.Descricao || '',
        vendor: record.vendor || record.Fornecedor || '',
        licenseType: record.licenseType || record.TipoLicenca || 'Open Source',
        supportLevel: record.supportLevel || record.NivelSuporte || 'Community',
      };

      await apiRequest('/technologies', 'POST', technology);
      result.success++;
      console.log(`✅ [${i + 1}/${records.length}] Tecnologia criada: ${technology.name} ${technology.version}`);
    } catch (error: any) {
      result.failed++;
      result.errors.push({
        row: i + 1,
        error: error.message,
        data: record,
      });
      console.error(`❌ [${i + 1}/${records.length}] Erro: ${error.message}`);
    }
  }

  return result;
}

/**
 * Importa Aplicações
 */
async function importApplications(records: any[]): Promise<ImportResult> {
  const result: ImportResult = { success: 0, failed: 0, errors: [] };

  // Buscar owners e technologies para mapear IDs
  const owners = await apiRequest('/owners', 'GET');
  const technologies = await apiRequest('/technologies', 'GET');

  const ownerMap = new Map(owners.map((o: any) => [o.name.toLowerCase(), o.id]));
  const techMap = new Map(technologies.map((t: any) => [`${t.name} ${t.version}`.toLowerCase(), t.id]));

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    
    try {
      const ownerName = record.owner || record.Proprietario || '';
      const ownerId = ownerMap.get(ownerName.toLowerCase());

      if (!ownerId && ownerName) {
        throw new Error(`Owner não encontrado: ${ownerName}`);
      }

      const application = {
        name: record.name || record.Nome,
        description: record.description || record.Descricao || '',
        status: record.status || record.Status || 'Active',
        criticality: record.criticality || record.Criticidade || 'Medium',
        ownerId: ownerId || null,
        technologies: [],
      };

      // Processar tecnologias (formato: "Node.js 20|PostgreSQL 15")
      const techString = record.technologies || record.Tecnologias || '';
      if (techString) {
        const techNames = techString.split('|').map((t: string) => t.trim());
        for (const techName of techNames) {
          const techId = techMap.get(techName.toLowerCase());
          if (techId) {
            application.technologies.push({
              technologyId: techId,
              version: '',
              environment: 'Production',
            });
          }
        }
      }

      await apiRequest('/applications', 'POST', application);
      result.success++;
      console.log(`✅ [${i + 1}/${records.length}] Aplicação criada: ${application.name}`);
    } catch (error: any) {
      result.failed++;
      result.errors.push({
        row: i + 1,
        error: error.message,
        data: record,
      });
      console.error(`❌ [${i + 1}/${records.length}] Erro: ${error.message}`);
    }
  }

  return result;
}

/**
 * Importa Capacidades
 */
async function importCapabilities(records: any[]): Promise<ImportResult> {
  const result: ImportResult = { success: 0, failed: 0, errors: [] };

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    
    try {
      const capability = {
        name: record.name || record.Nome,
        description: record.description || record.Descricao || '',
        category: record.category || record.Categoria || 'Business',
        maturityLevel: parseInt(record.maturityLevel || record.NivelMaturidade || '1'),
        strategicImportance: record.strategicImportance || record.ImportanciaEstrategica || 'Medium',
      };

      await apiRequest('/capabilities', 'POST', capability);
      result.success++;
      console.log(`✅ [${i + 1}/${records.length}] Capacidade criada: ${capability.name}`);
    } catch (error: any) {
      result.failed++;
      result.errors.push({
        row: i + 1,
        error: error.message,
        data: record,
      });
      console.error(`❌ [${i + 1}/${records.length}] Erro: ${error.message}`);
    }
  }

  return result;
}

/**
 * Importa Habilidades
 */
async function importSkills(records: any[]): Promise<ImportResult> {
  const result: ImportResult = { success: 0, failed: 0, errors: [] };

  // Buscar owners e technologies para mapear IDs
  const owners = await apiRequest('/owners', 'GET');
  const technologies = await apiRequest('/technologies', 'GET');

  const ownerMap = new Map(owners.map((o: any) => [o.name.toLowerCase(), o.id]));
  const techMap = new Map(technologies.map((t: any) => [`${t.name} ${t.version}`.toLowerCase(), t.id]));

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    
    try {
      const skill = {
        name: record.name || record.Nome,
        code: record.code || record.Codigo,
        description: record.description || record.Descricao || '',
        guidanceNotes: record.guidanceNotes || record.NotasOrientacao || '',
        levelDescription: record.levelDescription || record.DescricaoNivel || '',
        technologies: [],
        developers: [],
      };

      // Processar tecnologias (formato: "Node.js 20:4:2024-01-01|PostgreSQL 15:3:2024-02-01")
      const techString = record.technologies || record.Tecnologias || '';
      if (techString) {
        const techEntries = techString.split('|').map((t: string) => t.trim());
        for (const entry of techEntries) {
          const [techName, level, startDate] = entry.split(':');
          const techId = techMap.get(techName.toLowerCase());
          if (techId) {
            (skill.technologies as any[]).push({
              technologyId: techId,
              proficiencyLevel: parseInt(level || '3'),
              startDate: startDate || new Date().toISOString().split('T')[0],
              endDate: null,
            });
          }
        }
      }

      // Processar desenvolvedores (formato: "João Silva:5:2024-06-01|Maria Santos:4:2024-07-01")
      const devString = record.developers || record.Desenvolvedores || '';
      if (devString) {
        const devEntries = devString.split('|').map((d: string) => d.trim());
        for (const entry of devEntries) {
          const [devName, level, certDate, notes] = entry.split(':');
          const ownerId = ownerMap.get(devName.toLowerCase());
          if (ownerId) {
            (skill.developers as any[]).push({
              ownerId: ownerId,
              proficiencyLevel: parseInt(level || '3'),
              certificationDate: certDate || new Date().toISOString().split('T')[0],
              notes: notes || '',
            });
          }
        }
      }

      await apiRequest('/skills', 'POST', skill);
      result.success++;
      console.log(`✅ [${i + 1}/${records.length}] Habilidade criada: ${skill.name}`);
    } catch (error: any) {
      result.failed++;
      result.errors.push({
        row: i + 1,
        error: error.message,
        data: record,
      });
      console.error(`❌ [${i + 1}/${records.length}] Erro: ${error.message}`);
    }
  }

  return result;
}

/**
 * Função principal
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.error(`
❌ Uso incorreto!

Sintaxe:
  npm run import:csv <tipo> <arquivo.csv>

Tipos suportados:
  owners          - Proprietários/Desenvolvedores
  technologies    - Tecnologias
  applications    - Aplicações
  capabilities    - Capacidades de Negócio
  skills          - Habilidades Técnicas

Exemplos:
  npm run import:csv owners data/owners.csv
  npm run import:csv technologies data/technologies.csv
  npm run import:csv applications data/applications.csv
  npm run import:csv capabilities data/capabilities.csv
  npm run import:csv skills data/skills.csv

Variável de ambiente:
  API_BASE_URL    - URL base da API (padrão: http://localhost:3000/api)
    `);
    process.exit(1);
  }

  const [type, filePath] = args;

  // Verificar se arquivo existe
  if (!fs.existsSync(filePath)) {
    console.error(`❌ Arquivo não encontrado: ${filePath}`);
    process.exit(1);
  }

  console.log(`\n📁 Lendo arquivo: ${filePath}`);
  console.log(`🔗 API: ${API_BASE_URL}`);
  console.log(`📊 Tipo: ${type}\n`);

  const records = readCSV(filePath);
  console.log(`✅ ${records.length} registros encontrados\n`);

  let result: ImportResult;

  const startTime = Date.now();

  switch (type.toLowerCase()) {
    case 'owners':
      result = await importOwners(records);
      break;
    case 'technologies':
      result = await importTechnologies(records);
      break;
    case 'applications':
      result = await importApplications(records);
      break;
    case 'capabilities':
      result = await importCapabilities(records);
      break;
    case 'skills':
      result = await importSkills(records);
      break;
    default:
      console.error(`❌ Tipo inválido: ${type}`);
      console.error(`Tipos suportados: owners, technologies, applications, capabilities, skills`);
      process.exit(1);
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 RESULTADO DA IMPORTAÇÃO`);
  console.log(`${'='.repeat(60)}`);
  console.log(`✅ Sucesso: ${result.success}`);
  console.log(`❌ Falhas: ${result.failed}`);
  console.log(`⏱️  Tempo: ${duration}s`);
  console.log(`${'='.repeat(60)}\n`);

  if (result.errors.length > 0) {
    console.log(`\n❌ ERROS DETALHADOS:\n`);
    result.errors.forEach((err) => {
      console.log(`Linha ${err.row}: ${err.error}`);
      console.log(`Dados: ${JSON.stringify(err.data, null, 2)}\n`);
    });
  }

  process.exit(result.failed > 0 ? 1 : 0);
}

// Executar
main().catch((error) => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
