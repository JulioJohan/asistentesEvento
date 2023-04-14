import express from 'express';
import { buscarEventos, pdf, guardarEvento,busquedaNombreCompleto, buscarPorGenero} from '../controllers/eventoController.js';

const rutas = express.Router();

rutas.post('/guardarEvento',guardarEvento);
// rutas.delete('/eliminarEvento/:id',eliminarEvento);
rutas.get('/obtenerTodos',buscarEventos);


rutas.post('/obtenerTodosNombreCompleto',busquedaNombreCompleto);
rutas.post('/obtenerTodosPorGenero',buscarPorGenero);


rutas.post('/pdf',pdf);
// rutas.get('/obtenerTodo',);

export default rutas;