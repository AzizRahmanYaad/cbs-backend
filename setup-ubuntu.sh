#!/bin/bash

echo "=========================================="
echo "CBS Backend - Ubuntu Setup Script"
echo "Java 17 + PostgreSQL + Environment Setup"
echo "=========================================="
echo ""

# Check if running with sudo for apt commands
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  This script needs sudo privileges for installing packages."
    echo "Please run: sudo bash setup-ubuntu.sh"
    exit 1
fi

# Step 1: Update system
echo "📦 Step 1: Updating system packages..."
apt update

# Step 2: Install Java 17
echo ""
echo "☕ Step 2: Installing Java 17..."
apt install openjdk-17-jdk openjdk-17-jre -y

# Verify Java installation
echo ""
echo "✅ Java version installed:"
java -version

# Step 3: Install PostgreSQL (if not already installed)
echo ""
echo "🗄️  Step 3: Checking PostgreSQL installation..."
if ! command -v psql &> /dev/null; then
    echo "Installing PostgreSQL..."
    apt install postgresql postgresql-contrib -y
    systemctl start postgresql
    systemctl enable postgresql
    echo "✅ PostgreSQL installed and started"
else
    echo "✅ PostgreSQL already installed"
fi

# Step 4: Set JAVA_HOME
echo ""
echo "🔧 Step 4: Setting up JAVA_HOME..."
JAVA_HOME_PATH="/usr/lib/jvm/java-17-openjdk-amd64"

# Add to current user's bashrc (get the actual user who called sudo)
ACTUAL_USER=${SUDO_USER:-$USER}
USER_HOME=$(eval echo ~$ACTUAL_USER)

if ! grep -q "JAVA_HOME" "$USER_HOME/.bashrc"; then
    echo "export JAVA_HOME=$JAVA_HOME_PATH" >> "$USER_HOME/.bashrc"
    echo "export PATH=\$JAVA_HOME/bin:\$PATH" >> "$USER_HOME/.bashrc"
    echo "✅ JAVA_HOME added to .bashrc"
else
    echo "✅ JAVA_HOME already configured in .bashrc"
fi

export JAVA_HOME=$JAVA_HOME_PATH
export PATH=$JAVA_HOME/bin:$PATH

echo ""
echo "=========================================="
echo "✅ Installation Complete!"
echo "=========================================="
echo ""
echo "📋 Next Steps:"
echo "1. Reload your shell: source ~/.bashrc"
echo "2. Create PostgreSQL database:"
echo "   sudo -u postgres psql -c \"CREATE DATABASE cbs_dashboard;\""
echo "   sudo -u postgres psql -c \"CREATE ROLE cbs_admin WITH LOGIN PASSWORD 'YourSecurePassword123!';\""
echo "   sudo -u postgres psql -c \"GRANT ALL PRIVILEGES ON DATABASE cbs_dashboard TO cbs_admin;\""
echo ""
echo "3. Create .env file in your project directory with:"
echo "   PGHOST=localhost"
echo "   PGPORT=5432"
echo "   PGDATABASE=cbs_dashboard"
echo "   PGUSER=cbs_admin"
echo "   PGPASSWORD=YourSecurePassword123!"
echo "   JWT_SECRET=/vuIfdilF+tC6M0m5gypJHByFvZEucr2IGbdj2MiKvTu1miScRQh1N6GCgD0Ifs0ukUvPkMpoklumL0zU5hJ4g=="
echo ""
echo "4. Run the application:"
echo "   cd ~/cbs-backend"
echo "   export \$(grep -v '^#' .env | grep -v '^\$' | xargs)"
echo "   ./gradlew bootRun"
echo ""
echo "=========================================="
