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
    }],
    lugares:[{
        ciudad:{
            type:String,
            required:true,
        },
        direccion:{
            type:String,
            require:true
        },
        fecha:{
            type:Date,
            require:true
        },
        hora:{
            type: String,
            required: true
        }
        // fecha  y hora  
        //ciudad, direccion
    }]
})

const Evento = mongoose.model('evento',eventoSchema);
export default Evento;