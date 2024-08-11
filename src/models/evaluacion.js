import mongoose from 'mongoose'
const Schema = mongoose.Schema
//Esquema de mongoose para los datos en formato JSON 
const evaluacionSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    periodo: {
        type: String,
        required: true
    },
    limitDate:{
        type:Date,
        required: true
    },
    // Array de ObjectId que referencian a las preguntas
    preguntas: [
        { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Preguntas' 
        }
    ],
    is_active:{
        type: Boolean,
        default: true
    }
})

const Evaluacion = mongoose.model('Evaluacion', evaluacionSchema)
export {Evaluacion}