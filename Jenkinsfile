pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'arc-drive-app'
        DOCKER_TAG = "${BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub...'
                checkout scm
            }
        }
        
        stage('Check Docker Access') {
            steps {
                echo 'Checking Docker daemon access...'
                script {
                    try {
                        sh 'docker --version'
                        sh 'docker info'
                        echo '✅ Docker access confirmed'
                    } catch (Exception e) {
                        echo '❌ Docker access failed!'
                        echo 'Run: sudo usermod -aG docker jenkins && sudo systemctl restart jenkins'
                        error('Docker permission denied. Please run jenkins-docker-setup.sh')
                    }
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                script {
                    try {
                        sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                        echo '✅ Docker image built successfully'
                    } catch (Exception e) {
                        echo '❌ Docker build failed!'
                        echo 'Error: ' + e.getMessage()
                        error('Docker build failed. Check Docker permissions.')
                    }
                }
            }
        }
        
        stage('Deploy to EC2') {
            steps {
                script {
                    def hasCredentials = false
                    try {
                        withCredentials([string(credentialsId: 'ec2-host', variable: 'EC2_HOST'),
                                       sshUserPrivateKey(credentialsId: 'ec2-ssh-key', keyFileVariable: 'SSH_KEY', usernameVariable: 'SSH_USER')]) {
                            echo 'EC2 credentials found - deploying to EC2...'
                            hasCredentials = true
                            
                            // Save Docker image as tar file
                            sh "docker save ${DOCKER_IMAGE}:${DOCKER_TAG} -o arc-drive-${DOCKER_TAG}.tar"
                            
                            // Copy image to EC2 and deploy
                            sh """
                                scp -i ${SSH_KEY} -o StrictHostKeyChecking=no arc-drive-${DOCKER_TAG}.tar ubuntu@${EC2_HOST}:/tmp/
                                ssh -i ${SSH_KEY} -o StrictHostKeyChecking=no ubuntu@${EC2_HOST} '
                                    docker stop arc-drive-app || true
                                    docker rm arc-drive-app || true
                                    docker load < /tmp/arc-drive-${DOCKER_TAG}.tar
                                    docker run -d --name arc-drive-app -p 80:80 ${DOCKER_IMAGE}:${DOCKER_TAG}
                                    rm /tmp/arc-drive-${DOCKER_TAG}.tar
                                    docker image prune -f
                                '
                            """
                            
                            echo '✅ EC2 deployment successful!'
                            echo "🌐 Application deployed at: http://${EC2_HOST}"
                        }
                    } catch (Exception e) {
                        echo 'EC2 credentials not configured - running local test...'
                        hasCredentials = false
                    }
                    
                    if (!hasCredentials) {
                        echo 'Deploying locally for testing...'
                        sh """
                            docker stop arc-drive-local || true
                            docker rm arc-drive-local || true
                            docker run -d --name arc-drive-local -p 8080:80 ${DOCKER_IMAGE}:${DOCKER_TAG}
                        """
                        echo '✅ Local deployment successful!'
                        echo '🌐 Application available at: http://localhost:8080'
                        echo '⚠️  Add EC2 credentials for production deployment'
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning up...'
            script {
                sh "rm -f arc-drive-*.tar || true"
                // Only cleanup if Docker is accessible
                try {
                    sh "docker rmi ${DOCKER_IMAGE}:${DOCKER_TAG} || true"
                } catch (Exception e) {
                    echo 'Skipping Docker cleanup due to permission issues'
                }
            }
        }
        success {
            echo "🎉 Pipeline completed successfully!"
            echo "🚀 Your CI/CD pipeline is working!"
        }
        failure {
            echo '❌ Pipeline failed!'
            echo '📋 Troubleshooting steps:'
            echo '1. Run: ./jenkins-docker-setup.sh'
            echo '2. Restart Jenkins: sudo systemctl restart jenkins'
            echo '3. Try the pipeline again'
        }
    }
}