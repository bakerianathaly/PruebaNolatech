import express from 'express'

import {
  registroUsuario,login, updateUser, deleteUser,get
} from '../controllers/index.controller.js'
import {jwtValidator} from '../utils/jwt.js'

const userRouter = express.Router()

userRouter.post('/registroUsuario', registroUsuario)
userRouter.post('/login',  login)
userRouter.put('/update',jwtValidator,updateUser)
userRouter.put('/desactivarUsuario', jwtValidator,deleteUser)
userRouter.get('/get',get)

export default userRouter