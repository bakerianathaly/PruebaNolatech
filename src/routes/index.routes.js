import express from 'express'
import userRouter from './user.routes.js'

const router = express.Router()

// Rutas
router.get('/', (req, res) => {
  // Carpetas de endpoints
  res.status(404).send('Page not found')
})

router.use('/users', userRouter)

export { router }
