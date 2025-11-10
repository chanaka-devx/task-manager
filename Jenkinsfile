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

    stage('Docker Sanity') {
      steps {
        sh label: 'Check Docker CLI and daemon access', script: '''
          set -e
          # Ensure docker CLI exists and can talk to the daemon
          if ! docker version >/dev/null 2>&1; then
            echo "ERROR: Docker CLI not available or Docker daemon not reachable from this Jenkins agent."
            echo "Fix: Install Docker, ensure the daemon is running, and grant the Jenkins user access to the Docker socket."
            exit 2
          fi

          # Basic socket permission hint (Linux hosts)
          if [ -S /var/run/docker.sock ] && [ ! -w /var/run/docker.sock ]; then
            echo "ERROR: Jenkins user lacks write access to /var/run/docker.sock."
            echo "Fix: Add Jenkins user to the 'docker' group and restart Jenkins (e.g., sudo usermod -aG docker jenkins; sudo systemctl restart jenkins)."
            exit 3
          fi
        '''
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
          // Fallback (re)compute branch/SHA in case environment wasn't populated
          def computedSha = env.GIT_SHORT_SHA
          if (!computedSha) {
            computedSha = sh(returnStdout: true, script: 'git rev-parse --short HEAD').trim()
            env.GIT_SHORT_SHA = computedSha
          }

          def computedBranch = env.SANITIZED_BRANCH
          if (!computedBranch) {
            def raw = env.BRANCH_NAME ?: sh(returnStdout: true, script: 'git rev-parse --abbrev-ref HEAD').trim()
            computedBranch = raw.replaceAll('[^A-Za-z0-9._-]', '-').toLowerCase()
            env.SANITIZED_BRANCH = computedBranch
          }

          def backendImageRef = "${params.DOCKERHUB_NAMESPACE}/${params.BACKEND_IMAGE}:${computedBranch}-${computedSha}"
          def frontendImageRef = "${params.DOCKERHUB_NAMESPACE}/${params.FRONTEND_IMAGE}:${computedBranch}-${computedSha}"

          // Echo for visibility
          echo "Building Backend: ${backendImageRef}"
          echo "Building Frontend: ${frontendImageRef}"

          sh label: 'Build backend image', script: """
            docker build \
              -f backend/Dockerfile \
              -t ${backendImageRef} \
              backend
          """

          sh label: 'Build frontend image', script: """
            docker build \
              -f frontend/Dockerfile \
              -t ${frontendImageRef} \
              frontend
          """

          // Persist for later stages
          env.BACKEND_IMAGE_REF = backendImageRef
          env.FRONTEND_IMAGE_REF = frontendImageRef
        }
      }
    }

    stage('Docker Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: params.REGISTRY_CREDENTIALS_ID, usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
          sh '''
            set -e
            echo "$DOCKERHUB_PASS" | docker login -u "$DOCKERHUB_USER" --password-stdin
            docker push "$BACKEND_IMAGE_REF"
            docker push "$FRONTEND_IMAGE_REF"
          '''

          script {
            boolean pushLatest = params.PUSH_LATEST_ON_MAIN && (env.SANITIZED_BRANCH == 'main' || env.SANITIZED_BRANCH == 'master')
            if (pushLatest) {
              def backendLatest = "${params.DOCKERHUB_NAMESPACE}/${params.BACKEND_IMAGE}:latest"
              def frontendLatest = "${params.DOCKERHUB_NAMESPACE}/${params.FRONTEND_IMAGE}:latest"

              sh """
                docker tag ${env.BACKEND_IMAGE_REF} ${backendLatest}
                docker tag ${env.FRONTEND_IMAGE_REF} ${frontendLatest}
                docker push ${backendLatest}
                docker push ${frontendLatest}
              """
            } else {
              echo "Skipping latest tag push (branch=${env.SANITIZED_BRANCH}, PUSH_LATEST_ON_MAIN=${params.PUSH_LATEST_ON_MAIN})"
            }
          }

          sh 'docker logout || true'
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
