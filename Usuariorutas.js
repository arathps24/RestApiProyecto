import { Router } from "express";
import { PrismaClient } from "@prisma/client";
const router = Router();
const prisma = new PrismaClient();
export default router;
// ---------------------------------------mostrar Usuario
router.get("/usuario", async (req, res) => {
  const usuario = await prisma.usuarios.findMany();
  res.json(usuario);
});
//--------------------------------- guardar un nuevo Usuario
router.post("/usuario", async (req, res) => {
  const { Correo, Nombre, ApellidoP, ApellidoM, FechaN } = req.body;

  const nuevousuario = await prisma.usuarios.create({
    data: {
      Correo: Correo,
      Nombre: Nombre,
      ApellidoP: ApellidoP,
      ApellidoM: ApellidoM,
      FechaN: FechaN,
    },
  });

  res.json(nuevousuario);
});
