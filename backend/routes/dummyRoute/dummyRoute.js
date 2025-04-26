import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { dummyHandler } from "../../controllers/dummy-controllers/dummy.js";

const router = express.Router();

router.get('/protected', authMiddleware, dummyHandler);


export default router;