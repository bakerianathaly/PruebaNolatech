import express from 'express'

import {
  registroUsuario,loggedIn, updateUser, deleteUser,get
} from '../controllers/index.controller.js'
import {jwtValidator} from '../utils/jwt.js'

const userRouter = express.Router()

userRouter.post('/registroUsuario', registroUsuario)
userRouter.post('/login',  loggedIn)
userRouter.post('/update',jwtValidator,updateUser)
userRouter.post('/delete', jwtValidator,deleteUser)
userRouter.get('/get',get)

export default userRouter