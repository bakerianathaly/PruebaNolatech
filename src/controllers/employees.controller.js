//Models 
import {Employees} from '../models/employees.js'

export const registroEmpleado = async (req, res) => {
    try{
        //Datos de el empleado que vienen en el cuerpo de la petición
        var data = req.body

        //Consulta para ver si el empleado ya existe
        const existingEmployee = await Employees.findOne({ dni: data.dni}).exec()
        if(existingEmployee){
            return res.status(409).send({
                success: false,
                message:"Ya existe un empleado con el dni colocado.",
                outcome: []
            }) 
        }
        
        //Validación para ver si el email tiene los caracteres/formato valido    
        if(/^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i.test(data.email) != true){
            return res.status(406).send({
                success: false,
                message:"El correo tiene un formato erroneo.",
                outcome: []
            })
        }
        
        //Se intenta registrar el empleado creando un objeto del modelo, luego de crear el objeto se envia a registrarse en la BD
        //En caso de que no ocurra ningun error se regresa un status 200 de exito
        var newEmployees = new Employees(data)
        await newEmployees.save()
        return res.status(200).send({
            success: true,
            message: "Se registro el empleado exitosamente,",
            outcome: []
        })
    }catch(err){
        //Mensaje de error por si no se pudo registrar el empleado
        return res.status(204).send({
            success: false,
            message: "Error al intentar crear el empleado, por favor intente nuevamente.",
            outcome: []
        })
    }
    
}

export const updateEmpleado = async (req, res) =>{
    try{
        //Datos de el empleado que vienen en el cuerpo de la petición
        var datosActualizar = req.body

        // Se valida, por precaucion, que el id del empleado venga en la datosActualizar
        if(!datosActualizar.id){
            return res.status(409).send({
                success: false,
                message:"El identificador del empleado no fue enviado.",
                outcome: []
            }) 
        }

        //Consulta para ver si el empleado existe 
        var existingEmployee = await Employees.findOne({_id:datosActualizar.id, is_active: true}).exec() 
        //Validación por si el empleado no existe retorne un mensaje de error
        if(!existingEmployee){
            return res.status(409).send({
                success: false,
                message:"El empleado al cual se intenta actualizar no existe.",
                outcome: []
            }) 
        }

        // Se valida si la informacion que viene es el correo o el dni para hacer otras validaciones antes de actualizar
        //Validacion del correo, se verifica el formato y si ya existe
        if(datosActualizar.email != undefined){
            if(/^(?:[^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*|"[^\n"]+")@(?:[^<>()[\].,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,63}$/i.test(datosActualizar.email) != true){
                //Validación para ver si el email tiene los caracteres/formato valido    
                return res.status(406).send({
                    status: "406",
                    response:"Not Acceptable",
                    message:"El correo tiene  un formato erroneo"
                })
            }

            //Consulta para ver si el correo ya existe 
            const existingEmail = await Employees.findOne({ email: datosActualizar.email}).exec()
            if(existingEmail){
                //Validación para ver si el email o el username existen el la BD
                return res.status(409).send({
                    success: false,
                    message:"El email colocado ya existe.",
                    outcome: []
                }) 
            }
        }

        //Validacion del dni, se verifica si ya existe
        if(datosActualizar.dni != undefined){
            //Consulta para ver si alguno registro en la BD tiene el dni
            const existingDni = await Employees.findOne({ dni: datosActualizar.dni}).exec() 

            if(existingDni){
                //Validación para ver si el email o el dni existen el la BD
                return res.status(409).send({
                    success: false,
                    message:"El dni del empleado registrado ya existe.",
                    outcome: []
                }) 
            }
        }
        
        // Actualiza solo los campos que están presentes en datosActualizar
        Object.assign(existingEmployee,datosActualizar)
    
        //Se intenta hacer la actualización de los datos del empleado, buscando por el ID del mismo y enviando los datos
        Employees.findByIdAndUpdate(datosActualizar.id,existingEmployee,{upsert:true}).exec()
        return res.status(200).send({
            success: true,
            message: "La actualización de los datos del empleado fue exitosamente.",
            outcome: []
        })
    }catch(err){
        //Mensaje de error por si no se pudo registrar el empleado
        return res.status(204).send({
            success: false,
            message: "Error al intentar actualizar el empleado, por favor intente nuevamente.",
            outcome: []
        })
    }
    
}

export const detalleEmpleado = async (req, res) => {
    let data = req.params
    
    //Consulta para traer el detalle del empleado
    var existingEmployees = await Employees.findById(
            data.id, 
            "name\
            lastName\
            dni\
            department\
            email\
            is_active\
            yearsExperience\
            educationInfo.schoolName\
            educationInfo.graduationYear\
            educationInfo.degree\
            pastJobsInfo.jobName\
            pastJobsInfo.yearWorkingThere\
            pastJobsInfo.jobDescription"
        ).exec()
        
    if(!existingEmployees){
        //Validación por si el empleado no existe retorne un mensaje de error
        return res.status(204).send({
            success: false,
            message: "El empleado seleccionado no existe.",
            outcome: []
        })
    }
    else{
        //Retorno de mensaje de exito
        return res.status(200).send({
            success: true,
            message: "Se encontro el detalle del empleado exitosamente.",
            outcome: [existingEmployees]
        })
    }
}

export const listadoEmpleados = async (req, res) => {
    //Consulta para traer el detalle del empleado
    const empleados = await Employees.find(
            {}, 
            "name \
            lastName \
            dni \
            department \
            email \
            is_active \
            yearsExperience \
            educationInfo.schoolName \
            educationInfo.graduationYear \
            educationInfo.degree \
            pastJobsInfo.jobName \
            pastJobsInfo.yearWorkingThere \
            pastJobsInfo.jobDescription"
        ).exec();
 
    if(empleados.length == 0){
        //Validación por si el empleado no existe retorne un mensaje de error
        return res.status(204).send({
            success: false,
            message: "No existen empleados en el sistema.",
            outcome: []
        })
    }
    else{       
        //Retorno de mensaje de exito
        return res.status(200).send({
            success: true,
            message: "Se encontraron todos los empleados exitosamente.",
            outcome: empleados
        })
    }
}
