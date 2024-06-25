import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
const router = Router();
const prisma = new PrismaClient();
import pdfkit from "pdfkit";
import multer from "multer";
const upload = multer();
const accountName = "contenedores";
const accountKey =
  "FdsMJ09U52GUCnzPype/RhGlsuDTc3b6E6ZPGEiv/YO+BQVLvat/uqCU7Z1P7yNY1Whn2NtQhja6+AStb02Wfw==";
const containerName = "constancias";
const credential = new StorageSharedKeyCredential(accountName, accountKey);
const blobService = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net`,
  credential
);
// ---------------------------------------mostrar
router.get("/Constancias", async (req, res) => {
  const constancias = await prisma.constancias.findMany();
  res.json(constancias);
});
//crear constancias
router.post(
  "/Constancia/:userId",
  upload.single("Constancia"),
  async (req, res) => {
    try {
      const userId = req.params.userId;
      // Obtener el usuario correspondiente al userId
      const usuario = await prisma.usuarios.findUnique({
        where: { id: userId },
      });

      if (!usuario) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
      const { originalname, buffer, mimetype } = req.file;
      const containerClient = blobService.getContainerClient(containerName);
      const blobClient = containerClient.getBlockBlobClient(originalname);
      await blobClient.uploadData(buffer, {
        blobHTTPHeaders: { blobContentType: mimetype },
      });

      // Obtener la URL directa al archivo Blob
      const pdfUrl = blobClient.url;
      const { Indentificador } = req.body;
      // Guardar el producto en la base de datos utilizando Prisma
      const nuevaConstancia = await prisma.constancias.create({
        data: {
          Constancia: pdfUrl,
          Indentificador,
          usuario: { connect: { id: userId } },
        },
      });

      res.status(200).json(nuevaConstancia);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error al guardar constancia" });
    }
  }
);

export default router;

