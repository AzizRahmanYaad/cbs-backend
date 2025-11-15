#!/bin/bash

echo "=========================================="
echo "CBS Backend - Database Setup Script"
echo "=========================================="
echo ""

# Database configuration
DB_NAME="cbs_dashboard"
DB_USER="cbs_admin"
DB_PASSWORD="YourSecurePassword123!"

echo "📋 This script will create:"
echo "  - Database: $DB_NAME"
echo "  - User: $DB_USER"
echo "  - Password: $DB_PASSWORD"
echo ""
read -p "Continue? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Setup cancelled"
    exit 1
fi

echo ""
echo "🗄️  Creating database and user..."

# Run PostgreSQL commands
sudo -u postgres psql << EOF
-- Create database
CREATE DATABASE $DB_NAME;

-- Create user
CREATE ROLE $DB_USER WITH LOGIN PASSWORD '$DB_PASSWORD';

-- Grant privileges on database
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;

-- Connect to database and grant schema privileges
\c $DB_NAME

GRANT ALL ON SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;

-- Make user owner of database
ALTER DATABASE $DB_NAME OWNER TO $DB_USER;

-- List databases and users to verify
\l
\du

EOF

echo ""
echo "=========================================="
echo "✅ Database Setup Complete!"
echo "=========================================="
echo ""
echo "📋 Database Details:"
echo "  Host: localhost"
echo "  Port: 5432"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo "  Password: $DB_PASSWORD"
echo ""
echo "🧪 Test connection:"
echo "  psql -h localhost -U $DB_USER -d $DB_NAME"
echo ""
echo "=========================================="
