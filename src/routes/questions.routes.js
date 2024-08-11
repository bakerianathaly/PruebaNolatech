import express from 'express'

import {
    registroPregunta,updatePregunta,detallePregunta,listadoPreguntas
} from '../controllers/index.controller.js'
import {jwtValidator} from '../utils/jwt.js'

const questionsRouter = express.Router()

/**
 * @swagger
 * /api/questions/:
 *   post:
 *     summary: Crea una nueva pregunta
 *     description: Crea una nueva pregunta con opciones múltiples
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               tipo:
 *                 type: string
 *                 enum: [MULTIPLE,UNICO]
 *               escala:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     texto:
 *                       type: string
 *                     valor:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Se registro la pregunta exitosamente
 *       400:
 *         description: Error al intentar crear la pregunta
 *       422:
 *         description: Error en la validación de la información
 */
questionsRouter.post('/', jwtValidator,registroPregunta)

/**
 * @swagger
 * /api/questions/:
 *   put:
 *     summary: Actualizar una nueva pregunta
 *     description: Actualizar una nueva pregunta con opciones múltiples. El ID del usuario debe incluirse en el cuerpo de la solicitud.
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
 *               question:
 *                 type: string
 *               tipo:
 *                 type: string
 *                 enum: [MULTIPLE,UNICO]
 *               escala:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     texto:
 *                       type: string
 *                     valor:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Se actualizo la pregunta exitosamente
 *       400:
 *         description: Error al intentar actualizar la pregunta
 *       409:
 *         description: La pregunta a la cual se intenta actualizar no existe
 *       422:
 *         description: Error en la validación de la información
 *       412:
 *         description: El ID de la pregunta no fue enviado
 */
questionsRouter.put('/',jwtValidator,updatePregunta)

/**
 * @swagger
 * /api/api/questions/{id}:
 *   get:
 *     summary: Detalle de una pregunta
 *     description: Detalle de una pregunta del sistema por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la pregunta a buscar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalle de la pregunta
 *       204:
 *         description: No existe la pregunta en el sistema
 */
questionsRouter.get('/:id',jwtValidator,detallePregunta)

/**
 * @swagger
 * /api/api/questions/:
 *   get:
 *     summary: Listado de las preguntas
 *     description: Listado de todas las preguntas creadas en el sistema
 *     responses:
 *       200:
 *         description: Lista de las preguntas del sistema
 *       204:
 *         description: No existen preguntas en el sistema para listar
 */
questionsRouter.get('/', jwtValidator,listadoPreguntas)

export default questionsRouter