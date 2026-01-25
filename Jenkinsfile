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
    // Docker Hub configuration
    DOCKERHUB_USERNAME = 'chanakamadhuranga'
    DOCKERHUB_CREDENTIALS = 'dockerhub-credentials'
    BACKEND_IMAGE = 'task-manager-server'
    FRONTEND_IMAGE = 'task-manager'
    
    // Deployment configuration
    DEPLOY_HOST = 'root@143.198.197.174'
    MONGODB_URI = 'mongodb://mongo:27017/taskmanager'

    TF_VAR_do_token = credentials('do_token')
    TF_VAR_ssh_fingerprint = credentials('ssh_fingerprint')

    // Dynamic values
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
          // Get git commit SHA with fallback
          def gitSha = ''
          try {
            gitSha = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
          } catch (Exception e) {
            echo "Warning: Could not get git SHA: ${e.message}"
            gitSha = "build-${env.BUILD_NUMBER}"
          }
          
          if (!gitSha || gitSha == '' || gitSha == 'null') {
            gitSha = "build-${env.BUILD_NUMBER}"
          }
          env.GIT_SHORT_SHA = gitSha
          
          // Get branch name with multiple fallbacks
          def branch = ''
          if (env.BRANCH_NAME) {
            branch = env.BRANCH_NAME
          } else if (env.GIT_BRANCH) {
            branch = env.GIT_BRANCH
          } else {
            try {
              branch = sh(returnStdout: true, script: 'git symbolic-ref --short HEAD 2>/dev/null || echo "main"').trim()
            } catch (Exception e) {
              echo "Warning: Could not get branch: ${e.message}"
              branch = 'main'
            }
          }
          
          if (!branch || branch == '' || branch == 'null' || branch == 'HEAD') {
            branch = 'main'
          }
          
          if (branch.startsWith('origin/')) {
            branch = branch.substring(7)
          }
          
          // Sanitize branch name
          def sanitized = branch.replaceAll('[^A-Za-z0-9._-]', '-').toLowerCase()
          if (!sanitized || sanitized == '' || sanitized == 'null') {
            sanitized = 'main'
          }
          env.BRANCH_TAG = sanitized
          
          echo "=== Build Info ==="
          echo "Branch: ${env.BRANCH_TAG}"
          echo "Commit: ${env.GIT_SHORT_SHA}"
          echo "Backend: ${env.DOCKERHUB_USERNAME}/${env.BACKEND_IMAGE}:${env.BRANCH_TAG}-${env.GIT_SHORT_SHA}"
          echo "Frontend: ${env.DOCKERHUB_USERNAME}/${env.FRONTEND_IMAGE}:${env.BRANCH_TAG}-${env.GIT_SHORT_SHA}"
          echo "=================="
        }
      }
    }

    stage('Docker Build') {
      steps {
        script {
          def backendTag = "${env.BRANCH_TAG}-${env.GIT_SHORT_SHA}"
          def frontendTag = "${env.BRANCH_TAG}-${env.GIT_SHORT_SHA}"
          
          def backendImage = "${env.DOCKERHUB_USERNAME}/${env.BACKEND_IMAGE}"
          def frontendImage = "${env.DOCKERHUB_USERNAME}/${env.FRONTEND_IMAGE}"

          echo "Building images with multiple tags..."
          
          sh """
            docker build -f backend/Dockerfile \
              -t ${backendImage}:${backendTag} \
              -t ${backendImage}:latest \
              -t ${backendImage}:build-${env.BUILD_NUMBER} \
              backend
              
            docker build -f frontend/Dockerfile \
              -t ${frontendImage}:${frontendTag} \
              -t ${frontendImage}:latest \
              -t ${frontendImage}:build-${env.BUILD_NUMBER} \
              frontend
          """
          
          echo "Images built with tags: ${backendTag}, latest, build-${env.BUILD_NUMBER}"
        }
      }
    }

    stage('Docker Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: env.DOCKERHUB_CREDENTIALS, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          script {
            def backendTag = "${env.BRANCH_TAG}-${env.GIT_SHORT_SHA}"
            def frontendTag = "${env.BRANCH_TAG}-${env.GIT_SHORT_SHA}"
            
            def backendImage = "${env.DOCKERHUB_USERNAME}/${env.BACKEND_IMAGE}"
            def frontendImage = "${env.DOCKERHUB_USERNAME}/${env.FRONTEND_IMAGE}"
            
            echo "Logging in to Docker Hub..."
            sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'

            echo "Pushing all image tags..."
            sh """
              docker push ${backendImage}:${backendTag}
              docker push ${backendImage}:latest
              docker push ${backendImage}:build-${env.BUILD_NUMBER}
              
              docker push ${frontendImage}:${frontendTag}
              docker push ${frontendImage}:latest
              docker push ${frontendImage}:build-${env.BUILD_NUMBER}
            """
            
            echo "Pushed images:"
            echo "  Backend: ${backendTag}, latest, build-${env.BUILD_NUMBER}"
            echo "  Frontend: ${frontendTag}, latest, build-${env.BUILD_NUMBER}"

            sh 'docker logout'
          }
        }
      }
    }

    stage('Deploy') {
      when {
        branch 'main'
      }
      steps {
        script {
          echo "Deploying to ${env.DEPLOY_HOST}..."
          
          def backendImage = "${env.DOCKERHUB_USERNAME}/${env.BACKEND_IMAGE}:latest"
          def frontendImage = "${env.DOCKERHUB_USERNAME}/${env.FRONTEND_IMAGE}:latest"
          
          // Deploy to server
          sh """
            ssh -o StrictHostKeyChecking=no ${env.DEPLOY_HOST} '
              echo "Pulling latest images..."
              docker pull ${backendImage}
              docker pull ${frontendImage}
              
              echo "Stopping and removing old containers..."
              docker rm -f taskmanager-frontend taskmanager-backend taskmanager-mongo || true
              
              echo "Starting MongoDB..."
              docker run -d \
                --name taskmanager-mongo \
                --restart unless-stopped \
                -v mongo_data:/data/db \
                mongo:6
              
              echo "Starting backend..."
              docker run -d \
                --name taskmanager-backend \
                --restart unless-stopped \
                -p 4000:4000 \
                -e PORT=4000 \
                -e MONGODB_URI=mongodb://taskmanager-mongo:27017/taskmanager \
                -e JWT_SECRET=2e4a69a43c44c83194e29f5e4481364a8960294e3c3e90cb048188ca850f9c18 \
                -e NODE_ENV=production \
                --link taskmanager-mongo:mongo \
                ${backendImage}
              
              echo "Starting frontend..."
              docker run -d \
                --name taskmanager-frontend \
                --restart unless-stopped \
                -p 5173:3000 \
                -e VITE_API_BASE_URL=http://129.212.232.43:4000 \
                ${frontendImage}
              
              echo "Deployment complete!"
              docker ps --filter name=taskmanager
            '
          """
          
          echo "Deployment complete! Images deployed:"
          echo "  Backend: ${backendImage}"
          echo "  Frontend: ${frontendImage}"
        }
      }
    }
  }

  post {
    always {
      sh 'docker image prune -f || true'
    }
    success {
      echo "Pipeline completed successfully!"
    }
    failure {
      echo "Pipeline failed!"
    }
  }
}
