import express from "express";
import { enrollUser } from "../../controllers/admin-controllers/enrollUser.js";
import { revokeUser } from "../../controllers/admin-controllers/revokeUser.js";
import { fetchOneUser } from "../../controllers/admin-controllers/fetchOneUser.js";
import { fetchAllUser } from "../../controllers/admin-controllers/fetchAllUser.js";
import { adminMiddleware } from "../../middlewares/adminMiddleware.js";
import { adminAndSuperadminMiddleware } from "../../middlewares/adminAndSuperadminMiddleware.js";

const router = express.Router();


router.get('/users/:id',adminAndSuperadminMiddleware,fetchOneUser);
router.get('/users',adminAndSuperadminMiddleware,fetchAllUser);
router.post('/users/:id/enroll',adminMiddleware,enrollUser);
router.post('/users/:id/revoke',adminMiddleware,revokeUser);


export default router;