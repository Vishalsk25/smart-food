FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copy maven wrapper
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Build application
COPY src src
RUN chmod +x mvnw && ./mvnw clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

COPY --from=0 /app/target/smartfood-api-1.0.0.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
