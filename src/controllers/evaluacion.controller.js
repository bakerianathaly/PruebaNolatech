//Models 
import {Evaluacion} from '../models/evaluacion.js'

export const registroEvaluacion = async (req, res) => {
    try{
        //Datos de el Evaluacion que vienen en el cuerpo de la petición
        var data = req.body

        //Consulta para ver si el Evaluacion ya existe con el nombre y el periodo
        const existingEvaluacion = await Evaluacion.findOne({ name: data.name, periodo: data.periodo}).exec()
        if(existingEvaluacion){
            return res.status(409).send({
                success: false,
                message:"Ya existe una evaluación con ese nombre en ese periodo.",
                outcome: []
            }) 
        }
        
        //Se intenta registrar el Evaluacion creando un objeto del modelo, luego de crear el objeto se envia a registrarse en la BD
        //En caso de que no ocurra ningun error se regresa un status 200 de exito
        var newEvaluacion = new Evaluacion(data)
        await newEvaluacion.save()
        return res.status(200).send({
            success: true,
            message: "Se registro el Evaluacion exitosamente,",
            outcome: []
        })
    }catch(err){
        //Mensaje de error por si no se pudo registrar el Evaluacion
        return res.status(204).send({
            success: false,
            message: "Erro al intentar crear el Evaluacion, por favor intente nuevamente.",
            outcome: []
        })
    }
    
}

export const updateEvaluacion = async (req, res) =>{
    try{
        //Datos de el Evaluacion que vienen en el cuerpo de la petición
        var datosActualizar = req.body

        // Se valida, por precaucion, que el id del Evaluacion venga en la datosActualizar
        if(!datosActualizar.id){
            return res.status(409).send({
                success: false,
                message:"El identificador del Evaluacion no fue enviado.",
                outcome: []
            }) 
        }

        //Consulta para ver si el Evaluacion existe 
        var existingEmployee = await Evaluacion.findOne({_id:datosActualizar.id, is_active: true}).exec() 
        //Validación por si el Evaluacion no existe retorne un mensaje de error
        if(!existingEmployee){
            return res.status(409).send({
                success: false,
                message:"El Evaluacion al cual se intenta actualizar no existe.",
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
            const existingEmail = await Evaluacion.findOne({ email: datosActualizar.email}).exec()
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
            const existingDni = await Evaluacion.findOne({ dni: datosActualizar.dni}).exec() 

            if(existingDni){
                //Validación para ver si el email o el dni existen el la BD
                return res.status(409).send({
                    success: false,
                    message:"El dni del Evaluacion registrado ya existe.",
                    outcome: []
                }) 
            }
        }
        
        // Actualiza solo los campos que están presentes en datosActualizar
        Object.assign(existingEmployee,datosActualizar)
    
        //Se intenta hacer la actualización de los datos del Evaluacion, buscando por el ID del mismo y enviando los datos
        Evaluacion.findByIdAndUpdate(datosActualizar.id,existingEmployee,{upsert:true}).exec()
        return res.status(200).send({
            success: true,
            message: "La actualización de los datos del Evaluacion fue exitosamente.",
            outcome: []
        })
    }catch(err){
        //Mensaje de error por si no se pudo registrar el Evaluacion
        return res.status(204).send({
            success: false,
            message: "Erro al intentar actualizar el Evaluacion, por favor intente nuevamente.",
            outcome: []
        })
    }
    
}

export const detalleEvaluacion = async (req, res) => {
    let data = req.params
    
    //Consulta para traer el detalle del Evaluacion
    var existingEvaluacion = await Evaluacion.findById(
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
        
    if(!existingEvaluacion){
        //Validación por si el Evaluacion no existe retorne un mensaje de error
        return res.status(204).send({
            success: false,
            message: "El Evaluacion seleccionado no existe.",
            outcome: []
        })
    }
    else{
        let datos= {
            //JSON de los datos del Evaluacion que seran retornados
            id:existingEvaluacion.id,
            name: existingEvaluacion.name,
            lastName: existingEvaluacion.lastName,
            dni: existingEvaluacion.email,
            email: existingEvaluacion.role,
            department: existingEvaluacion.username,
            yearsExperience: existingEvaluacion.yearsExperience,
            educationInfo: existingEvaluacion.educationInfo,
            pastJobsInfo: existingEvaluacion.pastJobsInfo
        }
       
        //Retorno de mensaje de exito
        return res.status(200).send({
            success: true,
            message: "Se encontro el detalle del Evaluacion exitosamente.",
            outcome: [datos]
        })
    }
}

export const listadoEvaluacions = async (req, res) => {
    //Consulta para traer el detalle del Evaluacion
    const Evaluacions = await Evaluacion.find(
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
 
    if(Evaluacions.length == 0){
        //Validación por si el Evaluacion no existe retorne un mensaje de error
        return res.status(204).send({
            success: false,
            message: "No existen Evaluacions en el sistema.",
            outcome: []
        })
    }
    else{       
        //Retorno de mensaje de exito
        return res.status(200).send({
            success: true,
            message: "Se encontraron todos los Evaluacions exitosamente.",
            outcome: Evaluacions
        })
    }
}
