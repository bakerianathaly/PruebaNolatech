import express from 'express'
import {
    registroEmpleado,updateEmpleado,detalleEmpleado,listadoEmpleados
} from '../controllers/index.controller.js'
import {jwtValidator} from '../middlewares/jwt.js'
import {roleValidator} from '../middlewares/roleValidator.js'

const employeesRouter = express.Router()

/**
 * @swagger
 * /api/employees/:
 *   post:
 *     summary: Crea un nuevo empleado
 *     description: Crea un nuevo empleado con su información personal, experiencia laboral y formación académica
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nombre del empleado
 *               lastName:
 *                 type: string
 *                 description: Apellido del empleado
 *               dni:
 *                 type: string
 *                 description: Documento de identidad del empleado
 *               email:
 *                 type: string
 *                 description: Correo electrónico del empleado
 *               department:
 *                 type: string
 *                 description: Departamento del empleado
 *               yearsExperience:
 *                 type: integer
 *                 description: Años de experiencia del empleado
 *               educationInfo:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     schoolName:
 *                       type: string
 *                       description: Nombre de la institución educativa
 *                     graduationYear:
 *                       type: integer
 *                       description: Año de graduación
 *                     degree:
 *                       type: string
 *                       description: Título obtenido
 *               pastJobsInfo:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     jobName:
 *                       type: string
 *                       description: Nombre del puesto de trabajo anterior
 *                     yearWorkingThere:
 *                       type: integer
 *                       description: Años trabajando en el puesto anterior
 *                     jobDescription:
 *                       type: string
 *                       description: Descripción del puesto de trabajo anterior
 *     responses:
 *       200:
 *         description: Se registro el empleado exitosamente
 *       409:
 *         description: Errores relacionados a busqueda de datos
 *       422:
 *         description: Error en la validación de la información
 *       400:
 *         description: Error al intentar crear el empleado
 */
employeesRouter.post('/', jwtValidator, roleValidator(['ADMIN','MANAGER'], 'crear un empleado'), registroEmpleado)

/**
 * @swagger
 * /api/employees/:
 *   put:
 *     summary: Actualizar un nuevo empleado
 *     description: Actualizar un nuevo empleado con su información personal, experiencia laboral y formación académica
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
 *                 description: Nombre del empleado
 *               lastName:
 *                 type: string
 *                 description: Apellido del empleado
 *               dni:
 *                 type: string
 *                 description: Documento de identidad del empleado
 *               email:
 *                 type: string
 *                 description: Correo electrónico del empleado
 *               department:
 *                 type: string
 *                 description: Departamento del empleado
 *               yearsExperience:
 *                 type: integer
 *                 description: Años de experiencia del empleado
 *               educationInfo:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     schoolName:
 *                       type: string
 *                       description: Nombre de la institución educativa
 *                     graduationYear:
 *                       type: integer
 *                       description: Año de graduación
 *                     degree:
 *                       type: string
 *                       description: Título obtenido
 *               pastJobsInfo:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     jobName:
 *                       type: string
 *                       description: Nombre del puesto de trabajo anterior
 *                     yearWorkingThere:
 *                       type: integer
 *                       description: Años trabajando en el puesto anterior
 *                     jobDescription:
 *                       type: string
 *                       description: Descripción del puesto de trabajo anterior
 *     responses:
 *       200:
 *         description: Se registro el empleado exitosamente
 *       409:
 *         description: Errores relacionados a busqueda de datos
 *       422:
 *         description: Error en la validación de la información
 *       400:
 *         description: Error al intentar crear el empleado
 */
employeesRouter.put('/',jwtValidator,roleValidator(['ADMIN','MANAGER'], 'editar un empleado'),updateEmpleado)

/**
 * @swagger
 * /api/employees/{id}:
 *   get:
 *     summary: Detalle de un empleado
 *     description: Detalle de un empleado del sistema por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del empleado a buscar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalle dl  empleado
 *       204:
 *         description: No existe empleado en el sistema
 */
employeesRouter.get('/:id',jwtValidator,roleValidator(['ADMIN','MANAGER'], 'obtener el detalle de un empleado'),detalleEmpleado)

/**
 * @swagger
 * /api/employees/:
 *   get:
 *     summary: Listado de los empleados
 *     description: Listado de todas los empleados creadas en el sistema
 *     responses:
 *       200:
 *         description: Lista de los empleados del sistema
 *       204:
 *         description: No existen empleados en el sistema para listar
 */
employeesRouter.get('/', jwtValidator,roleValidator(['ADMIN','MANAGER'], 'listar todos los empleados'),listadoEmpleados)

export default employeesRouter