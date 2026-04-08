# syntax=docker/dockerfile:1.7

##############################
# 1️⃣ BUILD STAGE
##############################
FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /build
COPY .env .env
# Cache dependencies first
ENV SPRING_CONFIG_IMPORT=optional:file:.env

COPY pom.xml .
RUN --mount=type=cache,target=/root/.m2 \
    mvn -B -q dependency:go-offline

# Copy source
COPY src ./src

# Build jar
RUN --mount=type=cache,target=/root/.m2 \
    mvn -q -DskipTests package


##############################
# 2️⃣ RUNTIME STAGE (OPTIMIZED)
##############################
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Copy jar
COPY --from=builder /build/target/*.jar app.jar

# JVM container optimizations
ENV JAVA_OPTS="\
-XX:+UseContainerSupport \
-XX:MaxRAMPercentage=75 \
-XX:+AlwaysActAsServerClassMachine \
-XX:+UseStringDeduplication \
-XX:+OptimizeStringConcat \
-Djava.security.egd=file:/dev/./urandom \
-Dspring.lifecycle.timeout-per-shutdown-phase=30s \
"

# Graceful shutdown (important for Eureka + DB)
STOPSIGNAL SIGTERM

EXPOSE 7000

ENTRYPOINT ["sh","-c","java $JAVA_OPTS -jar app.jar"]