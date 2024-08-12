import swaggerJsdoc from 'swagger-jsdoc'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Prueba de backend de Nolatech por Nathaly Bakerian Scovino',
            version: '1.0.0'
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    in: 'header'
                }
            }
          },
        security: [{
            bearerAuth: []
        }],
        servers:[
            {
                url:'http://localhost:3005'
            }
        ]
    },
    apis: [
        `${path.join(__dirname,'../routes/user.routes.js')}`,
        `${path.join(__dirname,'../routes/employees.routes.js')}`,
        `${path.join(__dirname,'../routes/questions.routes.js')}`,
        `${path.join(__dirname,'../routes/evaluacion.routes.js')}`,
    ] // Ruta donde se encuentran tus rutas
}

export const specs = swaggerJsdoc(options)
