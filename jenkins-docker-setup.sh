#!/bin/bash
# Jenkins Setup Script for Docker CI/CD Pipeline

echo "🔧 Setting up Jenkins for Docker CI/CD Pipeline..."

# Add jenkins user to docker group
echo "Adding jenkins user to docker group..."
sudo usermod -aG docker jenkins

# Restart Jenkins to apply group changes
echo "Restarting Jenkins service..."
sudo systemctl restart jenkins

# Wait for Jenkins to start
echo "Waiting for Jenkins to restart..."
sleep 30

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    sudo apt update
    sudo apt install -y docker.io
    sudo systemctl start docker
    sudo systemctl enable docker
fi

# Set proper permissions for Docker socket
echo "Setting Docker socket permissions..."
sudo chmod 666 /var/run/docker.sock

echo "✅ Jenkins Docker setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Restart your Jenkins job"
echo "2. The pipeline should now build Docker images successfully"
echo "3. Add EC2 credentials in Jenkins for production deployment"
echo ""
echo "🔗 Jenkins URL: http://localhost:8080"