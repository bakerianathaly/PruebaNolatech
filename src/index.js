import express from 'express'
import cors from 'cors'
import { router } from './routes/index.routes.js'
import {specs} from './config/swagger.js'
import dotenv from "dotenv"
import swaggerUi from 'swagger-ui-express'
import {connectDB} from './config/database.js'
import rateLimit from 'express-rate-limit'

const app = express()
//Configuracion para leer las .env
dotenv.config()

//Configuracion del rate-limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'El sistema esta recibiendo demasiadas peticiones, por favor intente mas tarde.',
    statusCode: 429
})

const port = 3005
app.use(cors({ origin: '*' })) // cors
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: false }))
// Uso del rate-limit
app.use(limiter)

// Rutas
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
app.use('/api', router)
app.listen(port, function () {
    connectDB()
    console.log(`Api corriendo en http://localhost:${port}!`)
})