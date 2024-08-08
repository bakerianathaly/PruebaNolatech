//Models 
import {User} from '../models/user.js'
import jwt from 'jsonwebtoken'
const SECRET_KEY="secretkey123456"

export const signUp = async (req, res) => {
    var data = req.body //Datos de el usuario que vienen en el cuerpo de la petición
    var existingUser = await User.findOne({ email: data.email}).exec() //Consulta para ver si el correo ya existe 
    var existingUsername = await User.findOne({ username: data.username}).exec() //Consulta para ver si alguno registro en la BD tiene el username

    if(existingUser || existingUsername){
        //Validación para ver si el email o el username existen el la BD
        return res.status(409).send({
            status: "409",
            response:"Conflict",
            message:"El email o el usuario ya existe"
        }) 
    }
    else if(data.name == "" || data.lastName == "" || data.password == "" || data.email == "" || data.username == "" || data.cedula == ""){
        //Validación para validar que no se hayan enviado ningun campo vacio de los que son requeridos
        return res.status(406).send({
            status: "406",
            response:"Not Acceptable",
            message:"Todos los campos son requeridos obligatorios para el registro de usuario"
        })
    }
    else if(/^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i.test(data.email) != true){
        //Validación para ver si el email tiene los caracteres/formato valido    
        return res.status(406).send({
            status: "406",
            response:"Not Acceptable",
            message:"El correo tiene  un formato erroneo"
        })
    }
    else if(data.password.length < 8){
        //Validación para ver si la contraseña tiene el tamaño minimo requerido
        return res.status(406).send({
            status: "406",
            response:"Not Acceptable",
            message:"La contraseña debe ser de minimo 8 digitos"
        })
    }
    else{
        try{
            //Se intenta registrar el usuario creando un objeto del modelo, luego de crear el objeto se envia a registrarse en la BD
            //En caso de que no ocurra ningun error se regresa un status 200 de exito
            var newUser = new User(data)
            var register = await newUser.save()
            return res.status(200).send({
                status: "200",
                response:"OK",
                message: "Registro exitoso",
                id: register._id
            })
        }catch(err){
            //Mensaje de error por si no se pudo registrar el usuario
            return res.status(404).send({
                status: "404",
                response:"Not Found",
                message: "El registro no pudo proceder debido a un error"
            })
        }
    }
}

export const loggedIn = async (req, res) =>{
    var data = req.body //Datos de el usuario que vienen en el cuerpo de la petición
    var user = await User.findOne({username: data.username}).exec() //Consulta para ver si el usuario existe 

    if(data.username == "" || data.password == "" ){
        //Validación para comprobar si los datos no vinieron vacios
        return res.status(406).send({
            status: "406",
            response:"Not Acceptable",
            message:"El el nombre de usuario y la contraseña son campos obligatorios"
        })
    }
    else if(!user){
        //Validación por si el usuario no existe retorne un mensaje de error
        return res.status(409).send({
            status: "409",
            response:"Conflict",
            message:"El email o la contraseña son incorrectos"
        }) 
    }
    else{
        try{
            var enteredPassword=data.password

            if((enteredPassword == user.password)){
                //Validación para comprobar si la contraseña en la BD es la misma que la coloco el usuario

                var expiresIn= "7d" //Asignación del tiempo de expiración del token, de 7 días
                var accessToken=jwt.sign({id:user.id},SECRET_KEY,{expiresIn:expiresIn}) //Generación del JWT con la fecha de expiración, la clave y el secret key

                let datos= {
                    //JSON de los datos del usuario que seran retornados, incluyendo el token y su tiempo de expiración
                    id:user.id,
                    name: user.name,
                    lastName: user.lastName,
                    email: user.email,
                    cedula: user.cedula,
                    username: user.username,
                    accessToken: accessToken,
                    expiresIn: expiresIn
                }
               
                //Retorno de mensaje de exito
                return res.status(200).send({
                    datos,
                    status: "200",
                    response:"OK",
                    message: "Inicio de sesión exitoso" 
                })
            
            }
            else{
                //Retorno de mensaje si ocurrio algún error
                return res.status(409).send({
                    status: "409",
                    response:"Conflict",
                    message:"El email o la contraseña son incorrectos"
                })   
            }
        
        }catch(err){
            //Retorno de mensaje si ocurrio algún error
            return res.status(404).send({
                status: "404",
                response:"Not Found",
                message: "El inicio de sesión a fallado debido a un error"
            })
        }
    }
}

export const updateUser = async (req, res) =>{
    var data = req.body //Datos de el usuario que vienen en el cuerpo de la petición
    var id = data.id //ID del usuario en la BD
    var existingUser = await User.findById(id).exec() //Consulta para ver si el usuario existe 

    if(!existingUser){
        //Validación por si el usuario no existe retorne un mensaje de error
        return res.status(409).send({
            status: "409",
            response:"Conflict",
            message:"El usuario no existe"
        }) 
    }
    else if(data.name == "" || data.lastName == "" || data.email == "" || data.username == "" || data.password == ""){
        //Validación para comprobar si los datos no vinieron vacios
        return res.status(406).send({
            status: "406",
            response:"Not Acceptable",
            message:"Todos los campos son requeridos para la actualizació del usuario"
        })
    }
    else if(/^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i.test(data.email) != true){
        //Validación para ver si el email tiene los caracteres/formato valido    
        return res.status(406).send({
            status: "406",
            response:"Not Acceptable",
            message:"El correo tiene  un formato erroneo"
        })
    }
    else if (data.password.length < 8 ) {
        //Validación para ver si la contraseña tiene el tamaño minimo requerido
        return res.status(406).send({
            status: "406",
            response:"Not Acceptable",
            message:"La contraseña debe ser de minimo 8 digitos"
        })

    }
    else{
        try{
            //Se intenta hacer la actualización de los datos del usuario, buscando por el ID del mismo y enviando los datos
            User.findByIdAndUpdate(id,data,{upsert:true},function(err, doc) {  
                if (err) {
                    //Validación por si ocurrio algún error dentro de la actualizació con mongoose
                    return res.send(500, {error: err});
                }
                //Si no hubo ningun error dentro con mongoose y la actualización, se retorna el mensaje de exito
                return res.status(200).send({
                    status: "200",
                    response:"OK",
                    message: "La actualizacion a sido exitosa",
                })
            })
        }catch(err){
            //Retorno de mensaje de error en caso de que el intento de actualizar no funcionara
            return res.status(404).send({
                status: "404",
                response:"Not Found",
                message: "La actualización no pudo proceder debido a un error"
            })
        }
    }
}

export const deleteUser = async (req, res) => {
    var data = req.body //Datos de el usuario que vienen en el cuerpo de la petición
    var existingUser = await User.findOne({ email: data.email}).exec() //Consulta para ver si el usuario existe 

    if(!existingUser){
        //Validación por si el usuario no existe retorne un mensaje de error
        return res.status(409).send({
            status: "409",
            response:"Conflict",
            message:"El usuario no existe"
        }) 
    }
    else{
        try{
            //Se intenta eliminar el usuario, buscando por el ID del mismo 
            User.findByIdAndRemove(existingUser._id).exec((err, doc) => {
                if (err) {
                    //Validación por si ocurrio algún error al eliminar el usuario con mongoose
                    return res.send(500, {error: err});
                } 
                else {
                    //Si no hubo ningun error dentro con mongoose y la eliminación del registro se retorna el mensaje de exito
                    return res.status(200).send({
                        status: "200",
                        response:"OK",
                        message: "Se a eliminado al usuario",
                    })
                }
            });
        }catch(err){
            //Retorno de mensaje de error en caso de que el intento de eliminar el registro no funcionara
            return res.status(404).send({
                status: "404",
                response:"Not Found",
                message: "No se pudo eliminar al usuario debido a un error"
            })
        }
    }
}

export const get = async (req, res) => {
    let data = req.params
    var existingUser = await User.findOne({ id: data.id}).exec() //Consulta para ver si el usuario existe 

    if(!existingUser){
        //Validación por si el usuario no existe retorne un mensaje de error
        return res.status(409).send({
            status: "409",
            response:"Conflict",
            message:"El usuario no existe"
        }) 
    }
    else{
        let datos= {
            //JSON de los datos del usuario que seran retornados
            id:existingUser.id,
            name: existingUser.name,
            lastName: existingUser.lastName,
            email: existingUser.email,
            cedula: existingUser.cedula,
            username: existingUser.username
        }
       
        //Retorno de mensaje de exito
        return res.status(200).send({
            datos,
            status: "200",
            response:"OK",
            message: "Inicio de sesión exitoso" 
        })
    }
}
