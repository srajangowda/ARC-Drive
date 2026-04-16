pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'arc-drive-app'
        DOCKER_TAG = "${BUILD_NUMBER}"
        EC2_HOST = credentials('ec2-host')
        EC2_USER = 'ubuntu'
        SSH_KEY = credentials('ec2-ssh-key')
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
                    docker.build("${DOCKER_IMAGE}:${DOCKER_TAG}")
                }
            }
        }
        
        stage('Deploy to EC2') {
            steps {
                echo 'Deploying to EC2...'
                script {
                    // Save Docker image as tar file
                    sh "docker save ${DOCKER_IMAGE}:${DOCKER_TAG} > arc-drive-${DOCKER_TAG}.tar"
                    
                    // Copy image to EC2 and deploy
                    sshagent([SSH_KEY]) {
                        sh """
                            scp -o StrictHostKeyChecking=no arc-drive-${DOCKER_TAG}.tar ${EC2_USER}@${EC2_HOST}:/tmp/
                            ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} '
                                # Stop existing container
                                docker stop arc-drive-app || true
                                docker rm arc-drive-app || true
                                
                                # Load new image
                                docker load < /tmp/arc-drive-${DOCKER_TAG}.tar
                                
                                # Run new container
                                docker run -d --name arc-drive-app -p 80:80 ${DOCKER_IMAGE}:${DOCKER_TAG}
                                
                                # Cleanup
                                rm /tmp/arc-drive-${DOCKER_TAG}.tar
                                docker image prune -f
                            '
                        """
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo 'Cleaning up...'
            sh "rm -f arc-drive-*.tar"
            sh "docker rmi ${DOCKER_IMAGE}:${DOCKER_TAG} || true"
        }
        success {
            echo 'Pipeline completed successfully!'
            echo "Application deployed at: http://${EC2_HOST}"
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}