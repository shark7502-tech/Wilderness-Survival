// Wilderness-Survival：推到 deploy 分支 → 建置 image → 推到 Harbor → 部署到 K8s
pipeline {
    agent { label 'ml-flow-runner' }   

    environment {
        _customerName = "prod"
        _projectName   = "wilderness-survival"
        _harborURL   = "harbor.agent7.net"
        TIMESTAMP = sh(script: "date +%Y%m%d", returnStdout: true).trim()
    }

    options {
        timeout(time: 1, unit: 'HOURS')
        disableConcurrentBuilds()
        skipDefaultCheckout()
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }

    triggers {
        // 搭配 GitHub webhook：https://jenkins2.agent7.net/github-webhook/
        githubPush()
    }

    stages {
        stage('Initialize Workspace') {
            steps {
                script {
                    echo "清理舊的 workspace..."
                    cleanWs()
                }
            }
        }

        stage('Checkout') {
            steps {
                script {
                    // 只監聽 deploy 分支由 Jenkins Job 的 Branch Specifier（*/deploy）負責
                    def scmVars = checkout scm
                    env.GIT_SHORT_SHA = scmVars.GIT_COMMIT.take(7)
                    env.IMAGE_TAG = "${env.TIMESTAMP}-${env.BUILD_ID}"
                    env.IMAGE_FULL = "${env._harborURL}/${env._customerName}/${env.customerName}-${env._projectName}:${env.IMAGE_TAG}"
                    currentBuild.description = "${env.IMAGE_TAG} (${env.GIT_SHORT_SHA})"
                }
            }
        }

        stage('Build Image') {
            steps {
                sh '''
                    echo "build image ${IMAGE_FULL}"
                    sudo docker build --pull --no-cache \
                        --label git-commit=${GIT_SHORT_SHA} \
                        -t ${IMAGE_FULL} X
                '''
            }
        }

        stage('Push to Harbor') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'harbor-credentials',
                                                  usernameVariable: 'HARBOR_USERNAME',
                                                  passwordVariable: 'HARBOR_PASSWORD')]) {
                    sh '''
                        echo "push harbor"
                        echo "$HARBOR_PASSWORD" | sudo docker login ${_harborURL} -u "$HARBOR_USERNAME" --password-stdin
                        sudo docker push ${IMAGE_FULL}
                        sudo docker logout ${_harborURL}
                    '''
                }
            }
        }

        stage('Deploy to K8S') {
            steps {
                sh '''
                    echo "deploy to configmap"
                    bash /mnt/infra/configmap/${_projectName}/ezConfigmap.sh ${_customerName}
                    echo "deploy to EKS (Migration)"

                    /mnt/infra/deploy/ezdeploy.sh ${_customerName}-${_projectName} ${_customerName} ${TIMESTAMP} ${BUILD_ID}
                    
                    sleep 30
                    kubectl get pods
                    
                '''
            }
        }
    }

    post {
        failure {
            sh 'kubectl describe deployment/${_K8sDeployment} -n ${_K8sNamespace} || true'
            sh 'kubectl logs deployment/${_K8sDeployment} -n ${_K8sNamespace} --tail=100 || true'
        }
        always {
            script {
                if (env.IMAGE_FULL) {
                    sh 'sudo docker rmi ${IMAGE_FULL} || true'
                }
            }
        }
    }
}
