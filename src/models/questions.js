import mongoose from 'mongoose'
const Schema = mongoose.Schema
//Esquema de mongoose para los datos en formato JSON 
const preguntasSchema = new Schema({
    question: {
        type: String,
        required: true
    },
    tipo: { 
        type: String, 
        enum: ['MULTIPLE', 'UNICO'] 
    },
    // Para asignar un valor a cada opción
    escala: [
        {
            texto: String,
            valor: Number
        }
    ],
    is_active:{
        type: Boolean,
        default: true
    }
});

const Preguntas = mongoose.model('Preguntas', preguntasSchema);
export {Preguntas}