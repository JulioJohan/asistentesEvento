import Folio from "../models/folio.js";
import Evento from "../models/evento.js";
import speakeasy from 'speakeasy';


const buscarTodosFolios = async(req,res) => {

    const folios = await Folio.find();

        let areaInteres = new Set();
        folios.forEach(folio=>{
            areaInteres.add(folio.areaInteres)
        })
        console.log(areaInteres)

    res.status(200).json({
        areaInteres
    })    
}

const guardarFolio = async(req,res) => {
    
    const folio = req.body;
    folio.fechaRegistro = new Date();
    folio.folio = speakeasy.generateSecret({length:7}).base32;

    const {correoElectronico} = folio;
    console.log(correoElectronico);

    const email = await Folio.findOne({correoElectronico});
    if(email){
        return res.status(500).json({
            ok:false,
            msg:"El email ya existe"
        })
    }

    // console.log(folio.idEvento)
    const eventoId = await Evento.findById(folio.idEvento);
    // console.log(eventoId)

    if(!eventoId){
        return res.status(404).json({
            ok:false,
            msg:"No se encontro el folio con ese id"
        })
    }

    console.log(eventoId.cupoMaximo)
    console.log( eventoId.participantes.length)
    if(eventoId.participantes.length >= eventoId.cupoMaximo){
        return res.json({
            ok:false,
            msg:"UPPPSS ya no hay espacios para este evento"
        })
    }

    const folioNuevo = new Folio(folio);
    console.log(folioNuevo)

    try {
        await folioNuevo.save();        
    } catch (error) {
        return res.status(403).json({
            ok:false,
            msg:"No se pudo guardar un folio nuevo"
        })
    }
    
    eventoId.participantes.push(folioNuevo);

    try {
        await eventoId.save()
    } catch (error) {
        return res.status(403).json({
            ok:false,
            msg:"el evento no se guardo"
        })
    }

    return res.status(200).json({
        ok:true,
        msg:"Se guardo el folio en el evento"
    })
   
}

export {
    guardarFolio,
    buscarTodosFolios
}