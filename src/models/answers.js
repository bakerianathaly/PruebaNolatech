import mongoose from 'mongoose'
const Schema = mongoose.Schema
//Esquema de mongoose para los datos en formato JSON 
const respuestasSchema = new Schema({
    valor: {
        type: Number,
        required: true
    }
})

const Respuestas = mongoose.model('Respuestas', respuestasSchema)
export {Respuestas}