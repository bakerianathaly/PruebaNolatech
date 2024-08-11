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
    status:{
        type:String,
        required: true,
    },
    type:{
        type:String,
        required: true,
    },
    limitDate:{
        type:Date,
        required: true
    },
    is_active:{
        type: Boolean,
        default: true
    }
});

const Evaluacion = mongoose.model('Evaluacion', evaluacionSchema);
export {Evaluacion}