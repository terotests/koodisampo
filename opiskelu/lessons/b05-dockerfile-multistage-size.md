# Tuotantoimage on 2 GB koska build-työkalut mukana runtime-kuvassa. Ratkaisu?

## Tilanne
Tuotantoimage 2 GB — mukana Maven, JDK ja testiraportit runtime-stagessa.

## Ratkaisu
**Multi-stage build — käännä builder-stagessa, kopioi vain binary final-stageen.**

```dockerfile
FROM maven:3.9-eclipse-temurin-21 AS build
COPY . .
RUN mvn -q package -DskipTests

FROM eclipse-temurin:21-jre-alpine
COPY --from=build /app/target/app.jar /app.jar
USER 10001
ENTRYPOINT ["java","-jar","/app.jar"]
```

Multi-stage erottaa build- ja runtime-ympäristöt — Docker docs.

## Käytännössä
Poista devDependencies builder-stagessa. Skannaa lopullinen image, ei builderia.

[Lue lisää](https://docs.docker.com/build/building/multi-stage/)
