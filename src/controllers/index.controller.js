import { registroUsuario,login, updateUser, deleteUser,detalleUsuario,listadoUsuarios } from './user.controller.js'
import { registroEmpleado,updateEmpleado,detalleEmpleado,listadoEmpleados } from './employees.controller.js'


export {
    //Usuarios
    registroUsuario,login, updateUser, deleteUser,detalleUsuario,listadoUsuarios,
    //Empleados
    registroEmpleado,updateEmpleado,detalleEmpleado,listadoEmpleados
}
