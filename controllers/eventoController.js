import Evento from "../models/evento.js"
import PDFDocument from 'pdfkit';

const guardarEvento = async(req, res) => {   
    
    const eventoNuevo = new Evento(req.body);

    console.log(req.body)
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

const agregarLugarEvento = async (req, res) =>{

    
    const idEvento = req.body.id;
    console.log(idEvento)
    const lugar = req.body;
    let evento;
    try {
        evento = await Evento.findById(idEvento);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok:false,
            msg:"Hable Con el Administrador"
        })

    }
    if(!evento){
        return res.status(404).json({
            ok:false,
            msg:"El evento no se encontro"
        })
    }

    evento.lugares.push(lugar);
    try {
        await evento.save();
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok:false,
            msg:"Hable Con el Administrador"
        });
    }

    return res.status(200).json({
        ok:true,
        msg:"Se agrego la ubicación al evento"
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

  
    // const e = Evento.find().populate('participantes','nombre apellidoPaterno apellidoMaterno fechaRegistro')
    const eventos = await Evento.find({
        nombreEvento: { $regex: busqueda.nombre, $options: 'i' }
    }).populate({
        path: 'participantes',
        select: 'nombre apellidoPaterno apellidoMaterno fechaRegistro',    
        options: { sort: { apellidoPaterno: 1 } }
    });

    const fechaInicio = new Date( busqueda.fechaInicio);
    const fechaFin = new Date( busqueda.fechaFin);

    let eventosBusqueda;
    eventos.forEach(evento=>{
        evento.lugares.forEach(lugar=>{
            const fecha = new Date(lugar.fecha)
            if(fecha >= fechaInicio && fecha <= fechaFin){
                eventosBusqueda = eventos;
            } 
        })
    })





   

    return res.status(200).json({
        ok:true,
        eventosBusqueda
    })

}

const buscarPorGenero = async (req,res) => {

    const areaInteres = req.body.areaInteres;


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

    let datosMasculino = [];
    let datosFemenino = [];
    listaPorTodosGenero.forEach(data=>{ 
        data.nombresCompletos.forEach(data2=>{
            if(data._id === "Masculino"){
                datosMasculino.push({...data2,genero:"Masculino"})
            }


            if(data._id === "Femenino"){
                datosFemenino.push({...data2,genero:"Femenino"})
            }
        })    

    })
    res.status(200).json({
        listaPorTodosGenero,
        datosMasculino,
        datosFemenino
    })
}

const pdf = async (req, res) => {
    try {
      console.log('Generando archivo PDF...');
      console.log(req.body);
  
      const doc = new PDFDocument();
      req.body.forEach((elemento) => {
        doc.moveDown();
        doc.fontSize(15);
        doc.text('Evento');
        doc.text(elemento.nombreEvento);
        doc.text('Cupo Maximo');
        doc.text(elemento.cupoMaximo);
        elemento.participantes.forEach((data) => {
          doc.moveDown();
          doc.text('Participantes');
          doc.text('Nombre Participante');
          doc.text(data.nombre);
          doc.text('Apellido Materno');
          doc.text(data.apellidoMaterno);
          doc.text('Apellido Paterno');
          doc.text(data.apellidoPaterno);
          doc.text('Fecha Registro');
          doc.text(data.fechaRegistro);
        });
      });
  
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=archivo.pdf');
  
      doc.pipe(res);
      doc.end();
    } catch (error) {
      console.log('Ocurrió un error al generar el archivo PDF: ', error);
      res.status(500).send('Ocurrió un error al generar el archivo PDF.');
    }
  };
  
  
  
  
  
  


export {
    guardarEvento,
    agregarLugarEvento,
    eliminarEvento,
    buscarEventos,
    busquedaNombreCompleto,
    buscarPorGenero,
    pdf
}
