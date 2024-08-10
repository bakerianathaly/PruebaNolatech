import express from 'express'

import {
    registroEmpleado,updateEmpleado,detalleEmpleado,listadoEmpleados
} from '../controllers/index.controller.js'
import {jwtValidator} from '../utils/jwt.js'

const employeesRouter = express.Router()

employeesRouter.post('/', jwtValidator,registroEmpleado)
employeesRouter.put('/',jwtValidator,updateEmpleado)
employeesRouter.get('/:id',jwtValidator,detalleEmpleado)
employeesRouter.get('/', jwtValidator,listadoEmpleados)

export default employeesRouter