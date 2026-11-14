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

        // 【安全】依賴掃描：檢查 npm 套件有沒有已知漏洞
        // - 只看正式環境會用到的套件（--omit=dev），門檻是 high 以上
        // - 放在 Build Image 之前：套件有問題就不用浪費時間 build
        // - 用 tar 把 package.json / package-lock.json 送進容器，而不是掛載目錄，
        //   這樣不管 Jenkins agent 本身是不是跑在容器裡都能用
        stage('Dependency Audit') {
            when { expression { env.DO_DEPLOY == 'true' } }
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

        // 【安全】Image 掃描：用 Trivy 檢查剛 build 好的 image
        // - 會掃基底 image（node:22-alpine）的系統套件，以及 image 裡的 npm 套件
        // - 放在 Push to Harbor 之前：有漏洞的 image 不會進到 Harbor，也就不會被部署
        // - --severity HIGH,CRITICAL：只管高風險以上
        // - --ignore-unfixed：官方還沒出修正版的漏洞先略過（升級也解決不了）
        // - trivy-cache 是 docker volume，用來保存漏洞資料庫，避免每次都重新下載
        stage('Scan Image') {
            when { expression { env.DO_DEPLOY == 'true' } }
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

        // 【安全】DAST 被動掃描（ZAP baseline）：對 _staging_url 執行
        // - 只在 Build with Parameters 勾選 RUN_ZAP_BASELINE 時才會跑
        // - 像一般訪客一樣瀏覽網站，檢查安全標頭、cookie 設定、資訊外洩等，不會送攻擊請求
        // - -I：只有警告（WARN）時不算失敗，出現 FAIL 才算
        // - 報告存成 zap-baseline-report.html，可在這次 build 的 Artifacts 下載
        // - 用 docker cp 把報告拿出來而不是掛載目錄，Jenkins agent 跑在容器裡也能用
        // - catchError：掃描發現問題時把 build 標成 UNSTABLE（黃色），後面的階段照常執行
        stage('DAST Baseline') {
            when { expression { params.RUN_ZAP_BASELINE } }
            steps {
                catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                    sh '''
                        if [ -z "${_staging_url}" ]; then echo "_staging_url 沒有設定"; exit 1; fi
                        echo "ZAP baseline scan: ${_staging_url}"
                        name="zap-baseline-${BUILD_ID}"
                        rc=0
                        sudo docker run --name "$name" ghcr.io/zaproxy/zaproxy:stable sh -c \
                            'mkdir -p /zap/wrk && zap-baseline.py -t "$0" -r report.html -I' "${_staging_url}" || rc=$?
                        sudo docker cp "$name":/zap/wrk/report.html zap-baseline-report.html || true
                        sudo docker rm -f "$name" || true
                        exit $rc
                    '''
                }
            }
            post {
                always {
                    archiveArtifacts artifacts: 'zap-baseline-report.html', allowEmptyArchive: true
                }
            }
        }

        // 【安全】DAST 主動掃描（ZAP full-scan）：對 _prod_url 執行
        // - 只在 Build with Parameters 勾選 RUN_ZAP_FULL_SCAN 時才會跑
        // - 會實際送出攻擊請求（SQL injection、XSS 等）並對表單和 API 寫入資料：
        //   目標是正式環境時，玩家資料可能被改動、服務可能變慢，請挑離峰時間執行
        // - 時間較長（10 分鐘以上）；整條 pipeline 的上限是 options 裡的 1 小時
        // - 報告存成 zap-full-scan-report.html，可在這次 build 的 Artifacts 下載
        stage('DAST Full Scan') {
            when { expression { params.RUN_ZAP_FULL_SCAN } }
            steps {
                catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                    sh '''
                        if [ -z "${_prod_url}" ]; then echo "_prod_url 沒有設定"; exit 1; fi
                        echo "ZAP full scan: ${_prod_url}"
                        name="zap-full-scan-${BUILD_ID}"
                        rc=0
                        sudo docker run --name "$name" ghcr.io/zaproxy/zaproxy:stable sh -c \
                            'mkdir -p /zap/wrk && zap-full-scan.py -t "$0" -r report.html -I' "${_prod_url}" || rc=$?
                        sudo docker cp "$name":/zap/wrk/report.html zap-full-scan-report.html || true
                        sudo docker rm -f "$name" || true
                        exit $rc
                    '''
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
