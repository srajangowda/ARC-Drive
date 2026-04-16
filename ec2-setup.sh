#!/bin/bash
# EC2 Setup Script for ARC Drive CI/CD Pipeline

echo "Setting up EC2 instance for Docker deployments..."

# Update system
sudo apt update -y

# Install Docker
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu

# Install Docker Compose (optional)
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Create application directory
mkdir -p /home/ubuntu/app

# Set up firewall rules
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

echo "EC2 setup completed!"
echo "Instance is ready for CI/CD deployments"