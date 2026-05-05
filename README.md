# AgendaFlow

Sistema full stack de agendamento para pequenos negocios, construido com Java, Spring Boot, Angular e PostgreSQL.

## Funcionalidades

- Cadastro e login com JWT.
- CRUD de clientes.
- CRUD de servicos.
- CRUD de agendamentos.
- Calculo automatico do horario final.
- Bloqueio de conflito de horarios ativos.
- Dashboard com resumo operacional.
- Documentacao OpenAPI/Swagger.

## Stack

- Backend: Java 17+, Spring Boot, Spring Web, Spring Data JPA, Spring Security, JWT, Bean Validation, Flyway, PostgreSQL.
- Frontend: Angular, TypeScript, Router, Reactive Forms, HTTP Client, interceptor JWT, auth guard.
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

## Configuracao

O backend usa PostgreSQL local por padrao:

- Database: `agendaflow`
- User: `agendaflow`
- Password: `agendaflow`

Em producao, defina `JWT_SECRET` com valor forte.

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

## Regra de conflito de horario

Ao criar ou editar agendamento, a API calcula o fim usando a duracao do servico e bloqueia sobreposicao ativa:

```text
novoInicio < existenteFim && novoFim > existenteInicio
```

Agendamentos cancelados nao bloqueiam horario.

## Credenciais de teste

Crie pelo formulario de cadastro ou via `POST /api/auth/register`.

## Proximos passos

- Testes automatizados.
- Paginacao e ordenacao.
- Calendario visual.
- Refresh token.
- Deploy backend e frontend.

