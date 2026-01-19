# API de Controle de Inventário

Esta é uma API robusta para controle de estoque desenvolvida com o framework [NestJS](https://nestjs.com/). O sistema permite o gerenciamento eficiente de produtos, fornecedores, vendas e movimentações de estoque.

## 🚀 Tecnologias Utilizadas

- **Node.js** & **NestJS** (v11)
- **TypeORM** para persistência de dados
- **PostgreSQL** como banco de dados principal
- **Passport.js & JWT** para autenticação segura
- **Docker & Docker Compose** para ambiente de banco de dados
- **Pino** para logging de alto desempenho

## 📦 Funcionalidades Principais

- **Autenticação:** Sistema de registro e login com tokens JWT.
- **Gestão de Produtos:** Cadastro, atualização e listagem de produtos com suporte a filtros e paginação.
- **Gestão de Fornecedores:** Controle completo dos parceiros de fornecimento.
- **Controle de Estoque:** Registro de movimentações de entrada e saída.
- **Vendas:** Processamento de vendas integrado ao estoque.

## 🛠️ Como Rodar a Aplicação

### Pré-requisitos

- [Node.js](https://nodejs.org/) (v20 ou superior)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
- Gerenciador de pacotes NPM (já vem com o Node)

### Passo a Passo

1. **Configurar o ambiente:**
   Copie o arquivo de exemplo de variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```
   *Nota: As configurações padrão no `.env.example` funcionam perfeitamente com o `docker-compose` fornecido.*

2. **Subir o banco de dados:**
   Certifique-se de que o Docker está rodando e execute:
   ```bash
   docker-compose up -d
   ```

3. **Instalar as dependências:**
   ```bash
   npm install
   ```

4. **Iniciar o servidor:**
   ```bash
   # Modo de desenvolvimento (com hot-reload)
   npm run start:dev
   ```

A API estará disponível em `http://localhost:8000`.

## 🧪 Executando Testes

```bash
# Testes unitários
npm run test

# Testes de integração (e2e)
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

---
Desenvolvido como uma solução escalável para controle de estoque.
