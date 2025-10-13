# Stage 1: Build da aplicação frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --legacy-peer-deps

# Copiar código fonte
COPY . .

# Build da aplicação React/Vite
RUN npm run build

# Stage 2: Imagem de produção
FROM node:20-alpine AS production

WORKDIR /app

# Instalar apenas dependências de produção
COPY package*.json ./
RUN npm ci --only=production --legacy-peer-deps

# Copiar o build do frontend do stage anterior
COPY --from=frontend-builder /app/dist ./dist

# Copiar arquivos necessários para o servidor
COPY server.ts ./
COPY tsconfig.json ./
COPY src ./src
COPY database ./database

# Instalar tsx globalmente para executar TypeScript
RUN npm install -g tsx

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Expor portas (ajuste conforme necessário)
EXPOSE 5000
EXPOSE 5173

# Variáveis de ambiente (podem ser sobrescritas no docker-compose ou docker run)
ENV NODE_ENV=production
ENV PORT=5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Comando para iniciar o servidor
CMD ["tsx", "server.ts"]
