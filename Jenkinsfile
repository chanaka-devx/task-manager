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

          sh label: 'Build backend image', script: """
            docker build \
              -f backend/Dockerfile \
              -t '${backendImageRef}' \
              backend
          """

          sh label: 'Build frontend image', script: """
            docker build \
              -f frontend/Dockerfile \
              -t '${frontendImageRef}' \
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
        script {
          def backendImageRef = env.BACKEND_IMAGE_REF
          def frontendImageRef = env.FRONTEND_IMAGE_REF

          withCredentials([usernamePassword(credentialsId: params.REGISTRY_CREDENTIALS_ID, usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
            sh """
              set -e
              echo "\$DOCKERHUB_PASS" | docker login -u "\$DOCKERHUB_USER" --password-stdin
              docker push "${backendImageRef}"
              docker push "${frontendImageRef}"
            """

            boolean pushLatest = params.PUSH_LATEST_ON_MAIN && (env.SANITIZED_BRANCH == 'main' || env.SANITIZED_BRANCH == 'master')
            if (pushLatest) {
              def backendLatest = "${params.DOCKERHUB_NAMESPACE}/${params.BACKEND_IMAGE}:latest"
              def frontendLatest = "${params.DOCKERHUB_NAMESPACE}/${params.FRONTEND_IMAGE}:latest"

              sh """
                docker tag ${backendImageRef} ${backendLatest}
                docker tag ${frontendImageRef} ${frontendLatest}
                docker push ${backendLatest}
                docker push ${frontendLatest}
              """
            } else {
              echo "Skipping latest tag push (branch=${env.SANITIZED_BRANCH}, PUSH_LATEST_ON_MAIN=${params.PUSH_LATEST_ON_MAIN})"
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
