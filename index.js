import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import conectarBaseDatos from './databases/database.js';
import usuarioRoutes from './routes/usuariosRoutes.js';

const app = express();

dotenv.config();

conectarBaseDatos();

//Cors peticiones para frontend
app.use(cors());


//Lectura y parseo del body
app.use(express.json());


app.use('/usuarios',usuarioRoutes);

app.listen(process.env.PORT,()=>{
    console.log(`Servidor corriendo en el puerto ${process.env.PORT}`);
});