import mongoose from "mongoose";

const folioScema = new mongoose.Schema({
    folio:{
        type:String,
        require:true,
    },
    nombre:{
        type:String,
        require:true
    },
    apellidoPaterno:{
        type:String,
        require:true
    },
    apellidoMaterno:{
        type:String,
        require:true
    },
    edad:{
        type:Number,
        require:true
    },
    genero:{
        type:String,
        require:true
    },
    areaInteres:{
        type:String,
        require:true
    },
    correoElectronico:{
        type:String,
        require:true,
        unique:true
    },
    telefono:{
        type:Number,
        require:true
    },
    ciudad:{
        type:String,
        require:true,
    },
    cargo:{
        type:String,
        require:true,
    },
    fechaRegistro:{
        type:Date,
        require:true,
    }    
})
const Folio = mongoose.model('folio',folioScema);
export default Folio;