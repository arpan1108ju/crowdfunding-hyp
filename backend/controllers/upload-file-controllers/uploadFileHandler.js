
// controllers/upload-file-controllers/uploadFileHandler.js
import { create } from "ipfs-http-client";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { sendError, sendSuccess } from "../../utils/responses.js";

dotenv.config();
const prisma = new PrismaClient();

const auth =
  "Basic " +
  Buffer.from(`${process.env.INFURA_PROJECT_ID}:${process.env.INFURA_PROJECT_SECRET}`).toString("base64");

const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

export const uploadFileHandler = async (req, res) => {
  try {
    if (!req.file) {
      return sendError(res, "No file uploaded", "Upload Error", 400);
    }

    // Upload to IPFS
    const result = await ipfs.add(req.file.buffer);
    const ipfsUrl = `https://ipfs.io/ipfs/${result.path}`;

    // Save in Prisma (assuming model is named 'file')
    const fileData = await prisma.file.create({
      data: {
        filename: req.file.originalname,
        mimetype: req.file.mimetype,
        ipfsUrl: ipfsUrl,
      },
    });

    sendSuccess(res, { message: "File uploaded successfully!", file: fileData });
  } catch (error) {
    console.error(error);
    sendError(res, error.message, "Upload Error", 500);
  }
};
