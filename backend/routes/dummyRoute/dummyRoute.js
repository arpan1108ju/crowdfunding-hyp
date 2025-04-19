import express from "express";
import { authenticateToken } from "../../middlewares/authMiddleware.js";
import { dummyHandler } from "../../controllers/dummy-controllers/dummy.js";

const router = express.Router();

router.get('/protected', authenticateToken, dummyHandler);



export default router;