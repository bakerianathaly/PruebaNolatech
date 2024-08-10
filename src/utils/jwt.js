import jsonwebtoken from 'jsonwebtoken'
import chalk from 'chalk'
import {User} from '../models/user.js'

const { verify } = jsonwebtoken
const SECRET_KEY = process.env.SECRET_KEY

export const jwtValidator = async (req, res, next) => {
  try {
    // Obtenemos el token de la cabecera
    let auth = req.headers['authorization']

    // Si no existe, retornamos error
    if (!auth) throw new Error('Not JWT')

    auth = auth.split(' ').pop()

    const decoded = verify(auth, SECRET_KEY)
    let existingUser = await User.findOne({_id: decoded.id}).exec()

    if(existingUser.is_active == false){
      return res.status(409).send({
        success: false,
        message:"El usuario relacionado esta desactivado.",
        outcome: []
      }) 
    }

    return next()
  } catch (e) {
    // eslint-disable-next-line no-console
    console.info(`${chalk.red('[ERROR]:')}`, e.message)
    return (
      res.status(401).send({ 
        success:false,
        message:`Sesión invalida: ${e.message}.`,
        outcome: []
      })
    )
  }
}
