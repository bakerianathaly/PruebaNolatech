import express from 'express'
import userRouter from './user.routes.js'
import employeesRouter from './employees.routes.js'
import evaluationsRouter from './evaluacion.routes.js'
import questionsRouter from './questions.routes.js'

const router = express.Router()

// Rutas
router.get('/', (req, res) => {
  // Carpetas de endpoints
  res.status(404).send('Page not found :c')
})

router.use('/auth', userRouter)
router.use('/employees',employeesRouter)
router.use('/evaluations',evaluationsRouter)
router.use('/questions',questionsRouter)

export { router }
