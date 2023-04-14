import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import conectarBaseDatos from './databases/database.js';
import eventoRoutes from './routes/eventoRoutes.js';
import folioRoutes from './routes/folioRoutes.js';

const app = express();

dotenv.config();

conectarBaseDatos();

//Cors peticiones para frontend
app.use(cors());


//Lectura y parseo del body
app.use(express.json());


// app.use('/usuarios',usuarioRoutes);
app.use('/evento',eventoRoutes);
app.use('/folio',folioRoutes);
// app.use('/evento',)

app.listen(process.env.PORT,()=>{
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});