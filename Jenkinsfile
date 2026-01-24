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
          def backendImage = "${env.DOCKERHUB_USERNAME}/${env.BACKEND_IMAGE}:${env.BRANCH_TAG}-${env.GIT_SHORT_SHA}"
          def frontendImage = "${env.DOCKERHUB_USERNAME}/${env.FRONTEND_IMAGE}:${env.BRANCH_TAG}-${env.GIT_SHORT_SHA}"

          echo "Building images..."
          
          sh """
            docker build -f backend/Dockerfile -t ${backendImage} backend
            docker build -f frontend/Dockerfile -t ${frontendImage} frontend
          """
        }
      }
    }

    stage('Docker Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: env.DOCKERHUB_CREDENTIALS, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          script {
            def backendImage = "${env.DOCKERHUB_USERNAME}/${env.BACKEND_IMAGE}:${env.BRANCH_TAG}-${env.GIT_SHORT_SHA}"
            def frontendImage = "${env.DOCKERHUB_USERNAME}/${env.FRONTEND_IMAGE}:${env.BRANCH_TAG}-${env.GIT_SHORT_SHA}"
            
            echo "Logging in to Docker Hub..."
            sh 'echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin'

            echo "Pushing images..."
            sh """
              docker push ${backendImage}
              docker push ${frontendImage}
            """

            // Push latest tag for main branch
            if (env.BRANCH_TAG == 'main') {
              def backendLatest = "${env.DOCKERHUB_USERNAME}/${env.BACKEND_IMAGE}:latest"
              def frontendLatest = "${env.DOCKERHUB_USERNAME}/${env.FRONTEND_IMAGE}:latest"
              
              echo "Tagging and pushing latest..."
              sh """
                docker tag ${backendImage} ${backendLatest}
                docker tag ${frontendImage} ${frontendLatest}
                docker push ${backendLatest}
                docker push ${frontendLatest}
              """
            }

            sh 'docker logout'
          }
        }
      }
    }

    stage('Provision Infrastructure') {
            steps {
                sh '''
                cd terraform
                terraform init
                terraform apply -auto-approve
                '''
            }
        }

    stage('Deploy Application') {
            steps {
                sh '''
                cd ansible
                ANSIBLE_HOST_KEY_CHECKING=False ansible-playbook -i inventory.ini playbook.yml

                '''
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
