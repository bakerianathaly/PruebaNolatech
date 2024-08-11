import express from 'express'

import {
    registroEvaluacion,updateEvaluacion,detalleEvaluacion,listadoEvaluacions,asignarEvaluacionEmpleado
} from '../controllers/index.controller.js'
import {jwtValidator} from '../utils/jwt.js'

const evaluationsRouter = express.Router()

/**
 * @swagger
 * /api/evaluations/:
 *   post:
 *     summary: Crea una nueva evaluación
 *     description: Crea una nueva evaluación con varias preguntas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               periodo:
 *                 type: string
 *               limitDate:
 *                 type: string
 *                 format: date
 *               preguntas:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: ObjectId
 *     responses:
 *       200:
 *         description: Se registro la evaluación exitosamente
 *       400:
 *         description: Error al intentar crear la evaluación
 *       409:
 *         description: Ya existe una evaluación con ese nombre en ese periodo 
 *       422:
 *         description: Error en la validación de la información
 */
evaluationsRouter.post('/', jwtValidator,registroEvaluacion)


//evaluationsRouter.post('/:id/submit', jwtValidator,registroEvaluacion)

/**
 * @swagger
 * /api/asignar/evaluacion:
 *   post:
 *     summary: Asignar una evaluación a un empleado
 *     description: Asignar una evaluacion a un empleado para su posterior llenado. Se le envia un correo al empleado de que tiene una evaluacion pendiente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               empleado:
 *                 type: string
 *                 format: ObjectId
 *                 description: ID del empleado
 *               evaluacion:
 *                 type: string
 *                 format: ObjectId
 *                 description: ID de la evaluación
 *     responses:
 *       200:
 *         description: Se asigno al empleado una evaluación exitosamente
 *       400:
 *         description: Error al intentar asignar un empleado a la evaluación
 *       409:
 *         description: El id del empleado y el id de la evaluación son requeridos
 */
evaluationsRouter.post('/asignar/evaluacion',jwtValidator,asignarEvaluacionEmpleado)

/**
 * @swagger
 * /api/evaluations/:
 *   put:
 *     summary: Actualizar una nueva evaluación
 *     description: Actualizar una nueva evaluación con varias preguntas. El ID del usuario debe incluirse en el cuerpo de la solicitud.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               periodo:
 *                 type: string
 *               limitDate:
 *                 type: string
 *                 format: date
 *               preguntas:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: ObjectId
 *     responses:
 *       200:
 *         description: Se registro la evaluación exitosamente
 *       400:
 *         description: No se puede crear una evaluación sin una pregunta
 *       409:
 *         description: El identificador de la evaluación no fue enviado o la evaluación al cual se intenta actualizar no existe.
 *       422:
 *         description: Error en la validación de la información
 */
evaluationsRouter.put('/',jwtValidator,updateEvaluacion)

/**
 * @swagger
 * /api/api/evaluations/{id}:
 *   get:
 *     summary: Detalle de una evaluación
 *     description: Detalle de una evaluación del sistema por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la evaluación a buscar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalle de la evaluación
 *       204:
 *         description: No existe la evaluación en el sistema
 */
evaluationsRouter.get('/:id',jwtValidator,detalleEvaluacion)

/**
 * @swagger
 * /api/api/evaluations/:
 *   get:
 *     summary: Listado de las evaluaciones
 *     description: Listado de todas las evaluaciones creadas en el sistema
 *     responses:
 *       200:
 *         description: Lista de las evaluaciones del sistema
 *       204:
 *         description: No existen evaluaciones en el sistema para listar
 */
evaluationsRouter.get('/', jwtValidator,listadoEvaluacions)


export default evaluationsRouter