import Evento from "../models/evento.js"
import PDFDocument from 'pdfkit';

const guardarEvento = async(req, res) => {   
    
    const eventoNuevo = new Evento(req.body);

    try {
        const eventoGuardado = await eventoNuevo.save();    
        console.log(eventoGuardado)
    } catch (error) {
        console.log(error)
        res.send(500).json({
            ok:false,
            msg:"Error desconocido, comunicase con el administrador"
        })
    }

    res.status(200).json({
        ok:true,
        msg:"El evento se guardo correctamente"
    })
} 

const buscarEventos = async(req, res) => {
    const bucarEvento = await Evento.find();

    console.log(bucarEvento)
    res.json({
        bucarEvento
    });
}
const eliminarEvento = async(req, res) => {

    const idEvento = req.params.id;

    console.log(idEvento)
    let eventoDB;
    try {        
        eventoDB = await Evento.findById(idEvento);
    } catch (error) {
        console.log(error)
        res.json({
            ok:false,
            msg:"Error desconocido, comunicase con el administrador"
        });
    }

    if(!eventoDB){
        res.json({
            ok:false,
            msg:"No existe este evento"
        });
    }

    try {        
        const eliminarDB = await Evento.deleteOne(eventoDB);
    } catch (error) {
        console.log(error)
        res.json({
            ok:true,
            msg:"Exite el evento"
        });
    }
}

const busquedaNombreCompleto = async(req,res) => {

    const busqueda = req.body;
    console.log(busqueda);

    if(busqueda.fechaInicio == null ){
        return res.json({
            ok:false,
            msg:"No hay fecha inicio"
        });
    }

    
    if(busqueda.fechaFin == null ){
       return res.json({
            ok:false,
            msg:"No hay fecha inicio"
        });
    }

    if(busqueda.nombre == null ){
        return res.json({
            ok:false,
            msg:"No hay fecha inicio"
        });
    }


    const busquedaPorNombreDeseado = await Evento.find({
        nombreEvento: { $regex: busqueda.nombre, $options: 'i' }
    }).populate({
        path: 'participantes',
        select: 'nombre apellidoPaterno apellidoMaterno fechaRegistro',
        match: { 
            fechaRegistro: {
                $gte: busqueda.fechaInicio,
                $lte: busqueda.fechaFin
            }
        },
        options: { sort: { apellidoPaterno: 1 } }
    });
    

    console.log(busquedaPorNombreDeseado)

    return res.status(200).json({
        ok:true,
        busquedaPorNombreDeseado
    })

}

const buscarPorGenero = async (req,res) => {

    const areaInteres = req.query.areaInteres;

    console.log(areaInteres);

    const listaPorTodosGenero = await Evento.aggregate([
        {
            $lookup: {
              from: 'folios',
              localField: 'participantes',
              foreignField: '_id',
              as: 'participantes'
            }
          },
          {
            $unwind: '$participantes'
          },
          {
            $match: {
              'participantes.areaInteres': areaInteres
            }
          },
          {
            $group: {
              _id: '$participantes.genero',
              nombresCompletos: {
                $push: {
                  
                   "nombre": '$participantes.nombre',
                
                   "apellidoPaterno" :'$participantes.apellidoPaterno',
                    
                    "apellido":'$participantes.apellidoMaterno'
                  
                }
              }
            }
          }
    ])
    
    res.status(200).json({
        listaPorTodosGenero
    })
}

const pdf = (req,res) => {
    console.log("Generando archivo PDF...");
    console.log(req.body);
    
    const doc = new PDFDocument();
    req.body.forEach(elemento => {
        doc.moveDown();
        doc.fontSize(15)
        doc.text('Evento');
        doc.text(elemento.nombreEvento);
        doc.text('Cupo Maximo');
        doc.text(elemento.cupoMaximo);
        elemento.participantes.forEach(data =>{
            doc.moveDown();
            doc.text('Participantes');
            doc.text('Nombre Participante');
            doc.text(data.nombre);
            doc.text('Apellido Materno');            
            doc.text(data.apellidoMaterno);
            doc.text('Apellido Paterno')
            doc.text(data.apellidoPaterno);
            doc.text('Fecha Registro');
            doc.text(data.fechaRegistro);
        })
    });
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=archivo.pdf');

    doc.pipe(res);
    doc.end();
}


export {
    guardarEvento,
    eliminarEvento,
    buscarEventos,
    busquedaNombreCompleto,
    buscarPorGenero,
    pdf
}
