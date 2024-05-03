import express from "express";
import cors from "cors";
import Usuariorutas from "./rutas/Usuariorutas.js";
import Constancias from "./rutas/Generacion_Constancias.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", Usuariorutas);
app.use("/api", Constancias);
app.listen(3001);
console.log("Servidor con el puerto", 3001);