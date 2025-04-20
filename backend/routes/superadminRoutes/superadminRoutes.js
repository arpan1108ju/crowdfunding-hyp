import express from "express";
import { changeRole } from "../../controllers/superadmin-controllers/changeRole.js";
import { superadminMiddleware } from "../../middlewares/superadminMiddleware.js";

const router = express.Router();

router.post('/users/:id',superadminMiddleware,changeRole);

export default router;