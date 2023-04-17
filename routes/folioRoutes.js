import express from 'express';
import { guardarFolio,buscarTodosFolios } from '../controllers/folioController.js';

const rutas = express.Router();

rutas.post('/guardarFolio',guardarFolio);
rutas.get('/obtenerTodos',buscarTodosFolios)

export default rutas;