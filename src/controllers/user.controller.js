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
        return res.status(422).send({
            success: false,
            message:"Todos los campos son requeridos para el registro de usuario.",
            outcome: []
        })
    }
    else if(/^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i.test(data.email) != true){
        //Validación para ver si el email tiene los caracteres/formato valido    
        return res.status(422).send({
            success: false,
            message:"El correo tiene un formato erroneo.",
            outcome: []
        })
    }
    else if(data.password.length < 8){
        //Validación para ver si la contraseña tiene el tamaño minimo requerido
        return res.status(422).send({
            success: false,
            message:"La contraseña debe tener un minimo 8 digitos.",
            outcome: []
        })
    }
    else if(!(roleTypes.includes(data.role))){
        //Validación para verificar el tipo de rol sea: manager, empleado o admin
        return res.status(422).send({
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
            return res.status(400).send({
                success: false,
                message: "Error al intentar crear el usuario, por favor intente nuevamente.",
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
            return res.status(422).send({
                success: false,
                message:"El nombre de usuario y la contraseña son campos obligatorios.",
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
        return res.status(400).send({
            success: false,
            message: "El inicio de sesión no pudo proceder debido a un error",
            outcome: []
        })
    }
}

export const updateUser = async (req, res) =>{
    try{
        //Datos de el usuario que vienen en el cuerpo de la petición
        var datosActualizar = req.body

        // Se valida, por precaucion, que el id del usuario venga en la datosActualizar
        if(!datosActualizar.id){
            return res.status(412).send({
                success: false,
                message:"El identificador del usuario no fue enviado.",
                outcome: []
            }) 
        }

        //Consulta para ver si el usuario existe 
        var existingUser = await User.findOne({_id:datosActualizar.id, is_active: true}).exec() 
        //Validación por si el usuario no existe retorne un mensaje de error
        if(!existingUser){
            return res.status(409).send({
                success: false,
                message:"El usuario al cual se intenta actualizar no existe.",
                outcome: []
            }) 
        }

        // Se valida si la informacion que viene es la clave, el rol,el correo o el username para hacer otras validaciones antes de actualizar
        //Validacion del correo, se verifica el formato y si ya existe
        if(datosActualizar.email != undefined){
            if(/^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i.test(datosActualizar.email) != true){
                return res.status(422).send({
                    success: false,
                    message:"El correo tiene un formato erroneo.",
                    outcome: []
                })
            }

            //Consulta para ver si el correo ya existe 
            const existingEmail = await User.findOne({ email: datosActualizar.email}).exec()
            if(existingEmail){
                //Validación para ver si el email o el username existen el la BD
                return res.status(409).send({
                    success: false,
                    message:"El email colocado ya existe.",
                    outcome: []
                }) 
            }
        }

        //Validacion del nombre de usuario, se verifica si ya existe
        if(datosActualizar.username != undefined){
            //Consulta para ver si alguno registro en la BD tiene el username
            const existingUsername = await User.findOne({ username: datosActualizar.username}).exec() 

            if(existingUsername){
                //Validación para ver si el email o el username existen el la BD
                return res.status(409).send({
                    success: false,
                    message:"El usuario colocado ya existe.",
                    outcome: []
                }) 
            }
        }

        //Validacion de la clave, por si viene una nueva encriptarla
        if(datosActualizar.password != undefined){
            if (datosActualizar.password.length < 8 ) {
                //Validación para ver si la contraseña tiene el tamaño minimo requerido
                return res.status(422).send({
                    success: false,
                    message:"La contraseña debe ser de minimo 8 digitos",
                    outcome: []
                })
        
            }

            //Encriptacion de la calve
            datosActualizar.password = CryptoJS.MD5(datosActualizar.password).toString()
        }

        // Validacion del role para verificar el tipo de rol sea: manager, empleado o admin
        if(datosActualizar.role != undefined){
            if(!(roleTypes.includes(datosActualizar.role))){
                return res.status(422).send({
                    success: false,
                    message:"El rol seleccionado no es valido.",
                    outcome: []
                })
            }
        }
        
        // Actualiza solo los campos que están presentes en datosActualizar
        Object.assign(existingUser,datosActualizar)
    
        //Se intenta hacer la actualización de los datos del usuario, buscando por el ID del mismo y enviando los datos
        User.findByIdAndUpdate(datosActualizar.id,existingUser,{upsert:true}).exec()
        return res.status(200).send({
            success: true,
            message: "La actualización de los datos del usuario fue exitosamente.",
            outcome: []
        })
    }catch(err){
        //Mensaje de error por si no se pudo registrar el usuario
        return res.status(400).send({
            success: false,
            message: "Error al intentar actualizar el usuario, por favor intente nuevamente.",
            outcome: []
        })
    }
    
}

export const deleteUser = async (req, res) => {
    var data = req.body //Datos de el usuario que vienen en el cuerpo de la petición
    var existingUser = await User.findOne({ _id: data.id, is_active: true}).exec() //Consulta para ver si el usuario existe 

    if(!existingUser){
        //Validación por si el usuario no existe retorne un mensaje de error
        return res.status(409).send({
            success: false,
            message:"El usuario seleccionado no existe.",
            outcome: []
        }) 
    }
    else{
        try{
            //Se intenta desactivar el usuario, buscando por el ID del mismo 
            User.findByIdAndUpdate(data.id,{is_active:false}).exec()
            return res.status(200).send({
                success: true,
                message:"Se a desactivado al usuario exitosamente.",
                outcome: []
            }) 
        }catch(err){
            console.log(err)
            //Mensaje de error por si no se pudo registrar el usuario
            return res.status(400).send({
                success: false,
                message: "Error al desactivar al usuario, por favor intente nuevamente",
                outcome: []
            })
        }
    }
}

export const detalleUsuario = async (req, res) => {
    let data = req.params
    
    //Consulta para traer el detalle del usuario
    var existingUser = await User.findById(data.id).exec() 
    if(!existingUser){
        //Validación por si el usuario no existe retorne un mensaje de error
        return res.status(204).send({
            success: false,
            message: "El usuario seleccionado no existe.",
            outcome: []
        })
    }
    else{
        let datos= {
            //JSON de los datos del usuario que seran retornados
            id:existingUser.id,
            name: existingUser.name,
            lastName: existingUser.lastName,
            email: existingUser.email,
            role: existingUser.role,
            username: existingUser.username
        }
       
        //Retorno de mensaje de exito
        return res.status(200).send({
            success: true,
            message: "Se encontro el detalle del usuario exitosamente.",
            outcome: [datos]
        })
    }
}

export const listadoUsuarios = async (req, res) => {
    //Consulta para traer el detalle del usuario
    var usuarios = await User.find({},"name lastName role username email is_active").exec()

    if(usuarios.length == 0){
        //Validación por si el usuario no existe retorne un mensaje de error
        return res.status(204).send({
            success: false,
            message: "No existen usuarios en el sistema.",
            outcome: []
        })
    }
    else{       
        //Retorno de mensaje de exito
        return res.status(200).send({
            success: true,
            message: "Se encontraron todos los usuarios exitosamente.",
            outcome: usuarios
        })
    }
}
