# Prueba-backend-asistensi

NOTA: En el update y el get colocarl el ID del usuario que se retorna con la petición del registro

Create: /signup
    Metodo POST
    url para la probar: https://blooming-mountain-45889.herokuapp.com/signup
    Datos de prueba: 
    {
        "name": "Nathaly",
        "lastName": "Bakerian",
        "password": "12345678",
        "email": "bakerian@gmail.com",
        "username": "bakerianathaly",
        "cedula": "26055828"
    }

Update: /update
    Metodo POST
    url para la probar: https://blooming-mountain-45889.herokuapp.com/update
    Datos de prueba: 
    {
        "id": "",
        "name": "Nathaly Sofia",
        "lastName": "Scovino",
        "password": "12345678",
        "email": "prueba1@gmail.com",
        "username": "bakerianathaly",
        "cedula": "26055828"
    }

Login: /login
    Metodo POST
    url para la probar: https://blooming-mountain-45889.herokuapp.com/login
    Datos de prueba: 
    {
        "password": "12345678",
        "username": "bakerianathaly"
    }

Delete: /delete

    Metodo POST
    url para la probar: https://blooming-mountain-45889.herokuapp.com/delete
    Datos de prueba: 
    {
        "email": "prueba1@gmail.com"
    }

Consulta: /get

    Metodo GET
    url para la probar: https://blooming-mountain-45889.herokuapp.com/get?id=

