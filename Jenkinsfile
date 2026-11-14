// Wilderness-Survival：推到 deploy 分支 → 建置 image → 推到 Harbor → 部署到 K8s
pipeline {
    agent { label 'ml-flow-runner' }   

    environment {
        _customerName = "prod"
        _projectName   = "wilderness-survival"
        _harborURL   = "harbor.agent7.net"
        TIMESTAMP = sh(script: "date +%Y%m%d", returnStdout: true).trim()

        // 安全掃描的處理方式：
        //   "false" = 只在 log 列出漏洞，不影響部署（剛導入時先用這個看現況）
        //   "true"  = 發現 HIGH / CRITICAL 漏洞就讓 build 失敗，不會部署
        _scanBlocking = "false"
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
                    env.IMAGE_FULL = "${env._harborURL}/${env._customerName}/${env._customerName}-${env._projectName}:${env.IMAGE_TAG}"
                    currentBuild.description = "${env.IMAGE_TAG} (${env.GIT_SHORT_SHA})"
                }
            }
        }

        // 【安全】依賴掃描：檢查 npm 套件有沒有已知漏洞
        // - 只看正式環境會用到的套件（--omit=dev），門檻是 high 以上
        // - 放在 Build Image 之前：套件有問題就不用浪費時間 build
        // - 用 tar 把 package.json / package-lock.json 送進容器，而不是掛載目錄，
        //   這樣不管 Jenkins agent 本身是不是跑在容器裡都能用
        stage('Dependency Audit') {
            steps {
                sh '''
                    echo "npm audit (blocking=${_scanBlocking})"
                    tar -C X/server -c package.json package-lock.json \
                        | sudo docker run --rm -i node:22-alpine sh -c \
                            'mkdir /audit && cd /audit && tar -x && npm audit --omit=dev --audit-level=high' \
                        || [ "${_scanBlocking}" != "true" ]
                '''
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

        // 【安全】Image 掃描：用 Trivy 檢查剛 build 好的 image
        // - 會掃基底 image（node:22-alpine）的系統套件，以及 image 裡的 npm 套件
        // - 放在 Push to Harbor 之前：有漏洞的 image 不會進到 Harbor，也就不會被部署
        // - --severity HIGH,CRITICAL：只管高風險以上
        // - --ignore-unfixed：官方還沒出修正版的漏洞先略過（升級也解決不了）
        // - trivy-cache 是 docker volume，用來保存漏洞資料庫，避免每次都重新下載
        stage('Scan Image') {
            steps {
                sh '''
                    echo "trivy scan ${IMAGE_FULL} (blocking=${_scanBlocking})"
                    sudo docker run --rm \
                        -v /var/run/docker.sock:/var/run/docker.sock \
                        -v trivy-cache:/root/.cache/ \
                        aquasec/trivy:latest image \
                        --severity HIGH,CRITICAL --ignore-unfixed --exit-code 1 \
                        ${IMAGE_FULL} \
                        || [ "${_scanBlocking}" != "true" ]
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
