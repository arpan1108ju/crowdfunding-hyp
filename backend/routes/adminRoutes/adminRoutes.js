import express from "express";
import { enrollUser } from "../../controllers/admin-controllers/enrollUser.js";
import { revokeUser } from "../../controllers/admin-controllers/revokeUser.js";
import { fetchOneUser } from "../../controllers/admin-controllers/fetchOneUser.js";
import { fetchAllUser } from "../../controllers/admin-controllers/fetchAllUser.js";
import { adminMiddleware } from "../../middlewares/adminMiddleware.js";

const router = express.Router();


router.get('/users/:id',adminMiddleware,fetchOneUser);
router.get('/users',adminMiddleware,fetchAllUser);
router.post('/users/:id/enroll',adminMiddleware,enrollUser);
router.post('/users/:id/revoke',adminMiddleware,revokeUser);


export default router;