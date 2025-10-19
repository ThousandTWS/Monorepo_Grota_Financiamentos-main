FROM maven:3.8.5-openjdk-17-slim AS build
WORKDIR /build
COPY . /build
RUN mvn clean package -DskipTests

FROM openjdk:21-jdk-slim
RUN mkdir /app
WORKDIR /app
COPY --from=build ./build/target/*.jar /app/app.jar
CMD ["java", "-jar", "/app/app.jar"]
