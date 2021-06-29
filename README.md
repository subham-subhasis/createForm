# Onboarding

This is a project created using NGP Starter template v1.4.0.

## Folder Structure

```
.
|-- at-setup => Contains setup to be used for testing
|-- coding-standards => Contains guidelines for developers
|-- onboarding-angular-api => Builds angular library using OpenAPI
|-- onboarding-api => Contains the OpenAPI specification, for creating RESTful endpoints for application and to connect to common-services API.
|-- onboarding-service => Service spring boot application
|   |-- scripts => Couple of scripts to start DB and service JAR
|   `-- src => Sources
`-- onboarding-ui => Angular front-end
```

**_Node: Please ensure you do all actions from ngp-dev-env docker. Application may not work as expected otherwise._**

## Using Test Setup

1. Build the application and docker images  
   `./build.sh`

2. From `at-setup` folder - run:  
   `./onboarding` and follow instructions

## Developer Setup
Start `common-service`'s service before starting the application. `common-service` helps in registering the application with `keycloak`.  
To start `common-service`, run `./common-service start -u` in `common-service/common-service-service/script/`.

1. Build entire application  
   `./gradlew`  
   This starts `postgres` and `keycloak` docker containers and adds host entries in docker container.
2. To start service either run it from eclipse or run script file in `./service/script/onboarding` directory. Check `--help` for various options used.
3. To start UI, check `package.json` in onboarding-ui directory, for various options. Run `npm run start:docker`.  

Go to "http://onboarding-app:4200" from host machine (not the docker container - we do not know how to run browser from there yet).

## Creating a new NGP Module

Run command-

- `./gradlew -PapplicationName="<application-name-with-hyphen>" createApplication`  
  It will create a new project at location '../<project-name-with-hyphen>'. You can override the `output` folder, `packageName` and `classPrefix` by using `-P` options. You have to initialize a `git` repository(you can use `git-init` script in the main folder)

  **_Note:Do not use reserverd keywords; such as new, abstract, var etc., in project name_**

## Ports

`ngp-dev-env` docker setup exposes port ranges 8080-8089 and 4200-4209.

- `onboarding-template` uses 8080 and 4200 (standard ports for angular and spring boot)
- `common-services` uses 8081 and 4201
- `user-management` uses 8082 and 4202

You can chose some other ports, so that your application can run along with `common-services`. For changing the port, change the port numbers
in the following files:

onboarding-service/src/main/resources/application.properties: server.port,ngp.register.service.url
onboarding-api/onboarding.json: "url"
onboarding-ui/angular.json: "port"
onboarding-ui/src/assets/conf/api.conf.json: apiUrl

## Coding guidelines

Refer ./coding-standards for guidelines to be followed. It includes guidelines for

- Angular
- Java
- REST API
- Database naming
- GIT branching and naming
