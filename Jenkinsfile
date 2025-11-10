pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        ansiColor('xterm')
    }

    parameters {
        string(name: 'DOCKERHUB_NAMESPACE', defaultValue: 'chanaka', description: 'Docker Hub username/org')
        string(name: 'REGISTRY_CREDENTIALS_ID', defaultValue: 'c29e8c4d-bd5e-457c-8911-d7805bf37143', description: 'Jenkins credentials for Docker Hub')
        string(name: 'BACKEND_IMAGE', defaultValue: 'task-manager-server', description: 'Backend image name')
        string(name: 'FRONTEND_IMAGE', defaultValue: 'task-manager', description: 'Frontend image name')
        booleanParam(name: 'PUSH_LATEST_ON_MAIN', defaultValue: true, description: 'Also push latest for main/master')
    }

    environment {
        GIT_SHORT_SHA = ''
        SANITIZED_BRANCH = ''
        SHORT_TAG = ''
        BACKEND_LOCAL = ''
        FRONTEND_LOCAL = ''
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Prep') {
            steps {
                script {
                    // Prefer Jenkins-provided GIT_COMMIT/BRANCH if available, fallback to local git
                    env.GIT_SHORT_SHA = (env.GIT_COMMIT ? env.GIT_COMMIT.take(7) : sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim())
                    def rawBranch = env.BRANCH_NAME ?: sh(returnStdout: true, script: 'git rev-parse --abbrev-ref HEAD').trim()
                    env.SANITIZED_BRANCH = rawBranch.replaceAll('[^A-Za-z0-9._-]', '-').toLowerCase()

                    // Use local-only tags for build; derive remote tags later during push (avoids null params in multibranch)
                    env.SHORT_TAG = "${env.SANITIZED_BRANCH}-${env.GIT_SHORT_SHA}"
                    env.BACKEND_LOCAL = "taskmgr-backend:${env.SHORT_TAG}"
                    env.FRONTEND_LOCAL = "taskmgr-frontend:${env.SHORT_TAG}"

                    echo "Branch: ${rawBranch} -> ${env.SANITIZED_BRANCH}"
                    echo "Commit SHA: ${env.GIT_SHORT_SHA}"
                    echo "Local Backend tag: ${env.BACKEND_LOCAL}"
                    echo "Local Frontend tag: ${env.FRONTEND_LOCAL}"
                }
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    echo "Building Backend image as ${env.BACKEND_LOCAL}"
                    sh """
                        docker build -f backend/Dockerfile -t ${env.BACKEND_LOCAL} backend
                    """

                    echo "Building Frontend image as ${env.FRONTEND_LOCAL}"
                    sh """
                        docker build -f frontend/Dockerfile -t ${env.FRONTEND_LOCAL} frontend
                    """
                }
            }
        }

        stage('Docker Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: params.REGISTRY_CREDENTIALS_ID, usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
                    script {
                        echo "Logging in to Docker Hub..."
                        sh 'echo "$DOCKERHUB_PASS" | docker login -u "$DOCKERHUB_USER" --password-stdin'

                        // Resolve namespace: prefer parameter if provided; otherwise fall back to Docker Hub username from credentials
                        def namespace = (params.DOCKERHUB_NAMESPACE?.trim()) ?: (DOCKERHUB_USER?.trim())
                        if (!namespace) {
                            error "Docker Hub namespace is not set. Provide DOCKERHUB_NAMESPACE parameter or ensure credentials have a username."
                        }

                        def backendName = (params.BACKEND_IMAGE?.trim()) ?: 'task-manager-server'
                        def frontendName = (params.FRONTEND_IMAGE?.trim()) ?: 'task-manager'

                        def backendRemote = "${namespace}/${backendName}:${env.SHORT_TAG}"
                        def frontendRemote = "${namespace}/${frontendName}:${env.SHORT_TAG}"

                        echo "Tagging for push -> Backend: ${backendRemote} | Frontend: ${frontendRemote}"
                        sh """
                            docker tag ${env.BACKEND_LOCAL} ${backendRemote}
                            docker tag ${env.FRONTEND_LOCAL} ${frontendRemote}
                            docker push ${backendRemote}
                            docker push ${frontendRemote}
                        """

                        // Push latest tag if main/master
                        boolean pushLatest = params.PUSH_LATEST_ON_MAIN && (env.SANITIZED_BRANCH == 'main' || env.SANITIZED_BRANCH == 'master')
                        if (pushLatest) {
                            def backendLatest = "${namespace}/${backendName}:latest"
                            def frontendLatest = "${namespace}/${frontendName}:latest"
                            echo "Also pushing latest tags..."
                            sh """
                                docker tag ${env.BACKEND_LOCAL} ${backendLatest}
                                docker tag ${env.FRONTEND_LOCAL} ${frontendLatest}
                                docker push ${backendLatest}
                                docker push ${frontendLatest}
                            """
                        } else {
                            echo "Skipping latest tag push for branch ${env.SANITIZED_BRANCH}"
                        }

                        sh 'docker logout || true'
                    }
                }
            }
        }
    }

    post {
        always {
            echo "Cleaning up dangling Docker images..."
            sh 'docker image prune -f || true'
        }
    }
}
