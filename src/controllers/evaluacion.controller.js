//Models 
import {Evaluacion} from '../models/evaluacion.js'
import {periodsTime} from '../utils/common.js'
import {enviarCorreo} from '../utils/email.js'
import {Employees} from '../models/employees.js'
import moment from 'moment'

export const registroEvaluacion = async (req, res) => {
    try{
        //Datos de la evaluación que vienen en el cuerpo de la petición
        var data = req.body
        data.periodo = data.periodo.toUpperCase()

        //Consulta para ver si la evaluación ya existe con el nombre y el periodo
        const existingEvaluacion = await Evaluacion.findOne({ name: data.name, periodo: data.periodo}).exec()
        if(existingEvaluacion){
            return res.status(409).send({
                success: false,
                message:"Ya existe una evaluación con ese nombre en ese periodo.",
                outcome: []
            }) 
        }

        //Validacion de que se intenta crear una evaluacion con al menos una pregunta
        if(data.preguntas.length == 0){
            return res.status(400).send({
                success: false,
                message: "No se puede crear una evaluación sin una pregunta, por favor seleccione al menos una.",
                outcome: []
            })
        }

        //Validacion apra verificar que el periodo de la evaluación sea los validos
        if(!(periodsTime.includes(data.periodo))){
            return res.status(406).send({
                success: false,
                message:"El periodo de la evaluación seleccionado no es valido.",
                outcome: []
            })
        }
        
        //Se intenta registrar la evaluación creando un objeto del modelo, luego de crear el objeto se envia a registrarse en la BD
        //En caso de que no ocurra ningun error se regresa un status 200 de exito
        var newEvaluacion = new Evaluacion(data)
        await newEvaluacion.save()
        return res.status(200).send({
            success: true,
            message: "Se registro la evaluación exitosamente,",
            outcome: []
        })
    }catch(err){
        //Mensaje de error por si no se pudo registrar la evaluación
        return res.status(204).send({
            success: false,
            message: "Error al intentar crear la evaluación, por favor intente nuevamente.",
            outcome: []
        })
    }
    
}

export const updateEvaluacion = async (req, res) =>{
    try{
        //Datos de la evaluación que vienen en el cuerpo de la petición
        var datosActualizar = req.body

        // Se valida, por precaucion, que el id de la evaluación venga en la datosActualizar
        if(!datosActualizar.id){
            return res.status(409).send({
                success: false,
                message:"El identificador de la evaluación no fue enviado.",
                outcome: []
            }) 
        }

        //Consulta para ver si la evaluación existe 
        var existingEvaluation = await Evaluacion.findOne({_id:datosActualizar.id, is_active: true}).exec() 
        //Validación por si la evaluación no existe retorne un mensaje de error
        if(!existingEvaluation){
            return res.status(409).send({
                success: false,
                message:"la evaluación al cual se intenta actualizar no existe.",
                outcome: []
            }) 
        }

        // Se valida si la informacion que viene es las preguntas para hacer otras validaciones antes de actualizar
        //Validacion de que se intenta crear una evaluacion con al menos una pregunta
        if(datosActualizar.preguntas.length != undefined){
            if(datosActualizar.preguntas.length == 0){
                return res.status(400).send({
                    success: false,
                    message: "No se puede actualizar una evaluación sin una pregunta, por favor seleccione al menos una.",
                    outcome: []
                })
            }
        }

        //Validacion del periodo, para ver si es valido
        if(datosActualizar.periodo != undefined){
            datosActualizar.periodo = datosActualizar.periodo.toUpperCase()
            //Validacion apra verificar que el periodo de pregunta sea los validos
            if(!(periodsTime.includes(datosActualizar.periodo))){
                return res.status(406).send({
                    success: false,
                    message:"El periodo de la evaluación seleccionado no es valido.",
                    outcome: []
                })
            }
        }
        
        // Actualiza solo los campos que están presentes en datosActualizar
        Object.assign(existingEvaluation,datosActualizar)
    
        //Se intenta hacer la actualización de los datos de la evaluación, buscando por el ID del mismo y enviando los datos
        Evaluacion.findByIdAndUpdate(datosActualizar.id,existingEvaluation,{upsert:true}).exec()
        return res.status(200).send({
            success: true,
            message: "La actualización de los datos de la evaluación fue exitosamente.",
            outcome: []
        })
    }catch(err){
        //Mensaje de error por si no se pudo registrar la evaluación
        return res.status(204).send({
            success: false,
            message: "Error al intentar actualizar la evaluación, por favor intente nuevamente.",
            outcome: []
        })
    }
    
}

export const detalleEvaluacion = async (req, res) => {
    let data = req.params
    
    //Consulta para traer el detalle de la evaluación
    const existingEvaluacion = await Evaluacion.findById(
        data.id, 
        "name\
        periodo\
        status\
        type\
        limitDate"
    ).populate(
        {
            path: 'preguntas',
            select: 'question \
            tipo \
            escala.texto \
            escala.valor'
        }
    ).exec()
        
    if(!existingEvaluacion){
        //Validación por si la evaluación no existe retorne un mensaje de error
        return res.status(204).send({
            success: false,
            message: "La evaluación seleccionado no existe.",
            outcome: []
        })
    }
    else{       
        //Retorno de mensaje de exito
        return res.status(200).send({
            success: true,
            message: "Se encontro el detalle de la evaluación exitosamente.",
            outcome: [existingEvaluacion]
        })
    }
}

export const listadoEvaluacions = async (req, res) => {
    //Consulta para traer el detalle de la evaluación
    const evaluations = await Evaluacion.find(
        {}, 
        "name\
        periodo\
        status\
        type\
        limitDate"
    ).populate(
        {
            path: 'preguntas',
            select: 'question \
            tipo \
            escala.texto \
            escala.valor'
        }
    ).exec()
 
    if(evaluations.length == 0){
        //Validación por si la evaluación no existe retorne un mensaje de error
        return res.status(204).send({
            success: false,
            message: "No existen evaluaciones en el sistema.",
            outcome: []
        })
    }
    else{       
        //Retorno de mensaje de exito
        return res.status(200).send({
            success: true,
            message: "Se encontraron todos las evaluacions exitosamente.",
            outcome: evaluations
        })
    }
}

export const asignarEvaluacionEmpleado = async (req, res) => {
    try{
        //Datos de la evaluación que vienen en el cuerpo de la petición
        var data = req.body

        //Primero busco la informacion del empleado para obtener su correo electronico
        //para enviarle la notificacion de que tiene una evaluacion pendiente
        const employee = await Employees.findById(
            data.empleado, 
            "name\
            lastName\
            email\
            evaluaciones"
        ).exec()

        //Luego busco la informacion de la evaluacion ya que se debe actualizar al empleado
        //para guardar la evaluacion, con sus preguntas para posteriormente actualizarla con las respuestas
        //TODAS las evaluaciones recien asignadas tienen en su campo "evaluaciones" un valor "respondida"
        //donde siempre sera false (o sea que no la ha respondido) hasta que guarde las preguntas
        //esto facilita buscar las evaluaciones al momento de ser contestadas
        const evaluation = await Evaluacion.findById(
            data.evaluacion,
            'limitDate'
        ).populate(
            {
                path: 'preguntas',
                select: '_id'
            }
        ).exec()

        //Se actualiza al empleado con la informacion de la nueva evaluacion
        let respuestas = []
        for(let i=0;i<evaluation.preguntas.length;i++){
            respuestas.push({
                "pregunta":evaluation.preguntas[i],
                "respuesta":null
            })
        }
        
        employee.evaluaciones.push(
            {
                "evaluacion":data.evaluacion,
                "respuestas":respuestas,
                "respondida":false
            }
        )

        await Employees.findByIdAndUpdate(data.empleado,employee,{upsert:false}).exec()

        //Por ultimo se envia un correo, sencillo, en donde se le notifica al empleado que tiene
        //una evaluacion penditente a ser repondida
        enviarCorreo(
            employee.email,
            `${employee.name} ${employee.lastName}`,
            moment(evaluation.limitDate).format('DD-MM-YYYY')
        )

        return res.status(200).send({
            success: true,
            message: "Se encontraron todos los empleados exitosamente.",
            outcome: []
        })
    }catch(err){
        console.log(err)
        //Mensaje de error por si no se pudo registrar la evaluación
        return res.status(400).send({
            success: false,
            message: "Error al intentar asignar un empleado a la evaluación, por favor intente nuevamente.",
            outcome: []
        })
    }
}