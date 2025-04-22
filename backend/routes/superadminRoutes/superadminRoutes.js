import express from "express";
import { changeRole } from "../../controllers/superadmin-controllers/changeRole.js";
import { superadminMiddleware } from "../../middlewares/superadminMiddleware.js";
import { enrollAdminHandler } from "../../controllers/superadmin-controllers/enrollAdmin.js";
import { enrollSuperAdminHandler } from "../../controllers/superadmin-controllers/enrollSuperadmin.js";
import { revokeAdminHandler } from "../../controllers/superadmin-controllers/revokeAdmin.js";
import { revokeSuperAdminHandler } from "../../controllers/superadmin-controllers/revokeSuperadmin.js";

const router = express.Router();

router.post("/users/:id", superadminMiddleware, changeRole);
router.post("/admins/:id/enroll", superadminMiddleware, enrollAdminHandler);
router.post("/admins/:id/revoke", superadminMiddleware, revokeAdminHandler);
router.post("/enroll", superadminMiddleware, enrollSuperAdminHandler);

// router.post("/revoke", superadminMiddleware, revokeSuperAdminHandler);

export default router;
