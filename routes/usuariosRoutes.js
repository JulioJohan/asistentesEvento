import express from "express";
import { obtenerTodos } from "../controllers/usuarioController.js";

const router = express.Router();


router.get('/',obtenerTodos);

export default router;