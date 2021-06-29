#!/bin/bash


# Script used to launch service from at-setup Dockerfile

java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005  -Dspring.config.location=/deployments/config/  -jar /deployments/lib/app.jar

