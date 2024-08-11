import jsonwebtoken from 'jsonwebtoken'
const { verify } = jsonwebtoken
const SECRET_KEY = process.env.SECRET_KEY

export const roleValidator = (requiredRole, accion) => {
    return (req, res, next) => {
        // Obtener el rol del usuario desde el token JWT
        let auth = req.headers['authorization'].split(' ').pop()
        const decoded = verify(auth, SECRET_KEY)

        //Validacion para verificar si el rol del usuario esta dentro de los roles que pueden 
        //Acceder a esa ruta
        const userRole = decoded.role.toUpperCase()   
        if (requiredRole.includes(userRole)) {
            next(); // Si el rol coincide, permite el acceso
        } else {
            res.status(403).send({
                success: false,
                message: `No tienes permiso para ${accion}`,
                outcome: []
            })
        }
    };
  }
  