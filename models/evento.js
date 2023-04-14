import mongoose from "mongoose";

const eventoSchema = mongoose.Schema({

    nombreEvento:{
        type:String,
        require:true
    },
    cupoMaximo:{
        type: Number,
        required: true
    },
    participantes:[{
        type: mongoose.SchemaTypes.ObjectId,
        ref:'folio'
    }]
})

const Evento = mongoose.model('evento',eventoSchema);
export default Evento;