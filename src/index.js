import express from 'express'
import cors from 'cors'
import { router } from './routes/index.routes.js'
import dotenv from "dotenv";

const app = express()
dotenv.config();
import {connectDB} from './config/database.js'

const port = 3005
app.use(cors({ origin: '*' })) // cors
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: false }))

// routes
app.use('/api', router)
app.get('/', (req, res) => {
    console.log('pepe')
});
app.listen(port, function () {
    connectDB()
    console.log(`Api corriendo en http://localhost:${port}!`)
})