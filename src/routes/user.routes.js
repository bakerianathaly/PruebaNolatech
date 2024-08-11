import express from 'express'

import {
  registroUsuario,login, updateUser, deleteUser,detalleUsuario,listadoUsuarios
} from '../controllers/index.controller.js'
import {jwtValidator} from '../utils/jwt.js'

const userRouter = express.Router()

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Crea un nuevo usuario
 *     description: Crea un nuevo usuario en el sistema
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               lastName:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Error al intentar crear el usuario
 *       409:
 *         description: El email o el usuario ya existen
 *       422:
 *         decription: Error en las validaciones de los datos antes de crear el usuario
 */
userRouter.post('/register', registroUsuario)

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login
 *     description: Login de los usuarios en el sistema
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bienvenido al sistema
 *       400:
 *         description: El inicio de sesión no pudo proceder debido a un error
 *       409:
 *         description: El nombre de usuario o la contraseña son incorrectos
 *       422:
 *         decription: El nombre de usuario y la contraseña son obligatorios
 */
userRouter.post('/login',  login)

/**
 * @swagger
 * /api/auth/update:
 *   put:
 *     summary: Actualiza un usuario existente
 *     description: Actualiza los datos de un usuario existente. El ID del usuario debe incluirse en el cuerpo de la solicitud.
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
 *               lastName:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       400:
 *         description: Error al intentar actualizar el usuario
 *       409:
 *         description: El email o el usuario ya existen o el usuario al cual se intenta actualizar no existe
 *       422:
 *         decription: Error en las validaciones de los datos antes de actualizar el usuario
 *       412:
 *         description: El ID del usuario no fue enviado
 */
userRouter.put('/update',jwtValidator,updateUser)

/**
 * @swagger
 * /api/auth/desactivarUsuario:
 *   put:
 *     summary: Desactivacion de un usuario existente
 *     description: Desactivacion de un usuario existente. El ID del usuario debe incluirse en el cuerpo de la solicitud.
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
 *     responses:
 *       200:
 *         description: Usuario desactivado exitosamente
 *       400:
 *         description: Error al intentar desactivar el usuario
 *       409:
 *         description: El usuario seleccionado no existe
 */
userRouter.put('/desactivarUsuario', jwtValidator,deleteUser)

/**
 * @swagger
 * /api/api/auth/detalleUsuario/{id}:
 *   get:
 *     summary: Detalle de un usuario
 *     description: Detalle de un usuario del sistema por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a buscar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalle del usuario
 *       204:
 *         description: No existe el usuario en el sistema
 */
userRouter.get('/detalleUsuario/:id',jwtValidator,detalleUsuario)

/**
 * @swagger
 * /api/auth/listaUsuarios:
 *   get:
 *     summary: Listado de usuarios
 *     description: Listado de todos los usuarios creados en el sistema
 *     responses:
 *       200:
 *         description: Lista de los usuarios del sistema
 *       204:
 *         description: No existen usuarios en el sistema para listar
 */
userRouter.get('/listaUsuarios', jwtValidator,listadoUsuarios)

export default userRouter