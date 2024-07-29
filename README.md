
# JEDANK-SECURITY

Sistema de monitoreo de dispositivos Android.


## Dependencias para el backend.

[![Java Version](https://img.shields.io/badge/Java-17-green.svg)](https://docs.oracle.com/en/java/javase/11/)
[![Spring Boot Version](https://img.shields.io/badge/Spring%20Boot-3.2.0-green.svg)](https://spring.io/projects/spring-boot)
[![Spring Security Version](https://img.shields.io/badge/Spring%20Security-green.svg)](https://spring.io/projects/spring-security)
[![JWT Version](https://img.shields.io/badge/JWT-0.11.5-green.svg)](https://github.com/jwtk/jjwt)
[![Swagger Version](https://img.shields.io/badge/Swagger-3.0.0-green.svg)](https://swagger.io/)
[![Lombok Version](https://img.shields.io/badge/Lombok-1.18.26-green.svg)](https://projectlombok.org/)
[![Maven Version](https://img.shields.io/badge/Maven-4.0.0-green.svg)](https://maven.apache.org/)
[![WebSockets Version](https://img.shields.io/badge/WebSockets-3.2.4-green.svg)](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets)

## Requisitos Previos

Asegúrate de tener instalado Node.js y npm en tu sistema. Además, necesitarás Angular CLI para ejecutar este proyecto.
- [ Node.js v22.2.0](https://nodejs.org/en)
- [Angular 18.0.1](https://docs.oracle.com/en/java/javase/11/)
Recuerda tener instalado la base de datos PostgreSQL.
- [PostgreSQL 14.2](https://www.postgresql.org/about/news/postgresql-142-136-1210-1115-and-1020-released-2402/)

## Empezar en el backend
Puede ejecutar este proyecto en su máquina local siguiendo los pasos a continuación.

1. Clonar el repositorio
    ```bash
   git clone "https://github.com/franko21/jedank-back.git"
    ```
2. Instalar las dependencias
   ```bash
   mvn install
   ```
3. Correr el proyecto
    ```bash
   mvn spring-boot:run

## Empezar en el frontend
Puede ejecutar este proyecto en su máquina local siguiendo los pasos a continuación.

1. Clonar el repositorio
    ```bash
   git clone "https://github.com/DavidGuambana/jedank.git"
    ```
2. Instalar las dependencias
   ```bash
   npm install
   ```
3. Run the project
    ```bash
   ng serve -o

## Empezar en el la aplicación móvil Jedank

1. Clonar el repositorio
    ```bash
   git clone "https://github.com/DavidGuambana/jedank-app.git"
    ```
2. Sincronizar y Construir el Proyecto:

Una vez que el proyecto esté cargado en Android Studio, espera a que Android Studio sincronice automáticamente el proyecto con Gradle.
Si se te pide actualizar el plugin de Gradle o las herramientas de Android, sigue las instrucciones para actualizar.

3. Configurar Dispositivo o Emulador:

Conecta un dispositivo Android a tu computadora a través de USB (asegurándote de tener la depuración USB habilitada en el dispositivo y los drivers correctos instalados) o configura un emulador Android en Android Studio.

4. Seleccionar Dispositivo y Ejecutar:

En la barra de herramientas de Android Studio, selecciona tu dispositivo o emulador desde la lista desplegable de dispositivos conectados.
Haz clic en el botón de "Run" (Ejecutar) para compilar y ejecutar la aplicación en el dispositivo o emulador seleccionado.