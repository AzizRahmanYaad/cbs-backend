# CBS Backend - Ubuntu Setup Guide

Complete guide for setting up the CBS Dashboard Backend on Ubuntu VM with Java 17, PostgreSQL, and all dependencies.

---

## 🚀 Quick Start (Automated)

### Option 1: One-Command Setup

```bash
# Clone the repository
git clone https://github.com/AzizRahmanYaad/cbs-backend.git
cd cbs-backend

# Run setup script (installs Java 17, PostgreSQL)
sudo bash setup-ubuntu.sh

# Run database setup
bash setup-database.sh

# Create .env file
cp .env.example .env

# Load environment variables and run
source ~/.bashrc
export $(grep -v '^#' .env | grep -v '^$' | xargs)
./gradlew bootRun
```

---

## 📋 Manual Setup (Step by Step)

### Step 1: Install Java 17

```bash
sudo apt update
sudo apt install openjdk-17-jdk openjdk-17-jre -y
java -version  # Should show: openjdk version "17.0.x"
```

### Step 2: Set JAVA_HOME

```bash
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$JAVA_HOME/bin:$PATH

# Make permanent
echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64' >> ~/.bashrc
echo 'export PATH=$JAVA_HOME/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### Step 3: Install PostgreSQL

```bash
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql
sudo systemctl status postgresql
```

### Step 4: Create Database and User

```bash
sudo -u postgres psql
```

Inside PostgreSQL:

```sql
-- Create database
CREATE DATABASE cbs_dashboard;

-- Create user
CREATE ROLE cbs_admin WITH LOGIN PASSWORD 'YourSecurePassword123!';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE cbs_dashboard TO cbs_admin;

-- Connect to database
\c cbs_dashboard

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO cbs_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO cbs_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO cbs_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO cbs_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO cbs_admin;
ALTER DATABASE cbs_dashboard OWNER TO cbs_admin;

-- Exit
\q
```

### Step 5: Create .env File

```bash
cd ~/cbs-backend
nano .env
```

Paste this content (no comments):

```
PGHOST=localhost
PGPORT=5432
PGDATABASE=cbs_dashboard
PGUSER=cbs_admin
PGPASSWORD=YourSecurePassword123!
JWT_SECRET=/vuIfdilF+tC6M0m5gypJHByFvZEucr2IGbdj2MiKvTu1miScRQh1N6GCgD0Ifs0ukUvPkMpoklumL0zU5hJ4g==
```

Save: `Ctrl+X`, then `Y`, then `Enter`

### Step 6: Run the Application

```bash
# Load environment variables
export $(grep -v '^#' .env | grep -v '^$' | xargs)

# Make gradlew executable
chmod +x gradlew

# Run the application
./gradlew bootRun
```

---

## ✅ Verify Installation

### Test Database Connection

```bash
psql -h localhost -U cbs_admin -d cbs_dashboard
# Enter password: YourSecurePassword123!
```

### Test API Login

Open new terminal:

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

Expected response:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "...",
  "tokenType": "Bearer",
  "expiresIn": 86400000
}
```

---

## 🔧 Configuration

### Default Credentials

- **Admin User:** `admin`
- **Admin Password:** `admin123`

### Server Configuration

- **Port:** 8080
- **Host:** 0.0.0.0
- **Database:** PostgreSQL on localhost:5432

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PGHOST` | PostgreSQL host | localhost |
| `PGPORT` | PostgreSQL port | 5432 |
| `PGDATABASE` | Database name | cbs_dashboard |
| `PGUSER` | Database user | cbs_admin |
| `PGPASSWORD` | Database password | (set in .env) |
| `JWT_SECRET` | JWT signing key | (generated 256-bit key) |

---

## 📚 API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

### Training Module

- `GET /api/training` - List all training modules
- `POST /api/training` - Create new training module
- `GET /api/training/{id}` - Get specific training module
- `PUT /api/training/{id}` - Update training module
- `DELETE /api/training/{id}` - Delete training module

### Daily Reports

- `GET /api/daily-reports` - List all daily reports
- `POST /api/daily-reports` - Create new daily report
- `GET /api/daily-reports/{id}` - Get specific report
- `PUT /api/daily-reports/{id}` - Update report
- `DELETE /api/daily-reports/{id}` - Delete report

### Tasks

- `GET /api/tasks` - List all tasks
- `POST /api/tasks` - Create new task
- `GET /api/tasks/{id}` - Get specific task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

### Drill Tests

- `GET /api/drill-tests` - List all drill tests
- `POST /api/drill-tests` - Create new drill test
- `GET /api/drill-tests/{id}` - Get specific drill test
- `PUT /api/drill-tests/{id}` - Update drill test
- `DELETE /api/drill-tests/{id}` - Delete drill test

---

## 🗄️ Database Schema

Flyway migrations automatically create:

- `users` - User accounts
- `roles` - User roles (ADMIN, MANAGER, USER, etc.)
- `permissions` - Fine-grained permissions
- `user_roles` - User-role mapping
- `role_permissions` - Role-permission mapping
- `refresh_tokens` - JWT refresh tokens
- `audit_log` - System audit trail
- `training_modules` - Training content
- `daily_reports` - Daily reporting data
- `tasks` - Task management
- `drill_tests` - Drill test records

---

## 🛠️ Troubleshooting

### Gradle Build Fails

```bash
# Check Java version
java -version  # Should be 17.0.x

# Check JAVA_HOME
echo $JAVA_HOME  # Should be /usr/lib/jvm/java-17-openjdk-amd64
```

### Database Connection Failed

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -h localhost -U cbs_admin -d cbs_dashboard

# Check environment variables
echo $PGDATABASE
echo $PGUSER
```

### Port 8080 Already in Use

```bash
# Find process using port 8080
sudo lsof -i :8080

# Kill process
sudo kill -9 <PID>
```

---

## 📊 System Requirements

- **OS:** Ubuntu 20.04+ or compatible Linux
- **Java:** OpenJDK 17
- **Database:** PostgreSQL 12+
- **Memory:** 2GB+ RAM recommended
- **Disk:** 500MB+ free space

---

## 🔐 Security Notes

1. **Change default passwords** in production
2. **Generate new JWT secret** for production
3. **Use HTTPS** in production
4. **Set strong database password**
5. **Never commit .env file** to Git

---

## 📞 Support

For issues or questions:
- Check logs: `./gradlew bootRun --info`
- Database logs: `sudo tail -f /var/log/postgresql/postgresql-*.log`
- GitHub: https://github.com/AzizRahmanYaad/cbs-backend

---

**Version:** 1.0.0  
**Last Updated:** 2025-01-15
