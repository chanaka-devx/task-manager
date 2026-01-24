pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  triggers {
    githubPush()
  }

  environment {
    // Hardcoded values
    DOCKERHUB_NAMESPACE = 'chanakamadhuranga'
    BACKEND_IMAGE = 'task-manager-server'
    FRONTEND_IMAGE = 'task-manager'
    REGISTRY_CREDENTIALS_ID = 'c29e8c4d-bd5e-457c-8911-d7805bf37143'
    
    // Will be set dynamically
    GIT_SHORT_SHA = ''
    BRANCH_TAG = ''
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
          // Get git commit SHA
          env.GIT_SHORT_SHA = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
          
          // Get branch name
          def branch = env.BRANCH_NAME ?: env.GIT_BRANCH ?: 'main'
          if (branch.startsWith('origin/')) {
            branch = branch.substring(7)
          }
          
          // Sanitize branch name
          env.BRANCH_TAG = branch.replaceAll('[^A-Za-z0-9._-]', '-').toLowerCase()
          
          echo "Branch: ${env.BRANCH_TAG}"
          echo "Commit: ${env.GIT_SHORT_SHA}"
        }
      }
    }

    stage('Docker Build') {
      steps {
        script {
          def backendImage = "${env.DOCKERHUB_NAMESPACE}/${env.BACKEND_IMAGE}:${env.BRANCH_TAG}-${env.GIT_SHORT_SHA}"
          def frontendImage = "${env.DOCKERHUB_NAMESPACE}/${env.FRONTEND_IMAGE}:${env.BRANCH_TAG}-${env.GIT_SHORT_SHA}"

          echo "Building Backend: ${backendImage}"
          echo "Building Frontend: ${frontendImage}"

          sh """
            docker build -f backend/Dockerfile -t ${backendImage} backend
            docker build -f frontend/Dockerfile -t ${frontendImage} frontend
          """
        }
      }
    }

    stage('Docker Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: env.REGISTRY_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          script {
            def backendImage = "${env.DOCKERHUB_NAMESPACE}/${env.BACKEND_IMAGE}:${env.BRANCH_TAG}-${env.GIT_SHORT_SHA}"
            def frontendImage = "${env.DOCKERHUB_NAMESPACE}/${env.FRONTEND_IMAGE}:${env.BRANCH_TAG}-${env.GIT_SHORT_SHA}"
            
            sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'

            echo "Pushing Backend: ${backendImage}"
            sh "docker push ${backendImage}"

            echo "Pushing Frontend: ${frontendImage}"
            sh "docker push ${frontendImage}"

            // Push latest tag for main branch
            if (env.BRANCH_TAG == 'main') {
              def backendLatest = "${env.DOCKERHUB_NAMESPACE}/${env.BACKEND_IMAGE}:latest"
              def frontendLatest = "${env.DOCKERHUB_NAMESPACE}/${env.FRONTEND_IMAGE}:latest"
              
              sh """
                docker tag ${backendImage} ${backendLatest}
                docker tag ${frontendImage} ${frontendLatest}
                docker push ${backendLatest}
                docker push ${frontendLatest}
              """
              echo "Pushed latest tags"
            }

            sh 'docker logout'
          }
        }
      }
    }

  }
  
  post {
    always {
      sh 'docker image prune -f || true'
    }
  }
}