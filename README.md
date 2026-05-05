# AgendaFlow

Sistema full stack de agendamento para pequenos negócios, construído com Java, Spring Boot, Angular e PostgreSQL.

## Funcionalidades

- Cadastro e login com JWT.
- CRUD de clientes.
- CRUD de serviços.
- CRUD de agendamentos.
- Cálculo automático do horário final.
- Bloqueio de conflito de horários ativos.
- Painel com resumo operacional.
- Documentação OpenAPI/Swagger.

## Stack

- Backend: Java 17+, Spring Boot, Spring Web, Spring Data JPA, Spring Security, JWT, Bean Validation, Flyway, PostgreSQL.
- Frontend: Angular, TypeScript, Router, Reactive Forms, HTTP Client, interceptor JWT, guard de autenticação.
- Infra: Docker Compose.

## Como rodar

1. Suba o banco:

```bash
docker compose up -d
```

2. Rode o backend:

```bash
cd backend
mvn spring-boot:run
```

3. Rode o frontend:

```bash
cd frontend
npm install
npm start
```

Backend: `http://localhost:8080`
Swagger: `http://localhost:8080/swagger-ui.html`
Frontend: `http://localhost:4200`

## Configuração

O backend usa PostgreSQL local por padrão:

- Banco: `agendaflow`
- Usuário: `agendaflow`
- Senha: `agendaflow`

Em produção, defina `JWT_SECRET` com valor forte.

Para desenvolvimento local, copie `.env.example` para `.env` e exporte as variáveis antes de iniciar o backend.

## Endpoints principais

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/clients`
- `POST /api/clients`
- `GET /api/services`
- `POST /api/services`
- `GET /api/appointments`
- `POST /api/appointments`
- `PATCH /api/appointments/{id}/cancel`
- `PATCH /api/appointments/{id}/done`
- `GET /api/dashboard/summary`

## Regra de conflito de horário

Ao criar ou editar agendamento, a API calcula o fim usando a duração do serviço e bloqueia sobreposição ativa:

```text
novoInicio < existenteFim && novoFim > existenteInicio
```

Agendamentos cancelados não bloqueiam horário.

## Credenciais de teste

Crie pelo formulário de cadastro ou via `POST /api/auth/register`.

## Próximos passos

- Testes automatizados.
- Paginação e ordenação.
- Calendário visual.
- Refresh token.
- Deploy backend e frontend.
