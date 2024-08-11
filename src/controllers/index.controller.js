//Usuario
import { registroUsuario,login, updateUser, deleteUser,detalleUsuario,listadoUsuarios } from './user.controller.js'
//Empleados
import { registroEmpleado,updateEmpleado,detalleEmpleado,listadoEmpleados } from './employees.controller.js'
//Preguntas
import { registroPregunta,updatePregunta,detallePregunta,listadoPreguntas } from './questions.controller.js'

export {
    //Usuarios
    registroUsuario,login, updateUser, deleteUser,detalleUsuario,listadoUsuarios,
    //Empleados
    registroEmpleado,updateEmpleado,detalleEmpleado,listadoEmpleados,
    //Preguntas
    registroPregunta,updatePregunta,detallePregunta,listadoPreguntas
}
