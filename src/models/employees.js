import mongoose from 'mongoose'
const Schema = mongoose.Schema
//Esquema de mongoose para los datos en formato JSON 
const employeesSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    dni:{
        type:String,
        required: true,
        unique:true
    },
    email:{
        type:String,
        required: true,
        unique:true
    },
    department:{
        type:String,
        required: true
    },
    yearsExperience:{
        type: Number,
        required: true
    },
    educationInfo:{
        type:[
            {
                schoolName: String,
                graduationYear: Number,
                degree: String
            }
        ],
        required:true
    },
    pastJobsInfo:{
        type:[
            {
                jobName: String,
                yearWorkingThere: Number,
                jobDescription: String
            }
        ],
        required:true
    },
    evaluaciones: [
        {
            evaluacion: { type: mongoose.Schema.Types.ObjectId, ref: 'Evaluacion' },
            respuestas: [{
                pregunta: { type: mongoose.Schema.Types.ObjectId, ref: 'Preguntas' },
                respuesta: { type: mongoose.Schema.Types.ObjectId, ref: 'Respuestas' }
            }],
            respondida: { type: Boolean } //Donde "true" es que la respondio y "false" que no la ha respondido
        }
    ],
    is_active: {
        type: Boolean,
        default: true
    }
})

const Employees = mongoose.model('Employees', employeesSchema)
export {Employees}