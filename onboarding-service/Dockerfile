FROM openjdk:8-jre-alpine
RUN apk add --update bash && rm -rf /var/cache/apk/*
RUN apk upgrade --update

RUN mkdir -p /deployments/config && mkdir /deployments/lib

VOLUME /deployments/config
VOLUME /deployments/lib

ADD build/libs/*.jar /deployments/lib/app.jar

ADD entrypoint.sh /entrypoint.sh
ADD run.sh /run.sh
 
RUN chmod +x entrypoint.sh run.sh /deployments/lib/app.jar


ENTRYPOINT ["./entrypoint.sh"]
CMD ["./run.sh"]
