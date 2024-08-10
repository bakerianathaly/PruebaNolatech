import express from 'express'

import {
  registroUsuario,login, updateUser, deleteUser,detalleUsuario,listadoUsuarios
} from '../controllers/index.controller.js'
import {jwtValidator} from '../utils/jwt.js'

const userRouter = express.Router()

userRouter.post('/register', registroUsuario)
userRouter.post('/login',  login)
userRouter.put('/update',jwtValidator,updateUser)
userRouter.put('/desactivarUsuario', jwtValidator,deleteUser)
userRouter.get('/detalleUsuario/:id',jwtValidator,detalleUsuario)
userRouter.get('/listaUsuarios', jwtValidator,listadoUsuarios)

export default userRouter