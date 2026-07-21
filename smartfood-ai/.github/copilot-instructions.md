# SmartFood AI - Copilot Instructions

This file contains workspace-specific instructions for GitHub Copilot to help with SmartFood AI development.

## Project Overview

SmartFood AI is a full-stack food redistribution platform with:
- **Backend**: Spring Boot 3.x REST API with WebSocket support
- **Frontend**: React 18+ with TypeScript
- **Database**: PostgreSQL + Redis
- **Architecture**: Microservices ready with Docker support

## Key Technologies

- Java 17+ (Backend)
- Spring Boot 3.x (REST, WebSocket, Security)
- React 18+ with TypeScript (Frontend)
- PostgreSQL 13+ (Database)
- Redis 6+ (Caching)
- JWT Authentication
- Tailwind CSS (Styling)

## Module Structure

### Backend (`/backend`)
- `src/main/java/com/smartfood/` - Application code
  - `config/` - Spring configurations
  - `controller/` - REST endpoints
  - `service/` - Business logic
  - `repository/` - Data access
  - `entity/` - JPA entities
  - `dto/` - Data transfer objects
  - `exception/` - Custom exceptions
  - `util/` - Utility classes
  - `websocket/` - Real-time features
- `src/main/resources/` - Configuration and migrations
- `src/test/` - Unit and integration tests

### Frontend (`/frontend`)
- `src/components/` - React components
- `src/pages/` - Page components
- `src/redux/` - State management
- `src/services/` - API clients
- `src/hooks/` - Custom React hooks
- `src/types/` - TypeScript types
- `src/styles/` - Tailwind CSS classes
- `src/__tests__/` - Test files

## Development Guidelines

### Code Style
- **Backend**: Follow Google Java Style Guide
- **Frontend**: Use ESLint and Prettier configurations
- **Naming**: Use camelCase for variables, PascalCase for classes/components

### API Conventions
- REST endpoints follow: `/api/v1/{resource}/{id}/{action}`
- Use HTTP status codes appropriately
- Return JSON responses with consistent structure: `{ success, data, error }`

### Component Structure (React)
- Functional components with hooks
- Props validation with TypeScript
- Separation: containers (pages) vs presentational components

### Database
- Use JPA entities with proper annotations
- Implement soft deletes for audit trails
- Use migrations for schema changes

### Authentication
- JWT tokens stored securely
- Role-based access control (RBAC)
- Token refresh mechanism

## Common Tasks

### Running the Project
- Backend: `mvn spring-boot:run` (from `/backend`)
- Frontend: `npm start` (from `/frontend`)
- All services: `docker-compose up --build`

### Database
- Migrations: Use Flyway in `/backend/src/main/resources/db/migration`
- Schema updates: Create new migration files with timestamp naming

### Testing
- Backend: JUnit 5 tests in `/backend/src/test`
- Frontend: Jest tests in `/frontend/src/__tests__`

### API Documentation
- Swagger UI available at `http://localhost:8080/swagger-ui.html`
- OpenAPI spec at `http://localhost:8080/v3/api-docs`

## Conventions

### Error Handling
- Use custom exceptions extending RuntimeException
- Return standard error responses
- Log errors appropriately

### Validation
- Use Bean Validation annotations (@NotNull, @Email, etc.)
- Implement custom validators for complex logic
- Frontend form validation before submission

### Performance
- Use Redis cache for frequently accessed data
- Implement pagination for large datasets
- Use indexes on high-query columns

## Feature Development Checklist

When adding a new feature:
- [ ] Create JPA entity and repository
- [ ] Create DTO for API requests/responses
- [ ] Implement service logic with business rules
- [ ] Create REST controller with proper endpoints
- [ ] Write unit tests (80%+ coverage target)
- [ ] Create React component/page
- [ ] Implement API service integration
- [ ] Add state management (Redux if needed)
- [ ] Update API documentation
- [ ] Test end-to-end flow

## Important URLs

- API Documentation: http://localhost:8080/swagger-ui.html
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api
- PostgreSQL: localhost:5432
- Redis: localhost:6379

## Debugging

- Backend: Enable debug logs in `application.properties`
- Frontend: Use React DevTools extension
- Database: Use pgAdmin or DBeaver for SQL debugging
- All services: Check Docker logs with `docker-compose logs -f`
