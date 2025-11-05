# Versão com imagens mais compatíveis
FROM maven:3.8.5-eclipse-temurin-17 AS build
WORKDIR /build
COPY . /build
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build ./build/target/*.jar /app/app.jar
CMD ["java", "-jar", "/app/app.jar"]