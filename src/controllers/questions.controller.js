//Models 
import {Preguntas} from '../models/questions.js'
import {questionTypes} from '../utils/common.js'

export const registroPregunta = async (req, res) => {
    try{
        //Datos de la pregunta que vienen en el cuerpo de la petición
        var data = req.body
        data.tipo = data.tipo.toUpperCase()
        //Validacion para que todos los campos esten llenos
        if(data.question == "" || data.tipo == "" || data.escala == ""){
            return res.status(406).send({
                success: false,
                message:"Todos los campos son requeridos para el registro de una pregunta.",
                outcome: []
            })
        }

        //Validacion apra verificar que el tipo de pregunta sea los validos
        if(!(questionTypes.includes(data.tipo))){
            return res.status(406).send({
                success: false,
                message:"El tipo de pregunta seleccionado no es valido.",
                outcome: []
            })
        }

        //Validacion para verificar que si el tipo es "MULTIPLE" tiene que haber mas de una escala de medicion
        if(data.tipo.toUpperCase() == 'MULTIPLE' && data.escala.length < 2){
            return res.status(406).send({
                success: false,
                message:"Para una pregunta de seleccion multiple debe existir más de una escala.",
                outcome: []
            })
        }

        //Se intenta registrar la pregunta creando un objeto del modelo, luego de crear el objeto se envia a registrarse en la BD
        //En caso de que no ocurra ningun error se regresa un status 200 de exito
        var newPreguntas = new Preguntas(data)
        await newPreguntas.save()
        return res.status(200).send({
            success: true,
            message: "Se registro la pregunta exitosamente,",
            outcome: []
        })
    }catch(err){
        //Mensaje de error por si no se pudo registrar la pregunta
        return res.status(204).send({
            success: false,
            message: "Error al intentar crear la pregunta, por favor intente nuevamente.",
            outcome: []
        })
    }
    
}

export const updatePregunta = async (req, res) =>{
    try{
        //Datos de la pregunta que vienen en el cuerpo de la petición
        var datosActualizar = req.body

        // Se valida, por precaucion, que el id dla pregunta venga en la datosActualizar
        if(!datosActualizar.id){
            return res.status(409).send({
                success: false,
                message:"El identificador dla pregunta no fue enviado.",
                outcome: []
            }) 
        }

        //Consulta para ver si la pregunta existe 
        var existingQuestion = await Preguntas.findOne({_id:datosActualizar.id, is_active: true}).exec() 
        //Validación por si la pregunta no existe retorne un mensaje de error
        if(!existingQuestion){
            return res.status(409).send({
                success: false,
                message:"La pregunta a la cual se intenta actualizar no existe.",
                outcome: []
            }) 
        }

        // Se valida si la informacion que viene es el tipo o la escala para hacer otras validaciones antes de actualizar
        //Validacion del tipo, para ver si es valido
        if(datosActualizar.tipo != undefined){
            datosActualizar.tipo = datosActualizar.tipo.toUpperCase()
            //Validacion apra verificar que el tipo de pregunta sea los validos
            if(!(questionTypes.includes(datosActualizar.tipo))){
                return res.status(406).send({
                    success: false,
                    message:"El tipo de pregunta seleccionado no es valido.",
                    outcome: []
                })
            }
        }
        //Validacion de la escala, para ver si la corresponde con el tipo
        if(datosActualizar.escala != undefined){
            //Validacion para verificar que si el tipo es "MULTIPLE" tiene que
            // haber mas de una escala de medicion

            // Se hace la validacion 2 veces:

            // 1 vez por si dentro de lo que se quiere actualizar viene el valor tipo
            if(datosActualizar.tipo != undefined && 
                datosActualizar.tipo.toUpperCase() == 'MULTIPLE' && 
                datosActualizar.escala.length < 2
            ){
                return res.status(406).send({
                    success: false,
                    message:"Para una pregunta de seleccion multiple debe existir más de una escala.",
                    outcome: []
                })
            }

            // 2 vez por si el valor tipo no viene, entonces validar con lo que tiene en la DB
            if(existingQuestion.tipo.toUpperCase() == 'MULTIPLE' && datosActualizar.escala.length < 2){
                return res.status(406).send({
                    success: false,
                    message:"Para una pregunta de seleccion multiple debe existir más de una escala.",
                    outcome: []
                })
            }
        }
        
        // Actualiza solo los campos que están presentes en datosActualizar
        Object.assign(existingQuestion,datosActualizar)
    
        //Se intenta hacer la actualización de los datos dla pregunta, buscando por el ID del mismo y enviando los datos
        Preguntas.findByIdAndUpdate(datosActualizar.id,existingQuestion,{upsert:true}).exec()
        return res.status(200).send({
            success: true,
            message: "La actualización de los datos de la pregunta fue exitosamente.",
            outcome: []
        })
    }catch(err){
        console.log(err)
        //Mensaje de error por si no se pudo registrar la pregunta
        return res.status(400).send({
            success: false,
            message: "Error al intentar actualizar la regunta, por favor intente nuevamente.",
            outcome: []
        })
    }
    
}

export const listadoPreguntas = async (req, res) => {
    //Consulta para traer el detalle dla pregunta
    const questions = await Preguntas.find(
            {}, 
            "question \
            tipo \
            escala.texto \
            escala.valor"
    ).exec();
 
    if(questions.length == 0){
        //Validación por si la pregunta no existe retorne un mensaje de error
        return res.status(204).send({
            success: false,
            message: "No existen preguntas en el sistema.",
            outcome: []
        })
    }
    else{       
        //Retorno de mensaje de exito
        return res.status(200).send({
            success: true,
            message: "Se encontraron todos las preguntas disponibles exitosamente.",
            outcome: questions
        })
    }
}

export const detallePregunta = async (req, res) => {
    let data = req.params
    
    //Consulta para traer el detalle dla pregunta
    var existingQuestion = await Preguntas.findById(
            data.id, 
            "question \
            tipo \
            escala.texto \
            escala.valor"
    ).exec()
        
    if(!existingQuestion){
        //Validación por si la pregunta no existe retorne un mensaje de error
        return res.status(204).send({
            success: false,
            message: "La pregunta seleccionado no existe.",
            outcome: []
        })
    }
    else{
        //Retorno de mensaje de exito
        return res.status(200).send({
            success: true,
            message: "Se encontro el detalle de la pregunta exitosamente.",
            outcome: [existingQuestion]
        })
    }
}