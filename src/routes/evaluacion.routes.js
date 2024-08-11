import express from 'express'

import {
    registroEvaluacion,updateEvaluacion,detalleEvaluacion,listadoEvaluacions
} from '../controllers/index.controller.js'
import {jwtValidator} from '../utils/jwt.js'

const evaluationsRouter = express.Router()

evaluationsRouter.post('/', jwtValidator,registroEvaluacion)
//evaluationsRouter.post('/:id/submit', jwtValidator,registroEvaluacion)
evaluationsRouter.put('/',jwtValidator,updateEvaluacion)
evaluationsRouter.get('/:id',jwtValidator,detalleEvaluacion)
evaluationsRouter.get('/', jwtValidator,listadoEvaluacions)

export default evaluationsRouter