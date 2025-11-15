# CBS Unified Dashboard - Spring Boot Backend

## Project Overview
A comprehensive unified dashboard for the CBS team with SSO authentication and multiple modules for training, daily reporting, task management, and drill tests.

## Current Status
**Phase 1 Complete**: Authentication & Authorization Infrastructure  
- Spring Boot 3.5.7 application  
- PostgreSQL database with Flyway migrations  
- JWT-based authentication with refresh tokens  
- Role-Based Access Control (RBAC)  
- Secure REST API endpoints  

## Technology Stack

### Backend
- **Framework**: Spring Boot 3.5.7
- **Build Tool**: Gradle 8.14.3
- **Language**: Java 19 (GraalVM)
- **Database**: PostgreSQL (Replit/Neon)
- **Security**: Spring Security + JWT
- **API Documentation**: OpenAPI/Swagger
- **Database Migrations**: Flyway

### Frontend
- **Framework**: Angular 20.3.0
- **Build Tool**: Vite (via @angular/build)
- **Language**: TypeScript 5.9.2
- **UI**: Standalone Components with Custom Modal System
- **Styling**: SCSS with Gradient Themes

## Architecture

### Package Structure
```
com.cbs/
├── auth/              # Authentication module
│   ├── controller/    # REST endpoints
│   ├── dto/          # Data transfer objects
│   ├── entity/       # JPA entities
│   ├── repository/   # Data access layer
│   └── service/      # Business logic
├── security/         # Security configuration
│   ├── filter/       # JWT authentication filter
│   └── service/      # Security services
├── config/           # Application configuration
├── exception/        # Global exception handling
├── common/           # Shared utilities and DTOs
└── modules/         # Business modules
    ├── training/    # Training management
    ├── dailyreport/ # Daily reporting
    ├── task/        # Task management
    └── drilltest/   # Drill test management
```

### Database Schema
- **Users & Authentication**: users, roles, permissions, refresh_tokens
- **Audit**: audit_log (tracks all critical actions)
- **Task Management**: task_projects, tasks, task_comments, task_attachments
- **Daily Reporting**: report_templates, daily_reports, report_metrics
- **Drill Tests**: drill_types, drill_schedules, drill_participants, drill_results
- **Training**: training_courses, training_sessions, training_enrollments, training_assessments, training_materials

## API Endpoints

### Authentication (Public)
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token

### Authentication (Protected)
- `POST /api/auth/logout` - User logout

### Documentation
- `/swagger-ui/index.html` - Interactive API documentation
- `/v3/api-docs` - OpenAPI JSON specification

### Health Check
- `/actuator/health` - Application health status

## Default Credentials
**Username**: admin  
**Password**: admin123  
**Role**: ROLE_ADMIN (full system access)

**Available Roles**: ROLE_ADMIN, ROLE_MANAGER, ROLE_USER, ROLE_TRAINING_ADMIN, ROLE_REPORT_ADMIN, ROLE_TASK_ADMIN, ROLE_DRILL_ADMIN

## Configuration

### Application Settings
Located in `src/main/resources/application.properties`

**Server**:
- Port: 8080
- Address: 0.0.0.0 (binds to all interfaces)

**Database**:
- Connection via environment variables (PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD)
- Hikari connection pool (2-10 connections)
- Flyway migrations enabled

**Security**:
- JWT expiration: 24 hours (86400000 ms)
- Refresh token expiration: 7 days (604800000 ms)
- CORS configured for Replit domains

## Development Workflow

### Building
```bash
./gradlew clean build
```

### Running
```bash
./gradlew bootRun
```

### Testing
```bash
./gradlew test
```

### Database Migrations
Migrations run automatically on startup. Located in `src/main/resources/db/migration/`

## Security Features
✅ JWT-based stateless authentication  
✅ Refresh token rotation  
✅ Role-Based Access Control (RBAC)  
✅ Account status validation (active/locked checks)  
✅ Secure password hashing (BCrypt)  
✅ Protected actuator endpoints  
✅ CORS configuration for trusted origins  
✅ Centralized exception handling  
✅ Audit logging for critical actions  

## Next Steps
1. Implement Task Management API endpoints
2. Implement Daily Reporting API endpoints
3. Implement Drill Test API endpoints
4. Implement Training API endpoints
5. Add comprehensive unit and integration tests
6. Set up deployment configuration

## Testing with Postman (From Your Ubuntu VM)

### Accessing the API
The Spring Boot API is running on Replit and accessible via the public URL.
- **Local Port**: 8080 (inside Replit container)
- **Public URL**: Check the Replit webview for the actual URL
- You'll access the API from your Ubuntu VM using the public Replit URL, NOT localhost

### Example API Calls

**1. Login**
```bash
POST https://[replit-url]/api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**2. Access Protected Endpoint**
```bash
GET https://[replit-url]/api/tasks
Authorization: Bearer [your-jwt-token]
```

**3. Refresh Token**
```bash
POST https://[replit-url]/api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "[your-refresh-token]"
}
```

## Recent Changes
- **2025-11-15**: Angular 20 Frontend Vite configuration for Replit hosting
  - Created `cbs-frontend/vite.config.ts` to allow dynamic Replit hostnames
  - Configured `server.host: true` to bind dev server to 0.0.0.0
  - Set up HMR over WSS (protocol: 'wss', clientPort: 443) for Replit webview
  - Both workflows running: Angular Frontend (port 5000), Spring Boot Backend (port 8080)
  - Application accessible via Replit public URL

- **2025-11-15**: Security configuration fixes and port optimization
  - Removed conflicting Spring Security default user configuration
  - Simplified authorization rules to use `.authenticated()` for all protected endpoints
  - Kept port 8080 for Replit compatibility (user accesses via public URL from Ubuntu VM)
  - Fixed role authority alignment issues
  - Application compiles and starts successfully

- **2025-11-15**: Initial project setup and authentication infrastructure
  - Created database schema with Flyway migrations
  - Implemented JWT authentication with refresh tokens
  - Configured Spring Security with RBAC
  - Added global exception handling
  - Fixed security vulnerabilities (actuator exposure, token rotation, account validation)

## Notes
- The application uses Java 19 (GraalVM 22.3) instead of Java 21 due to Replit environment constraints
- Database connection may sleep after 5 minutes of inactivity (Neon behavior)
- All endpoints except login/refresh require JWT authentication
- Swagger UI accessible at http://localhost:8080/swagger-ui/index.html
