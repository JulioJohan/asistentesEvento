import express from 'express';
import { guardarFolio } from '../controllers/folioController.js';

const rutas = express.Router();

rutas.post('/guardarFolio',guardarFolio);

export default rutas;