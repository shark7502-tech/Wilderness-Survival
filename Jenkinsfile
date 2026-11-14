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

    // 【安全】DAST 的開關與網址：會出現在 Jenkins 的「Build with Parameters」頁面
    // - 推到 deploy 自動觸發時一律使用下面的預設值，所以預設不會跑檢測
    // - 想跑檢測時：到 Jenkins 按 Build with Parameters，勾選要跑的項目再按 Build
    // - 預設值以這個檔案為準：每次 build 後 Jenkins 會用這裡的內容覆蓋 Job 上的參數設定，
    //   所以要永久更改網址請改這裡；只想臨時換網址，在介面上改那一次的值即可
    parameters {
        booleanParam(name: 'RUN_ZAP_BASELINE', defaultValue: false,
                     description: '被動掃描 _staging_url：只瀏覽頁面、檢查回應，不送攻擊請求（約 1-2 分鐘）')
        booleanParam(name: 'RUN_ZAP_FULL_SCAN', defaultValue: false,
                     description: '主動掃描 _prod_url：會實際送出攻擊請求並寫入資料，可能改動玩家資料或讓服務變慢（10 分鐘以上）')
        booleanParam(name: 'SCAN_ONLY', defaultValue: true,
                     description: '有勾選上面任一項檢測時，只跑檢測、不重新建置與部署。取消勾選＝先部署再檢測')
        string(name: '_staging_url', defaultValue: 'https://wilderness-survival.jarckson.com',
               description: 'ZAP baseline（被動掃描）的目標網址')
        string(name: '_prod_url', defaultValue: 'https://wilderness-survival.jarckson.com',
               description: 'ZAP full-scan（主動掃描）的目標網址')
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

                    // 只跑檢測模式：有勾檢測、且 SCAN_ONLY 也勾著 → 跳過建置與部署
                    def scanRequested = params.RUN_ZAP_BASELINE || params.RUN_ZAP_FULL_SCAN
                    env.DO_DEPLOY = (!(scanRequested && params.SCAN_ONLY)).toString()
                    if (env.DO_DEPLOY != 'true') {
                        currentBuild.description = "DAST only (${env.GIT_SHORT_SHA})"
                    }
                }
            }
        }
        stage('Dependency Audit') {
            when { expression { env.DO_DEPLOY == 'true' } }
            steps {
                // 腳本放在 ml-flow-runner 上，不在這個 repo 裡
                // 參數：掃描類型、目標、報告檔名（說明見腳本開頭）
                // fs = 讀 X/server 裡的 package-lock.json 掃相依套件
                sh '''
                    echo "dependency scan (blocking=${_scanBlocking})"
                    bash /mnt/infra/deploy/trivy-scan.sh fs X/server dep-scan-report.txt \
                        || [ "${_scanBlocking}" != "true" ]
                '''
            }
            post {
                always {
                    archiveArtifacts artifacts: 'dep-scan-report.txt', allowEmptyArchive: true
                }
            }
        }

        stage('Build Image') {
            when { expression { env.DO_DEPLOY == 'true' } }
            steps {
                sh '''
                    echo "build image ${IMAGE_FULL}"
                    sudo docker build --pull --no-cache \
                        --label git-commit=${GIT_SHORT_SHA} \
                        -t ${IMAGE_FULL} X
                '''
            }
        }
        stage('Scan Image') {
            when { expression { env.DO_DEPLOY == 'true' } }
            steps {
                // image = 掃剛 build 好的 image，包含基底 image 的系統套件
                sh '''
                    echo "image scan ${IMAGE_FULL} (blocking=${_scanBlocking})"
                    bash /mnt/infra/deploy/trivy-scan.sh image "${IMAGE_FULL}" image-scan-report.txt \
                        || [ "${_scanBlocking}" != "true" ]
                '''
            }
            post {
                always {
                    archiveArtifacts artifacts: 'image-scan-report.txt', allowEmptyArchive: true
                }
            }
        }

        stage('Push to Harbor') {
            when { expression { env.DO_DEPLOY == 'true' } }
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
            when { expression { env.DO_DEPLOY == 'true' } }
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

        stage('DAST Baseline') {
            when { expression { params.RUN_ZAP_BASELINE } }
            steps {
                catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                    // 腳本放在 ml-flow-runner 上，不在這個 repo 裡
                    // 參數：檢測類型、目標網址、報告檔名（說明見腳本開頭）
                    sh 'bash /mnt/infra/deploy/zap-scan.sh baseline "${_staging_url}" zap-baseline-report.html'
                }
            }
            post {
                always {
                    archiveArtifacts artifacts: 'zap-baseline-report.html', allowEmptyArchive: true
                }
            }
        }

        stage('DAST Full Scan') {
            when { expression { params.RUN_ZAP_FULL_SCAN } }
            steps {
                catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                    sh 'bash /mnt/infra/deploy/zap-scan.sh fullscan "${_prod_url}" zap-full-scan-report.html'
                }
            }
            post {
                always {
                    archiveArtifacts artifacts: 'zap-full-scan-report.html', allowEmptyArchive: true
                }
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
