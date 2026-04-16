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
        
        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image...'
                script {
                    sh "docker build -t ${DOCKER_IMAGE}:${DOCKER_TAG} ."
                }
            }
        }
        
        stage('Deploy to EC2') {
            when {
                expression {
                    try {
                        env.EC2_HOST = credentials('ec2-host')
                        env.EC2_SSH_KEY = credentials('ec2-ssh-key')
                        return true
                    } catch (Exception e) {
                        echo "EC2 credentials not found: ${e.message}"
                        return false
                    }
                }
            }
            environment {
                EC2_HOST = credentials('ec2-host')
                SSH_KEY = credentials('ec2-ssh-key')
            }
            steps {
                echo 'Deploying to EC2...'
                script {
                    // Save Docker image as tar file
                    sh "docker save ${DOCKER_IMAGE}:${DOCKER_TAG} -o arc-drive-${DOCKER_TAG}.tar"
                    
                    // Copy image to EC2 and deploy
                    sshagent([env.SSH_KEY]) {
                        sh """
                            scp -o StrictHostKeyChecking=no arc-drive-${DOCKER_TAG}.tar ubuntu@${env.EC2_HOST}:/tmp/
                            ssh -o StrictHostKeyChecking=no ubuntu@${env.EC2_HOST} '
                                docker stop arc-drive-app || true
                                docker rm arc-drive-app || true
                                docker load < /tmp/arc-drive-${DOCKER_TAG}.tar
                                docker run -d --name arc-drive-app -p 80:80 ${DOCKER_IMAGE}:${DOCKER_TAG}
                                rm /tmp/arc-drive-${DOCKER_TAG}.tar
                                docker image prune -f
                            '
                        """
                    }
                }
            }
        }
        
        stage('Local Test Deploy') {
            when {
                expression {
                    try {
                        credentials('ec2-host')
                        credentials('ec2-ssh-key')
                        return false
                    } catch (Exception e) {
                        return true
                    }
                }
            }
            steps {
                echo 'EC2 credentials not configured - running local test...'
                script {
                    sh """
                        docker stop arc-drive-local || true
                        docker rm arc-drive-local || true
                        docker run -d --name arc-drive-local -p 8080:80 ${DOCKER_IMAGE}:${DOCKER_TAG}
                    """
                }
                echo 'Local test deployment completed at http://localhost:8080'
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning up...'
            script {
                sh "rm -f arc-drive-*.tar || true"
                sh "docker rmi ${DOCKER_IMAGE}:${DOCKER_TAG} || true"
            }
        }
        success {
            script {
                try {
                    def ec2Host = credentials('ec2-host')
                    echo "✅ Pipeline completed successfully!"
                    echo "Application deployed at: http://${ec2Host}"
                } catch (Exception e) {
                    echo "✅ Pipeline completed successfully!"
                    echo "Local test available at: http://localhost:8080"
                    echo "⚠️  Configure EC2 credentials for production deployment"
                }
            }
        }
        failure {
            echo '❌ Pipeline failed!'
            echo 'Check the logs above for details'
        }
    }
}