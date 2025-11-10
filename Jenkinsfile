pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
  }


  parameters {
    string(name: 'DOCKERHUB_NAMESPACE', defaultValue: 'chanakamadhuranga', description: 'Docker Hub namespace (username or org) to push images to')
    string(name: 'REGISTRY_CREDENTIALS_ID', defaultValue: 'c29e8c4d-bd5e-457c-8911-d7805bf37143', description: 'Jenkins Credentials ID (Username with password) for Docker Hub')
    string(name: 'BACKEND_IMAGE', defaultValue: 'task-manager-server', description: 'Backend image repository name')
    string(name: 'FRONTEND_IMAGE', defaultValue: 'task-manager', description: 'Frontend image repository name')
    string(name: 'NPM_REGISTRY', defaultValue: 'https://registry.npmjs.org/', description: 'Optional custom NPM registry (mirror) to use during Docker builds')
    booleanParam(name: 'PUSH_LATEST_ON_MAIN', defaultValue: true, description: 'Also tag and push latest when building main branch')
  }

  environment {
    // Will be initialized in Prep stage
    GIT_SHORT_SHA = ''
    SANITIZED_BRANCH = ''
    // Image tags
    BACKEND_TAG = ''
    FRONTEND_TAG = ''
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
          // short SHA
          env.GIT_SHORT_SHA = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()

          // sanitize branch name (replace slashes and spaces)
          def rawBranch = env.BRANCH_NAME ?: sh(returnStdout: true, script: 'git rev-parse --abbrev-ref HEAD').trim()
          env.SANITIZED_BRANCH = rawBranch.replaceAll('[^A-Za-z0-9._-]', '-').toLowerCase()

          // Compute tags and full image refs
          def tag = "${env.SANITIZED_BRANCH}-${env.GIT_SHORT_SHA}"
          env.BACKEND_TAG = tag
          env.FRONTEND_TAG = tag
          env.BACKEND_IMAGE_REF = "${params.DOCKERHUB_NAMESPACE}/${params.BACKEND_IMAGE}:${env.BACKEND_TAG}"
          env.FRONTEND_IMAGE_REF = "${params.DOCKERHUB_NAMESPACE}/${params.FRONTEND_IMAGE}:${env.FRONTEND_TAG}"

          echo "Branch: ${rawBranch} -> ${env.SANITIZED_BRANCH}"
          echo "Commit: ${env.GIT_SHORT_SHA}"
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
          // Recompute to ensure values are present
          def computedSha = env.GIT_SHORT_SHA ?: sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
          def rawBranch = env.BRANCH_NAME ?: sh(returnStdout: true, script: 'git rev-parse --abbrev-ref HEAD').trim()
          def computedBranch = env.SANITIZED_BRANCH ?: rawBranch.replaceAll('[^A-Za-z0-9._-]', '-').toLowerCase()
          
          def backendImageRef = "${params.DOCKERHUB_NAMESPACE}/${params.BACKEND_IMAGE}:${computedBranch}-${computedSha}"
          def frontendImageRef = "${params.DOCKERHUB_NAMESPACE}/${params.FRONTEND_IMAGE}:${computedBranch}-${computedSha}"

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
          
          // Persist for push stage
          env.BACKEND_IMAGE_REF = backendImageRef
          env.FRONTEND_IMAGE_REF = frontendImageRef
        }
      }
    }

    stage('Docker Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: params.REGISTRY_CREDENTIALS_ID, usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
                    script {
                        def gitSha = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
                        def rawBranch = env.BRANCH_NAME ?: sh(returnStdout: true, script: 'git rev-parse --abbrev-ref HEAD').trim()
                        def sanitizedBranch = rawBranch.replaceAll('[^A-Za-z0-9._-]', '-').toLowerCase()
                        
                        def backendImage = "${params.DOCKERHUB_NAMESPACE}/${params.BACKEND_IMAGE}:${sanitizedBranch}-${gitSha}"
                        def frontendImage = "${params.DOCKERHUB_NAMESPACE}/${params.FRONTEND_IMAGE}:${sanitizedBranch}-${gitSha}"
                        
                        echo "Logging in to Docker Hub..."
                        sh 'echo "$DOCKERHUB_PASS" | docker login -u "$DOCKERHUB_USER" --password-stdin'

                        echo "Pushing Backend: ${backendImage}"
                        sh "docker push ${backendImage}"

                        echo "Pushing Frontend: ${frontendImage}"
                        sh "docker push ${frontendImage}"

                        // Push latest tag if main/master
                        boolean pushLatest = params.PUSH_LATEST_ON_MAIN && (sanitizedBranch == 'main' || sanitizedBranch == 'master')
                        if (pushLatest) {
                            def backendLatest = "${params.DOCKERHUB_NAMESPACE}/${params.BACKEND_IMAGE}:latest"
                            def frontendLatest = "${params.DOCKERHUB_NAMESPACE}/${params.FRONTEND_IMAGE}:latest"
                            echo "Also pushing latest tags..."
                            sh """
                                docker tag ${backendImage} ${backendLatest}
                                docker tag ${frontendImage} ${frontendLatest}
                                docker push ${backendLatest}
                                docker push ${frontendLatest}
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