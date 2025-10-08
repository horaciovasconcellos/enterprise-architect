# 0002. Escolha do ORM

Date: 2025-10-08

## Status
Aprovado

## Context
O projeto requer uma camada de persistência de dados robusta, segura e produtiva, com integração fluida aos pipelines DevSecOps e compatibilidade com múltiplos bancos relacionais (PostgreSQL, MySQL, SQL Server, SQLite, etc.). Os serviços são majoritariamente desenvolvidos em **Node.js/TypeScript**, com demandas de:

- [X] Mapeamento tipado e seguro entre objetos e tabelas.
- [X] Geração automática de esquemas e migrações.
- [X] Integração com ferramentas de documentação e testes automatizados.
- [X] Suporte a arquitetura **clean** e princípios de **Domain-Driven Design (DDD)**.

###### Alternativas Avaliadas

| Critério                     | **Prisma**                                      | **TypeORM**                                | **SQLAlchemy**                                |
| ---------------------------- | ----------------------------------------------- | ------------------------------------------ | --------------------------------------------- |
| **Linguagem**                | TypeScript / Node.js                            | TypeScript / Node.js                       | Python                                        |
| **Abordagem**                | *Schema-first* (modelo declarativo)             | *Decorator-based* (modelo imperativo)      | *Declarative ORM* (via classes Python)        |
| **Maturidade e Comunidade**  | Alta e crescente                                | Alta, porém em desaceleração               | Muito alta (maduro, mas em outro ecossistema) |
| **Performance**              | Alta (query engine em Rust)                     | Moderada (JS puro)                         | Alta                                          |
| **Type Safety**              | Forte (tipagem gerada a partir do schema)       | Limitada (baseada em decorators e runtime) | Forte (via mypy e pydantic)                   |
| **Migrações**                | Automatizadas e consistentes                    | Menos previsíveis                          | Sólidas (Alembic)                             |
| **Produtividade**            | Alta (autocompletar, validações em build time)  | Média (configuração manual extensa)        | Alta (no ecossistema Python)                  |
| **Integração com DevSecOps** | Excelente (scripts automatizáveis, CI/CD ready) | Boa (requere setup adicional)              | Boa (limitada ao stack Python)                |
| **Curva de Aprendizado**     | Curta                                           | Média                                      | Média                                         |
| **Suporte Multi-banco**      | Sim                                             | Sim                                        | Sim                                           |

###### Análise Detalhada
####### **Prisma**
- [X] **Forças:**
    - [X] Engine de consultas em **Rust**, garantindo alto desempenho.
    - [X] Geração automática de **tipos TypeScript**, eliminando classes manuais.
    - [X] Ferramentas integradas (`prisma migrate`, `prisma studio`) facilitam CI/CD e observabilidade.
    - [X] Excelente compatibilidade com **GraphQL**, **REST**, **NestJS** e **Next.js**.
    - [X] Facilita o princípio **"Clean Core"** — a lógica de domínio não depende do ORM.
- [X] **Fraquezas:**
    - [X] Foco exclusivo em TypeScript (não suporta Python/Java).
    - [X] Menor controle manual sobre SQL bruto (embora possível via `queryRaw`).
####### **TypeORM**
- [X] **Forças:**
    - [X] Baseado em **decorators** familiares a quem usa NestJS.
    - [X] Amplo suporte a bancos e features como lazy loading.
- [X] **Fraquezas:**
    - [X] Problemas de **consistência de migrações** e **sincronização de schema**.
    - [X] Menor performance e **tipagem fraca** (muitas validações ocorrem em runtime).
    - [X] Menor previsibilidade em ambientes com CI/CD automatizado.
####### **SQLAlchemy**
- [X] **Forças:**
    - [X] ORM mais maduro do mercado.
    - [X] Extensível, sólido e com controle total sobre SQL.
    - [X] Integração perfeita com frameworks Python (FastAPI, Flask, Django).
- [X] **Fraquezas:**
    - [X] Requer adoção do stack Python.
    - [X] Menos alinhado com o ecossistema TypeScript e com práticas de tipagem forte no front/back.
###### Decisão
Após análise técnica e estratégica, decidiu-se pela **adoção do Prisma ORM** como padrão para novos serviços baseados em Node.js/TypeScript. A decisão se fundamenta nos seguintes pontos:

- [x] **Produtividade:** O Prisma simplifica o ciclo de desenvolvimento e manutenção.
- [x] **Segurança e qualidade:** Geração de tipos e validações em tempo de build reduzem erros em runtime.
- [x] **DevSecOps:** O modelo declarativo e CLI integrada facilitam integração com pipelines automatizados.
- [x] **Clean Architecture:** Separa domínio e persistência de forma clara, evitando acoplamentos desnecessários.
- [x] **Performance:** Query engine em Rust proporciona ganhos reais de performance e estabilidade.

###### Consequências
####### **Positivas**
- [x] Aumento da produtividade dos times.
- [x] Redução de bugs relacionados a inconsistências de schema.
- [x] Melhoria na integração contínua e automação de deploys.
- [x] Maior aderência à cultura **Clean Core** e **Documentation as Code**.

####### **Negativas**
- [x] Necessidade de treinamento inicial em Prisma CLI e modelagem declarativa.
- [x] Dependência direta do ecossistema Node.js/TypeScript.

###### Plano de Ação
- [x] Criar repositório de referência com **boilerplate Prisma + NestJS + PostgreSQL**.
- [x] Atualizar guidelines de desenvolvimento no repositório `dev-standards`.
- [x] Realizar workshop interno sobre **Prisma ORM** e boas práticas de migração.
- [x] Definir padrões de auditoria e logging a partir do Prisma Client.

###### Referências
- [x] [Prisma ORM Documentation](https://www.prisma.io/docs)
- [x] [TypeORM Documentation](https://typeorm.io)
- [x] [SQLAlchemy Documentation](https://www.sqlalchemy.org)
- [x] [Node.js Clean Architecture Principles](https://khalilstemmler.com/articles/enterprise-typescript-nodejs/clean-architecture/)

**Decisão Final:**
> O Prisma ORM é adotado como o ORM oficial para projetos em Node.js/TypeScript, substituindo o uso de TypeORM em novos desenvolvimentos.


