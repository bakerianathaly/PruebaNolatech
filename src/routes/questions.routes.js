import express from 'express'

import {
    registroPregunta,updatePregunta,detallePregunta,listadoPreguntas
} from '../controllers/index.controller.js'
import {jwtValidator} from '../utils/jwt.js'

const questionsRouter = express.Router()

questionsRouter.post('/', jwtValidator,registroPregunta)
questionsRouter.put('/',jwtValidator,updatePregunta)
questionsRouter.get('/:id',jwtValidator,detallePregunta)
questionsRouter.get('/', jwtValidator,listadoPreguntas)

export default questionsRouter