pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  triggers {
    githubPush()
  }

  parameters {
    string(name: 'DOCKERHUB_NAMESPACE', defaultValue: 'chanakamadhuranga', description: 'Docker Hub namespace (username or org) to push images to')
    string(name: 'REGISTRY_CREDENTIALS_ID', defaultValue: 'dockerhub-credentials', description: 'Jenkins Credentials ID (Username with password) for Docker Hub')
    string(name: 'BACKEND_IMAGE', defaultValue: 'task-manager-server', description: 'Backend image repository name')
    string(name: 'FRONTEND_IMAGE', defaultValue: 'task-manager', description: 'Frontend image repository name')
    string(name: 'NPM_REGISTRY', defaultValue: 'https://registry.npmjs.org/', description: 'Optional custom NPM registry (mirror) to use during Docker builds')
    // Deployment parameters
    string(name: 'DO_SSH_HOST', defaultValue: 'root@143.198.197.174', description: 'DigitalOcean droplet in the form user@host (e.g., root@1.2.3.4). Leave empty to skip deploy.')
    string(name: 'DO_SSH_CREDENTIALS_ID', defaultValue: 'droplet-ssh', description: 'Jenkins SSH Credentials ID (private key or username+password) for the droplet')
    string(name: 'DEPLOY_PATH', defaultValue: '/opt/task-manager', description: 'Remote path on the droplet to store compose file and state')
    string(name: 'MONGODB_URI', defaultValue: 'mongodb://mongo:27017/taskmanager', description: 'MongoDB connection string for the backend (optional here, recommended to use Jenkins Credentials)')
    string(name: 'JWT_SECRET', defaultValue: '2e4a69a43c44c83194e29f5e4481364a8960294e3c3e90cb048188ca850f9c18', description: 'JWT secret for the backend (optional here, recommended to use Jenkins Credentials)')
    booleanParam(name: 'PUSH_LATEST_ON_MAIN', defaultValue: true, description: 'Also tag and push latest when building main branch')
  }

  environment {
    // Will be initialized in Prep stage
    GIT_SHORT_SHA = ''
    SANITIZED_BRANCH = ''
    // Image tags
    BACKEND_TAG = ''
    FRONTEND_TAG = ''
    BACKEND_IMAGE_REF = 'task-manager-server'
    FRONTEND_IMAGE_REF = 'task-manager'
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
          // Get short SHA - with fallback
          def gitSha = ''
          try {
            gitSha = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
          } catch (Exception e) {
            echo "Warning: Could not get git SHA: ${e.message}"
            gitSha = "build-${env.BUILD_NUMBER}"
          }
          
          if (!gitSha || gitSha == '') {
            gitSha = "build-${env.BUILD_NUMBER}"
          }
          env.GIT_SHORT_SHA = gitSha

          // Get branch name - check Jenkins env vars first
          def rawBranch = ''
          
          // Try Jenkins environment variables
          if (env.BRANCH_NAME) {
            rawBranch = env.BRANCH_NAME
          } else if (env.GIT_BRANCH) {
            rawBranch = env.GIT_BRANCH
          } else {
            // Fallback to git command
            try {
              rawBranch = sh(returnStdout: true, script: 'git rev-parse --abbrev-ref HEAD').trim()
            } catch (Exception e) {
              echo "Warning: Could not get branch name: ${e.message}"
              rawBranch = "main"
            }
          }
          
          // Handle empty or HEAD
          if (!rawBranch || rawBranch == '' || rawBranch == 'HEAD') {
            rawBranch = "main"
          }
          
          // Remove origin/ prefix if present
          if (rawBranch.startsWith('origin/')) {
            rawBranch = rawBranch.substring(7)
          }
          
          // Sanitize branch name (replace slashes and special chars)
          def sanitizedBranch = rawBranch.replaceAll('[^A-Za-z0-9._-]', '-').toLowerCase()
          
          // Ensure it's not empty after sanitization
          if (!sanitizedBranch || sanitizedBranch == '') {
            sanitizedBranch = "main"
          }
          
          env.SANITIZED_BRANCH = sanitizedBranch

          // Get Docker Hub namespace with fallback
          def dockerhubNamespace = params.DOCKERHUB_NAMESPACE ?: 'chanakamadhuranga'
          def backendImageName = params.BACKEND_IMAGE ?: 'task-manager-server'
          def frontendImageName = params.FRONTEND_IMAGE ?: 'task-manager'
          
          echo "Docker Hub Namespace: ${dockerhubNamespace}"
          echo "Backend Image Name: ${backendImageName}"
          echo "Frontend Image Name: ${frontendImageName}"

          // Compute tags and full image refs
          def backendTag = "${sanitizedBranch}-${gitSha}"
          def frontendTag = "${sanitizedBranch}-${gitSha}"
          
          env.BACKEND_TAG = backendTag
          env.FRONTEND_TAG = frontendTag
          env.BACKEND_IMAGE_REF = "${dockerhubNamespace}/${backendImageName}:${backendTag}"
          env.FRONTEND_IMAGE_REF = "${dockerhubNamespace}/${frontendImageName}:${frontendTag}"

          echo "Raw Branch: ${rawBranch}"
          echo "Sanitized Branch: ${sanitizedBranch}"
          echo "Commit SHA: ${gitSha}"
          echo "Backend Tag: ${backendTag}"
          echo "Frontend Tag: ${frontendTag}"
          echo "Backend Image: ${env.BACKEND_IMAGE_REF}"
          echo "Frontend Image: ${env.FRONTEND_IMAGE_REF}"
        }
      }
    }

    stage('Docker Env Inspect') {
      steps {
        script {
          // Check if buildx plugin exists; non-fatal if missing
          sh "docker buildx version || echo 'docker buildx plugin not found; using legacy builder.'"
          // Show info for debugging network timeouts
          sh "docker info | grep -E 'Version|Storage Driver|HTTP Proxy|HTTPS Proxy' || true"
        }
      }
    }

    stage('Docker Build') {
      steps {
        script {
          // Use the environment variables set in Prep stage
          def backendImageRef = env.BACKEND_IMAGE_REF
          def frontendImageRef = env.FRONTEND_IMAGE_REF

          echo "Building Backend: ${backendImageRef}"
          echo "Building Frontend: ${frontendImageRef}"

          // Build-args for proxies (if set on the agent) and npm registry
          def proxyArgs = ''
          if (env.HTTP_PROXY)  { proxyArgs += " --build-arg HTTP_PROXY='${env.HTTP_PROXY}' --build-arg http_proxy='${env.HTTP_PROXY}'" }
          if (env.HTTPS_PROXY) { proxyArgs += " --build-arg HTTPS_PROXY='${env.HTTPS_PROXY}' --build-arg https_proxy='${env.HTTPS_PROXY}'" }
          if (env.NO_PROXY)    { proxyArgs += " --build-arg NO_PROXY='${env.NO_PROXY}' --build-arg no_proxy='${env.NO_PROXY}'" }

          sh label: 'Build backend image', script: """
            docker build \
              -f backend/Dockerfile \
              -t '${backendImageRef}' \
              ${proxyArgs} \
              --build-arg NPM_REGISTRY='${params.NPM_REGISTRY}' \
              backend
          """

          sh label: 'Build frontend image', script: """
            docker build \
              -f frontend/Dockerfile \
              -t '${frontendImageRef}' \
              ${proxyArgs} \
              --build-arg NPM_REGISTRY='${params.NPM_REGISTRY}' \
              frontend
          """
        }
      }
    }

    stage('Docker Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: params.REGISTRY_CREDENTIALS_ID, usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
          script {
            // Use the environment variables set in Prep stage
            def backendImage = env.BACKEND_IMAGE_REF
            def frontendImage = env.FRONTEND_IMAGE_REF
            def sanitizedBranch = env.SANITIZED_BRANCH
            
            echo "Logging in to Docker Hub..."
            sh 'echo "$DOCKERHUB_PASS" | docker login -u "$DOCKERHUB_USER" --password-stdin'

            echo "Pushing Backend: ${backendImage}"
            sh "docker push '${backendImage}'"

            echo "Pushing Frontend: ${frontendImage}"
            sh "docker push '${frontendImage}'"

            // Push latest tag if main/master
            def dockerhubNamespace = params.DOCKERHUB_NAMESPACE ?: 'chanakamadhuranga'
            def backendImageName = params.BACKEND_IMAGE ?: 'task-manager-server'
            def frontendImageName = params.FRONTEND_IMAGE ?: 'task-manager'
            
            boolean pushLatest = params.PUSH_LATEST_ON_MAIN && (sanitizedBranch == 'main' || sanitizedBranch == 'master')
            if (pushLatest) {
              def backendLatest = "${dockerhubNamespace}/${backendImageName}:latest"
              def frontendLatest = "${dockerhubNamespace}/${frontendImageName}:latest"
              echo "Also pushing latest tags..."
              sh """
                docker tag '${backendImage}' '${backendLatest}'
                docker tag '${frontendImage}' '${frontendLatest}'
                docker push '${backendLatest}'
                docker push '${frontendLatest}'
              """
            } else {
              echo "Skipping latest tag push for branch ${sanitizedBranch}"
            }

            sh 'docker logout || true'
          }
        }
      }
    }

  }
  post {
    always {
      // Attempt to clean up dangling images from this build to save space
      sh 'docker image prune -f || true'
    }
  }
}