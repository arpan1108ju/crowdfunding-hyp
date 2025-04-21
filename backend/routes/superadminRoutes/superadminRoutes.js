import express from "express";
import { changeRole } from "../../controllers/superadmin-controllers/changeRole.js";
import { superadminMiddleware } from "../../middlewares/superadminMiddleware.js";
import { enrollAdminHandler } from "../../controllers/superadmin-controllers/enrollAdmin.js";
import { enrollSuperAdminHandler } from "../../controllers/superadmin-controllers/enrollSuperadmin.js";

const router = express.Router();

router.post('/users/:id',superadminMiddleware,changeRole);
router.post('/admins/:id/enroll',superadminMiddleware,enrollAdminHandler);
router.post('/enroll',superadminMiddleware,enrollSuperAdminHandler);

export default router;