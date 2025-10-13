.PHONY: help build sign verify push clean install-cosign generate-keys

# Configurações
IMAGE_NAME := enterprise-architect
IMAGE_TAG := latest
REGISTRY := ghcr.io/horaciovasconcellos
FULL_IMAGE := $(REGISTRY)/$(IMAGE_NAME):$(IMAGE_TAG)

# Cores
GREEN := \033[0;32m
YELLOW := \033[1;33m
BLUE := \033[0;34m
NC := \033[0m # No Color

help: ## Mostra esta mensagem de ajuda
	@echo "$(BLUE)╔════════════════════════════════════════════════╗$(NC)"
	@echo "$(BLUE)║  Enterprise Architect - Makefile Commands     ║$(NC)"
	@echo "$(BLUE)╚════════════════════════════════════════════════╝$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "$(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'
	@echo ""
	@echo "$(BLUE)Exemplos:$(NC)"
	@echo "  make build              # Build da imagem"
	@echo "  make sign               # Assinar imagem"
	@echo "  make verify             # Verificar assinatura"
	@echo "  make build-and-sign     # Build + assinatura"
	@echo ""

install-cosign: ## Instala o Cosign
	@echo "$(BLUE)📦 Instalando Cosign...$(NC)"
	@if command -v brew >/dev/null 2>&1; then \
		brew install cosign; \
	else \
		echo "$(YELLOW)Homebrew não encontrado. Instale manualmente:$(NC)"; \
		echo "https://docs.sigstore.dev/cosign/installation/"; \
	fi

generate-keys: ## Gera par de chaves Cosign
	@echo "$(BLUE)🔑 Gerando par de chaves Cosign...$(NC)"
	@if [ -f "cosign.key" ]; then \
		echo "$(YELLOW)⚠️  cosign.key já existe!$(NC)"; \
		read -p "Sobrescrever? (s/N): " confirm; \
		if [ "$$confirm" != "s" ] && [ "$$confirm" != "S" ]; then \
			echo "$(YELLOW)Operação cancelada.$(NC)"; \
			exit 1; \
		fi; \
	fi
	@cosign generate-key-pair
	@if ! grep -q "cosign.key" .gitignore 2>/dev/null; then \
		echo "cosign.key" >> .gitignore; \
		echo "$(GREEN)✅ cosign.key adicionado ao .gitignore$(NC)"; \
	fi
	@echo "$(GREEN)✅ Chaves geradas com sucesso!$(NC)"

build: ## Build da imagem Docker
	@echo "$(BLUE)🔨 Building Docker image...$(NC)"
	@docker build \
		-t $(IMAGE_NAME):$(IMAGE_TAG) \
		-t $(IMAGE_NAME):latest \
		-t $(FULL_IMAGE) \
		.
	@echo "$(GREEN)✅ Build concluído!$(NC)"

build-no-cache: ## Build da imagem sem cache
	@echo "$(BLUE)🔨 Building Docker image (no cache)...$(NC)"
	@docker build --no-cache \
		-t $(IMAGE_NAME):$(IMAGE_TAG) \
		-t $(IMAGE_NAME):latest \
		-t $(FULL_IMAGE) \
		.
	@echo "$(GREEN)✅ Build concluído!$(NC)"

sign: ## Assina a imagem com Cosign
	@echo "$(BLUE)🔐 Assinando imagem...$(NC)"
	@if [ -f "cosign.key" ]; then \
		cosign sign --key cosign.key $(IMAGE_NAME):$(IMAGE_TAG); \
	else \
		echo "$(YELLOW)Usando keyless signing (OIDC)...$(NC)"; \
		cosign sign --yes $(IMAGE_NAME):$(IMAGE_TAG); \
	fi
	@echo "$(GREEN)✅ Imagem assinada!$(NC)"

verify: ## Verifica a assinatura da imagem
	@echo "$(BLUE)🔍 Verificando assinatura...$(NC)"
	@chmod +x verify-signature.sh
	@./verify-signature.sh $(IMAGE_NAME):$(IMAGE_TAG)

tree: ## Mostra árvore de assinaturas
	@echo "$(BLUE)🌳 Árvore de assinaturas:$(NC)"
	@cosign tree $(IMAGE_NAME):$(IMAGE_TAG)

build-and-sign: build sign ## Build e assina a imagem
	@echo "$(GREEN)✅ Build e assinatura concluídos!$(NC)"

push: ## Push da imagem para registry
	@echo "$(BLUE)📤 Pushing image to registry...$(NC)"
	@docker push $(FULL_IMAGE)
	@echo "$(GREEN)✅ Push concluído!$(NC)"

run: ## Executa o container localmente
	@echo "$(BLUE)🚀 Iniciando container...$(NC)"
	@docker run -d \
		-p 5000:5000 \
		--name $(IMAGE_NAME) \
		-e DB_HOST=host.docker.internal \
		-e DB_PORT=3306 \
		-e DB_NAME=enterprise_architect \
		-e DB_USER=ea_user \
		-e DB_PASSWORD=ea_password \
		$(IMAGE_NAME):$(IMAGE_TAG)
	@echo "$(GREEN)✅ Container iniciado!$(NC)"
	@echo "$(BLUE)Acesse: http://localhost:5000$(NC)"

stop: ## Para o container
	@echo "$(BLUE)⏹  Parando container...$(NC)"
	@docker stop $(IMAGE_NAME) || true
	@docker rm $(IMAGE_NAME) || true
	@echo "$(GREEN)✅ Container parado!$(NC)"

logs: ## Mostra logs do container
	@docker logs -f $(IMAGE_NAME)

shell: ## Acessa shell do container
	@docker exec -it $(IMAGE_NAME) sh

docker-compose-up: ## Sobe aplicação com docker-compose
	@echo "$(BLUE)🚀 Subindo aplicação com docker-compose...$(NC)"
	@docker-compose up -d
	@echo "$(GREEN)✅ Aplicação iniciada!$(NC)"

docker-compose-down: ## Para aplicação do docker-compose
	@echo "$(BLUE)⏹  Parando aplicação...$(NC)"
	@docker-compose down
	@echo "$(GREEN)✅ Aplicação parada!$(NC)"

docker-compose-logs: ## Mostra logs do docker-compose
	@docker-compose logs -f

clean: ## Remove imagens e containers
	@echo "$(BLUE)🧹 Limpando...$(NC)"
	@docker stop $(IMAGE_NAME) 2>/dev/null || true
	@docker rm $(IMAGE_NAME) 2>/dev/null || true
	@docker rmi $(IMAGE_NAME):$(IMAGE_TAG) 2>/dev/null || true
	@docker rmi $(IMAGE_NAME):latest 2>/dev/null || true
	@docker rmi $(FULL_IMAGE) 2>/dev/null || true
	@echo "$(GREEN)✅ Limpeza concluída!$(NC)"

clean-all: clean ## Remove tudo incluindo volumes
	@echo "$(BLUE)🧹 Limpeza completa...$(NC)"
	@docker-compose down -v 2>/dev/null || true
	@docker system prune -f
	@echo "$(GREEN)✅ Limpeza completa concluída!$(NC)"

test-verify: build sign verify ## Build, assina e verifica (teste completo)
	@echo "$(GREEN)✅ Teste completo concluído!$(NC)"

sbom: ## Gera SBOM da imagem
	@echo "$(BLUE)📊 Gerando SBOM...$(NC)"
	@if ! command -v syft >/dev/null 2>&1; then \
		echo "$(YELLOW)Syft não instalado. Instale com: brew install syft$(NC)"; \
		exit 1; \
	fi
	@syft $(IMAGE_NAME):$(IMAGE_TAG) -o spdx-json > sbom.spdx.json
	@echo "$(GREEN)✅ SBOM gerado: sbom.spdx.json$(NC)"

scan: ## Escaneia vulnerabilidades
	@echo "$(BLUE)🔍 Escaneando vulnerabilidades...$(NC)"
	@if ! command -v trivy >/dev/null 2>&1; then \
		echo "$(YELLOW)Trivy não instalado. Instale com: brew install trivy$(NC)"; \
		exit 1; \
	fi
	@trivy image $(IMAGE_NAME):$(IMAGE_TAG)

scan-critical: ## Escaneia apenas vulnerabilidades críticas
	@echo "$(BLUE)🔍 Escaneando vulnerabilidades CRÍTICAS...$(NC)"
	@trivy image --severity CRITICAL,HIGH $(IMAGE_NAME):$(IMAGE_TAG)

info: ## Mostra informações da imagem
	@echo "$(BLUE)📊 Informações da imagem:$(NC)"
	@docker images $(IMAGE_NAME)
	@echo ""
	@docker inspect $(IMAGE_NAME):$(IMAGE_TAG) | jq '.[0] | {Id, Created, Size, Architecture}'

status: ## Status dos containers
	@echo "$(BLUE)📊 Status dos containers:$(NC)"
	@docker ps -a | grep -E "(CONTAINER|$(IMAGE_NAME))" || echo "Nenhum container encontrado"
	@echo ""
	@echo "$(BLUE)📊 Status do docker-compose:$(NC)"
	@docker-compose ps || echo "Docker-compose não está rodando"

benchmark: ## Benchmark da imagem
	@echo "$(BLUE)⚡ Executando benchmark...$(NC)"
	@docker run --rm $(IMAGE_NAME):$(IMAGE_TAG) node -e "console.time('startup'); require('./server.ts'); console.timeEnd('startup')" || echo "Erro no benchmark"

dev: ## Ambiente de desenvolvimento
	@echo "$(BLUE)🔧 Iniciando ambiente de desenvolvimento...$(NC)"
	@npm run dev:full
