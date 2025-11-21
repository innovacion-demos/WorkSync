# mic_issues - Issues Management Microservice

Spring Boot-based microservice for issue tracking and management. Provides RESTful API endpoints, real-time WebSocket updates, and PostgreSQL persistence for the WorkSync platform.

## Overview

mic_issues is the core backend service of the WorkSync platform, responsible for:

- Issue CRUD operations (Create, Read, Update, Delete)
- Real-time WebSocket notifications via STOMP
- PostgreSQL database persistence with JPA/Hibernate
- RESTful API for frontend and MCP integration

## Technology Stack

- **Framework**: Spring Boot 3.5.7
- **Language**: Java 25
- **Database**: PostgreSQL
- **ORM**: Spring Data JPA / Hibernate
- **WebSocket**: Spring WebSocket with STOMP
- **Build Tool**: Maven
- **Architecture**: Layered architecture with domain-driven design

### Key Dependencies

- **spring-boot-starter-web**: RESTful web services
- **spring-boot-starter-data-jpa**: Database access and ORM
- **spring-boot-starter-websocket**: WebSocket support
- **postgresql**: PostgreSQL JDBC driver

## Architecture

```
src/main/java/org/caixabanktech/mic_issues/
├── MicIssuesApplication.java    # Spring Boot entry point
│
├── domain/                       # Domain entities and models
│   ├── Issue.java
│   ├── IssueStatus.java
│   └── ...
│
├── application/                  # Business logic and use cases
│   ├── services/
│   │   ├── IssueService.java
│   │   └── IssueServiceImpl.java
│   └── mappers/
│       └── IssueMapper.java
│
└── infrastructure/               # External adapters
    ├── controllers/
    │   ├── IssueController.java
    │   └── HealthController.java
    ├── repositories/
    │   └── IssueRepository.java
    └── config/
        ├── WebSocketConfig.java
        └── CorsConfig.java
```

### Layer Responsibilities

- **Domain**: Core business entities and value objects
- **Application**: Business logic, use cases, and services
- **Infrastructure**: Controllers, repositories, configuration

## Features

### 1. Issue Management

Complete CRUD operations for issue tracking:

- Create new issues
- List all issues with filtering
- Get issue details by ID
- Update issue information and status
- Delete issues
- Assign issues to users
- Track issue status (OPEN, IN_PROGRESS, DONE)

### 2. Real-time Updates

WebSocket-based real-time notifications:

- Broadcast issue creation events
- Notify on issue updates
- Push status changes
- Live collaboration support

### 3. RESTful API

Comprehensive REST API for all operations:

- Standard HTTP methods (GET, POST, PUT, DELETE)
- JSON request/response format
- Proper HTTP status codes
- CORS support for frontend integration

### 4. Database Persistence

Reliable PostgreSQL storage:

- JPA/Hibernate ORM
- Entity relationships
- Transaction management
- Connection pooling

## Getting Started

### Prerequisites

- **Java Development Kit (JDK)**: Version 25
- **Maven**: 3.6+ (or use included Maven wrapper)
- **PostgreSQL**: 12+ installed and running
- **IDE**: IntelliJ IDEA, Eclipse, or VS Code (recommended)

### Database Setup

1. **Install PostgreSQL** (if not already installed)

2. **Create database**:
```sql
CREATE DATABASE worksync;
```

3. **Create database user** (optional):
```sql
CREATE USER worksync_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE worksync TO worksync_user;
```

### Configuration

Edit `src/main/resources/application.properties`:

```properties
# Server Configuration
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/worksync
spring.datasource.username=worksync_user
spring.datasource.password=your_password
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.format_sql=true

# WebSocket Configuration
spring.websocket.allowed-origins=http://localhost:5173

# Logging
logging.level.org.caixabanktech.mic_issues=DEBUG
logging.level.org.springframework.web=INFO
```

### Running the Application

#### Using Maven Wrapper (Recommended)

```bash
# Navigate to project directory
cd backend/mic_issues

# Run the application
./mvnw spring-boot:run

# On Windows
mvnw.cmd spring-boot:run
```

#### Using Installed Maven

```bash
mvn spring-boot:run
```

#### Using IDE

1. Import project as Maven project
2. Locate `MicIssuesApplication.java`
3. Run as Java Application

The service will start on `http://localhost:8080`

### Building

```bash
# Build JAR file
./mvnw clean package

# Skip tests during build
./mvnw clean package -DskipTests

# Run the JAR
java -jar target/mic_issues-0.0.1-SNAPSHOT.jar
```

## API Documentation

### Base URL

```
http://localhost:8080/api
```

### Endpoints

#### Create Issue

**POST** `/api/issues`

Create a new issue.

**Request Body**:
```json
{
  "title": "Fix login bug",
  "description": "Users cannot login with special characters in password",
  "status": "OPEN",
  "assigneeId": null
}
```

**Response** (201 Created):
```json
{
  "id": 1,
  "title": "Fix login bug",
  "description": "Users cannot login with special characters in password",
  "status": "OPEN",
  "assigneeId": null,
  "createdAt": "2024-01-20T10:30:00Z",
  "updatedAt": "2024-01-20T10:30:00Z"
}
```

**cURL Example**:
```bash
curl -X POST http://localhost:8080/api/issues \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Fix login bug",
    "description": "Users cannot login with special characters",
    "status": "OPEN"
  }'
```

#### List Issues

**GET** `/api/issues`

Get all issues.

**Query Parameters**:
- `status` (optional): Filter by status (OPEN, IN_PROGRESS, DONE)
- `assigneeId` (optional): Filter by assignee

**Response** (200 OK):
```json
[
  {
    "id": 1,
    "title": "Fix login bug",
    "description": "Users cannot login...",
    "status": "OPEN",
    "assigneeId": null,
    "createdAt": "2024-01-20T10:30:00Z",
    "updatedAt": "2024-01-20T10:30:00Z"
  },
  {
    "id": 2,
    "title": "Add dark mode",
    "description": "Implement dark mode...",
    "status": "IN_PROGRESS",
    "assigneeId": 5,
    "createdAt": "2024-01-20T11:00:00Z",
    "updatedAt": "2024-01-20T12:00:00Z"
  }
]
```

**cURL Example**:
```bash
# Get all issues
curl http://localhost:8080/api/issues

# Filter by status
curl "http://localhost:8080/api/issues?status=OPEN"
```

#### Get Issue by ID

**GET** `/api/issues/{id}`

Get specific issue details.

**Response** (200 OK):
```json
{
  "id": 1,
  "title": "Fix login bug",
  "description": "Users cannot login with special characters",
  "status": "OPEN",
  "assigneeId": null,
  "createdAt": "2024-01-20T10:30:00Z",
  "updatedAt": "2024-01-20T10:30:00Z"
}
```

**cURL Example**:
```bash
curl http://localhost:8080/api/issues/1
```

#### Update Issue

**PUT** `/api/issues/{id}`

Update an existing issue.

**Request Body**:
```json
{
  "title": "Fix login bug - URGENT",
  "description": "Users cannot login with special characters - high priority",
  "status": "IN_PROGRESS",
  "assigneeId": 5
}
```

**Response** (200 OK):
```json
{
  "id": 1,
  "title": "Fix login bug - URGENT",
  "description": "Users cannot login with special characters - high priority",
  "status": "IN_PROGRESS",
  "assigneeId": 5,
  "createdAt": "2024-01-20T10:30:00Z",
  "updatedAt": "2024-01-20T14:00:00Z"
}
```

**cURL Example**:
```bash
curl -X PUT http://localhost:8080/api/issues/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "IN_PROGRESS",
    "assigneeId": 5
  }'
```

#### Delete Issue

**DELETE** `/api/issues/{id}`

Delete an issue.

**Response** (204 No Content)

**cURL Example**:
```bash
curl -X DELETE http://localhost:8080/api/issues/1
```

#### Health Check

**GET** `/health`

Check service health.

**Response** (200 OK):
```json
{
  "status": "UP",
  "service": "mic_issues"
}
```

## WebSocket Integration

### Connection

The service provides WebSocket endpoints for real-time updates using STOMP protocol.

**Endpoint**: `ws://localhost:8080/ws`

### Subscribe to Issue Updates

**Topic**: `/topic/issues`

**Message Format**:
```json
{
  "type": "ISSUE_CREATED | ISSUE_UPDATED | ISSUE_DELETED",
  "issue": {
    "id": 1,
    "title": "Issue title",
    "status": "OPEN",
    ...
  }
}
```

### JavaScript Client Example

```javascript
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const client = new Client({
  webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
  onConnect: () => {
    console.log('Connected to WebSocket');

    // Subscribe to issue updates
    client.subscribe('/topic/issues', (message) => {
      const update = JSON.parse(message.body);
      console.log('Issue update:', update);

      // Handle update in your UI
      handleIssueUpdate(update);
    });
  },
  onStompError: (frame) => {
    console.error('STOMP error:', frame);
  }
});

client.activate();
```

## Development

### Project Structure

```
backend/mic_issues/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── org/caixabanktech/mic_issues/
│   │   │       ├── MicIssuesApplication.java
│   │   │       ├── domain/
│   │   │       ├── application/
│   │   │       └── infrastructure/
│   │   └── resources/
│   │       ├── application.properties
│   │       └── static/
│   └── test/
│       └── java/
│           └── org/caixabanktech/mic_issues/
│
├── pom.xml
├── mvnw
├── mvnw.cmd
└── README.md
```

### Adding New Features

1. **Define domain entity** in `domain/`
2. **Create repository** in `infrastructure/repositories/`
3. **Implement service** in `application/services/`
4. **Create controller** in `infrastructure/controllers/`
5. **Write tests** in `src/test/`

### Running Tests

```bash
# Run all tests
./mvnw test

# Run specific test class
./mvnw test -Dtest=IssueServiceTest

# Run with coverage
./mvnw test jacoco:report
```

### Code Style

Follow Java standard conventions:
- Use meaningful variable and method names
- Keep methods short and focused
- Write comprehensive Javadoc comments
- Follow Spring Boot best practices

## Deployment

### Docker

Create `Dockerfile`:

```dockerfile
FROM eclipse-temurin:25-jdk-alpine

WORKDIR /app

# Copy Maven wrapper and pom.xml
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies
RUN ./mvnw dependency:go-offline

# Copy source code
COPY src src

# Build application
RUN ./mvnw package -DskipTests

# Run application
CMD ["java", "-jar", "target/mic_issues-0.0.1-SNAPSHOT.jar"]
```

Build and run:

```bash
docker build -t mic-issues .
docker run -p 8080:8080 --env-file .env mic-issues
```

### Docker Compose

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: worksync
      POSTGRES_USER: worksync_user
      POSTGRES_PASSWORD: your_password
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data

  mic-issues:
    build: .
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/worksync
      SPRING_DATASOURCE_USERNAME: worksync_user
      SPRING_DATASOURCE_PASSWORD: your_password
    depends_on:
      - postgres

volumes:
  postgres-data:
```

Run with:
```bash
docker-compose up
```

### Production Considerations

- Use environment variables for configuration
- Enable HTTPS/TLS
- Implement authentication and authorization
- Set up monitoring and logging
- Use connection pooling
- Configure proper CORS policies
- Set up health checks and actuator endpoints
- Use production database credentials

## Troubleshooting

### Common Issues

**Application won't start - Port already in use**
```bash
# Change port in application.properties
server.port=8081
```

**Database connection fails**
- Verify PostgreSQL is running: `pg_isready`
- Check database credentials in application.properties
- Ensure database exists: `psql -l`
- Check network connectivity to database

**WebSocket connection fails**
- Verify allowed origins in WebSocketConfig
- Check CORS configuration
- Ensure frontend URL is whitelisted

**Build fails**
```bash
# Clean and rebuild
./mvnw clean install

# Update dependencies
./mvnw dependency:purge-local-repository
```

**Tests fail**
- Check test database configuration
- Ensure test data is properly set up
- Verify all test dependencies are available

## Monitoring

### Actuator Endpoints

Add Spring Boot Actuator for monitoring:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

**Endpoints**:
- `/actuator/health` - Health status
- `/actuator/metrics` - Application metrics
- `/actuator/info` - Application information

## Contributing

1. Follow Spring Boot conventions
2. Write unit and integration tests
3. Update Javadoc comments
4. Follow the project architecture
5. Use meaningful commit messages
6. Test WebSocket functionality

## Learn More

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- [Spring WebSocket](https://docs.spring.io/spring-framework/reference/web/websocket.html)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Maven Guide](https://maven.apache.org/guides/)

---

**Built with Spring Boot 3.5.7 and Java 25 for reliable issue tracking**