import express from 'express'

import {
    registroEmpleado,updateEmpleado,detalleEmpleado,listadoEmpleados
} from '../controllers/index.controller.js'
import {jwtValidator} from '../utils/jwt.js'

const evaluationsRouter = express.Router()

evaluationsRouter.post('/', jwtValidator,registroEmpleado)
//evaluationsRouter.post('/:id/submit', jwtValidator,registroEmpleado)
evaluationsRouter.put('/',jwtValidator,updateEmpleado)
evaluationsRouter.get('/:id',jwtValidator,detalleEmpleado)
evaluationsRouter.get('/', jwtValidator,listadoEmpleados)

export default evaluationsRouter