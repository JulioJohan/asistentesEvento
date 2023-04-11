import mongoose from "mongoose";

const folioScema = new mongoose.Schema({
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
        
    }

})
const Folio = mongoose.model('folio',folioScema);
export default Folio;