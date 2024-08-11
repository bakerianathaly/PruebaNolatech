# Nolatech prueba backend - Elaborada por Nathaly Bakerian Scovino

Desarrollar el backend de una API RESTful para un sistema de evaluación 360 grados de empleados remotos en una empresa de desarrollo de aplicaciones.

## Swagger

Para poder acceder a la documentacion Swagger se debe entrar a traves de esta URL una vez el proyecto 
este levantado:

    - http://localhost:3005/api-docs/

## Features

- CRUD de usuarios
- CRUD de empleados
- CRUD de preguntas
- CRUD de evaluaciones
- Envio de correo al empleado al momento de asignar una nueva evaluacion para su respuesta

## Tech Stack

- Node
- Express
- Javascript
- Mongoose/MongoDB
- Docker
- Swager

## Getting Started

El proyecto esta dockerizado para su facil escalamiento e instalación en distintas maquinas. Por lo que 
su unico requisiro es tener instalado y corriendo "Docker" y "npm" para poder levantar el proyecto

1. Clonar el repositorio:

   git clone https://github.com/bakerianathaly/PruebaNolatech.git

2. Instalar dependendias:  

   npm install
   
3. Levantar el proyecto en modo DEV:

   docker-compose -f docker-compose.local.yml up --build

4. El proyecto se levantara en el puerto 3005: 

    http://localhost:3005


# Testing

Para correr las pruebas se debe ejecutar el comando: 

# Explicación de la estructura del proyecto y decisiones de diseño

Este proyecto ha sido estructurado de forma modular para facilitar la mantenibilidad, escalabilidad y comprensibilidad del código. A continuación, se detalla la función de cada directorio:

/src
    Raíz del proyecto: Contiene todo el código fuente necesario para la aplicación.

/config:
    Almacena los archivos de configuración del proyecto, como conexiones a bases de datos, y otras configuraciones personalizables como el Swagger.

/controllers:
    Contiene los controladores, que son responsables de manejar las solicitudes HTTP entrantes, interactuar con los modelos y devolver las respuestas. Esta separación de responsabilidades mejora la organización del código y facilita las pruebas.

/middlewares:
    Todas las funciones que se ejecutan antes y después de las rutas. Se utilizan para tareas como autenticación, autorización, validación de datos, etc.

/models:
    Carpeta con los modelos o schemas de mongo

/routes:
    Contiene las rutas de la aplicación y asocian las rutas a los controladores correspondientes.

/utils:
    Almacena funciones y utilidades que son utilizadas en diferentes partes del proyecto, como una funcion para 
    el envio de correos o unos enumerados que se llaman en distintas partes del codigo.

/tests
    Contiene las pruebas unitarias para asegurar la calidad del código y detectar errores temprano en el desarrollo.