pipeline {
    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        ansiColor('xterm')
    }

    parameters {
        string(name: 'DOCKERHUB_NAMESPACE', defaultValue: 'chanakamadhuranga', description: 'Docker Hub username/org')
        string(name: 'REGISTRY_CREDENTIALS_ID', defaultValue: 'c29e8c4d-bd5e-457c-8911-d7805bf37143', description: 'Jenkins credentials for Docker Hub')
        string(name: 'BACKEND_IMAGE', defaultValue: 'task-manager-server', description: 'Backend image name')
        string(name: 'FRONTEND_IMAGE', defaultValue: 'task-manager', description: 'Frontend image name')
        booleanParam(name: 'PUSH_LATEST_ON_MAIN', defaultValue: true, description: 'Also push latest for main/master')
    }

    environment {
        GIT_SHORT_SHA = ''
        SANITIZED_BRANCH = ''
        BACKEND_IMAGE_REF = ''
        FRONTEND_IMAGE_REF = ''
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
                    env.GIT_SHORT_SHA = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
                    def rawBranch = env.BRANCH_NAME ?: sh(returnStdout: true, script: 'git rev-parse --abbrev-ref HEAD').trim()
                    env.SANITIZED_BRANCH = rawBranch.replaceAll('[^A-Za-z0-9._-]', '-').toLowerCase()

                    // Compute image refs
                    env.BACKEND_IMAGE_REF = "${params.DOCKERHUB_NAMESPACE}/${params.BACKEND_IMAGE}:${env.SANITIZED_BRANCH}-${env.GIT_SHORT_SHA}"
                    env.FRONTEND_IMAGE_REF = "${params.DOCKERHUB_NAMESPACE}/${params.FRONTEND_IMAGE}:${env.SANITIZED_BRANCH}-${env.GIT_SHORT_SHA}"

                    echo "Branch: ${rawBranch} -> ${env.SANITIZED_BRANCH}"
                    echo "Commit SHA: ${env.GIT_SHORT_SHA}"
                    echo "Backend Image: ${env.BACKEND_IMAGE_REF}"
                    echo "Frontend Image: ${env.FRONTEND_IMAGE_REF}"
                }
            }
        }

        stage('Docker Build') {
            steps {
                script {
                    echo "Building Backend: ${env.BACKEND_IMAGE_REF}"
                    sh """
                        docker build -f backend/Dockerfile -t ${env.BACKEND_IMAGE_REF} backend
                    """

                    echo "Building Frontend: ${env.FRONTEND_IMAGE_REF}"
                    sh """
                        docker build -f frontend/Dockerfile -t ${env.FRONTEND_IMAGE_REF} frontend
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

                        // Sanity check the namespace used for tagging vs. the logged-in username.
                        // If they differ and no org push is intended, retag to the login username to avoid access denied errors.
                        def loginUser = (env.DOCKERHUB_USER ?: '').trim()
                        def paramNs = (params.DOCKERHUB_NAMESPACE ?: '').trim()

                        if (!paramNs && loginUser) {
                            echo "DOCKERHUB_NAMESPACE parameter was empty; defaulting to login username '${loginUser}'."
                            paramNs = loginUser
                        }

                        if (loginUser && paramNs && loginUser != paramNs) {
                            echo "Warning: DOCKERHUB_NAMESPACE ('${paramNs}') differs from Docker Hub login username ('${loginUser}')."
                            echo "If you intended to push to an org '${paramNs}', ensure credentials have org permissions. Otherwise retagging to '${loginUser}'."

                            def backendRetag = "${loginUser}/${params.BACKEND_IMAGE}:${env.SANITIZED_BRANCH}-${env.GIT_SHORT_SHA}"
                            def frontendRetag = "${loginUser}/${params.FRONTEND_IMAGE}:${env.SANITIZED_BRANCH}-${env.GIT_SHORT_SHA}"

                            sh """
                                docker tag ${env.BACKEND_IMAGE_REF} ${backendRetag}
                                docker tag ${env.FRONTEND_IMAGE_REF} ${frontendRetag}
                            """

                            env.BACKEND_IMAGE_REF = backendRetag
                            env.FRONTEND_IMAGE_REF = frontendRetag
                        }

                        echo "Pushing Backend: ${env.BACKEND_IMAGE_REF}"
                        sh "docker push ${env.BACKEND_IMAGE_REF}"

                        echo "Pushing Frontend: ${env.FRONTEND_IMAGE_REF}"
                        sh "docker push ${env.FRONTEND_IMAGE_REF}"

                        // Push latest tag if main/master
                        boolean pushLatest = params.PUSH_LATEST_ON_MAIN && (env.SANITIZED_BRANCH == 'main' || env.SANITIZED_BRANCH == 'master')
                        if (pushLatest) {
                            // Derive :latest from the final refs actually being pushed
                            def backendLatest = env.BACKEND_IMAGE_REF.split(':')[0] + ':latest'
                            def frontendLatest = env.FRONTEND_IMAGE_REF.split(':')[0] + ':latest'
                            echo "Also pushing latest tags..."
                            sh """
                                docker tag ${env.BACKEND_IMAGE_REF} ${backendLatest}
                                docker tag ${env.FRONTEND_IMAGE_REF} ${frontendLatest}
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
