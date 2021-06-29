pipeline {
    agent {
        label 'docker'
    }
    // agent any
    environment {
        // REGISTRY = "$HARBOR_URL/ngp-$GIT_BRANCH"
        HARBOR_CREDS = "JenkinsHarborUser"
        HARBOR_REGISTRY_URL="http://$HARBOR_URL"
    }
    stages {

        stage('Gather Informations') {
            steps {
                script{
					def settings = readProperties file: "${env.WORKSPACE}/gradle.properties"
					env.VERSION = 'latest'
					if ( env.GIT_BRANCH.trim().toLowerCase() == 'master') {
						env.VERSION = settings.version
					}
                    env.PROJECT_NAME = settings['projectName'].toLowerCase()
                    def branch = env.GIT_BRANCH.trim()
                    switch(branch) {
                        case "master":
                            env.REGISTRY = env.HARBOR_URL + "/ngp-" + env.GIT_BRANCH
                            def tag = sh(returnStdout: true, script: "git tag --contains master").trim()
                            if(!tag?.trim()){
                                currentBuild.result = 'FAILED'
                                return
                            }
                            env.VERSION = tag
                        break
                        case "develop":
                            env.REGISTRY = 'ngp-develop'
                            env.VERSION = 'latest'
                        break
                        case ~/^feature\/.*/:
                            env.REGISTRY = 'ngp-feature'
                            def tag =sh(returnStdout: true, script: "echo $GIT_BRANCH | sed -ne 's/feature.//p'").trim()
                            env.VERSION = tag;
                        break
                        case ~/^release\/.*/:
                            env.REGISTRY = 'ngp-release'
                            env.VERSION = 'latest';
                        break
                    }
                    println("Root Project Name - " + env.PROJECT_NAME)
					println("Version from settings gradle - " + settings.version)
					println("Registry - " + env.REGISTRY)
					println("Tag - " + env.VERSION)
					println("Branch - " + env.GIT_BRANCH)
				}
            }
        }

        stage('Build & Test Binaries') {
            steps {
                sh "./gradlew -Penv=prod build"
            }
        }

        stage('Publish Artifacts') {
            steps {
                sh "./gradlew publish"
            }
        }

        stage('Build & Publish Docker Images - UI') {
            steps {
                script{
                    docker.withRegistry("$HARBOR_REGISTRY_URL", "$HARBOR_CREDS") {
                        docker.build("$REGISTRY/$PROJECT_NAME-ui:$VERSION","$PROJECT_NAME-ui/").push()
                    }
                }
            }
        }

        stage('Build & Publish Docker Images - Service') {
            steps {
                script{
                    docker.withRegistry("$HARBOR_REGISTRY_URL", "$HARBOR_CREDS") {
                        docker.build("$REGISTRY/$PROJECT_NAME-service:$VERSION","$PROJECT_NAME-service/").push()
                    }
                }
            }
        }

    }
}