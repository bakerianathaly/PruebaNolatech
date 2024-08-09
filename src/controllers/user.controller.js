//Models 
import {User} from '../models/user.js'
import jwt from 'jsonwebtoken'
import CryptoJS from 'crypto-js'
import {roleTypes} from '../utils/common.js'
const SECRET_KEY= process.env.SECRET_KEY

export const registroUsuario = async (req, res) => {
    //Datos de el usuario que vienen en el cuerpo de la petición
    var data = req.body

    //Se cambia el rol del usuario a letras mayusculas
    data.role = data.role.toUpperCase()

    //Consulta para ver si el correo ya existe 
    const existingUser = await User.findOne({ email: data.email}).exec()

    //Consulta para ver si alguno registro en la BD tiene el username
    const existingUsername = await User.findOne({ username: data.username}).exec() 

    if(existingUser || existingUsername){
        //Validación para ver si el email o el username existen el la BD
        return res.status(409).send({
            success: false,
            message:"El email o el usuario ya existe.",
            outcome: []
        }) 
    }
    else if(data.name == "" || data.lastName == "" || data.password == "" || data.email == "" || data.username == "" || data.role == ""){
        //Validación para validar que no se hayan enviado ningun campo vacio de los que son requeridos
        return res.status(406).send({
            success: false,
            message:"Todos los campos son requeridos para el registro de usuario.",
            outcome: []
        })
    }
    else if(/^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i.test(data.email) != true){
        //Validación para ver si el email tiene los caracteres/formato valido    
        return res.status(406).send({
            success: false,
            message:"El correo tiene un formato erroneo.",
            outcome: []
        })
    }
    else if(data.password.length < 8){
        //Validación para ver si la contraseña tiene el tamaño minimo requerido
        return res.status(406).send({
            success: false,
            message:"La contraseña debe tener un minimo 8 digitos.",
            outcome: []
        })
    }
    else if(!(roleTypes.includes(data.role))){
        //Validación para verificar el tipo de rol sea: manager, empleado o admin
        return res.status(406).send({
            success: false,
            message:"El rol seleccionado no es valido.",
            outcome: []
        })
    }
    else
    {
        try{
            //Encriptacion de la calve
            data.password = CryptoJS.MD5(data.password).toString()

            //Se intenta registrar el usuario creando un objeto del modelo, luego de crear el objeto se envia a registrarse en la BD
            //En caso de que no ocurra ningun error se regresa un status 200 de exito
            var newUser = new User(data)
            await newUser.save()
            return res.status(200).send({
                success: true,
                message: "Se registro el usuario exitosamente,",
                outcome: []
            })
        }catch(err){
            //Mensaje de error por si no se pudo registrar el usuario
            return res.status(404).send({
                success: false,
                message: "Erro al intentar crear el usuario, por favor intente nuevamente.",
                outcome: []
            })
        }
    }
}

export const login = async (req, res) => {
    //Datos de el usuario que vienen en el cuerpo de la petición
    var data = req.body
    try{
        //Validación para comprobar si los datos no vinieron vacios
        if(data.username == "" || data.password == "" ){
            return res.status(406).send({
                success: false,
                message:"El el nombre de usuario y la contraseña son campos obligatorios.",
                outcome: []
            })
        }
        
        // Se busca al usuario por el username y validando que este activo en el sistema
        let existingUser = await User.findOne({username: data.username, is_active: true}).exec()
        if(!existingUser){
            return res.status(409).send({
                success: false,
                message:"Usuario o contraseña incorrectos.",
                outcome: []
            }) 
        }
  
        // Se encripta la clave para compararla con la que se encontro en la DB
        data.password = CryptoJS.MD5(data.password).toString()

        if (data.password != existingUser.password){
            return res.status(409).send({
                success: false,
                message:"Usuario o contraseña incorrectos.",
                outcome: []
            }) 
        }
        
        //Generación del JWT con la fecha de expiración, la clave y el secret key
        let token = jwt.sign({
            id:existingUser._id,
            role:existingUser.role,
            username:existingUser.username
        },SECRET_KEY) 
        
        return res.status(200).send({
            success:true,
            message: `Bienvenido ${existingUser.name} ${existingUser.lastName} al sistema.`,
            outcome: [{
                "username": existingUser.username,
                "token": token
            }]
            
        })
    }catch(err){
        console.log(err)
        //Mensaje de error por si no se pudo registrar el usuario
        return res.status(404).send({
            success: false,
            message: "El inicio de sesión no pudo proceder debido a un error",
            outcome: []
        })
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
