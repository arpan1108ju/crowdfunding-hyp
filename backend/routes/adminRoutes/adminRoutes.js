import express from "express";
import { enrollUser } from "../../controllers/admin-controllers/enrollUser.js";
import { revokeUser } from "../../controllers/admin-controllers/revokeUser.js";
import { fetchOneUser } from "../../controllers/admin-controllers/fetchOneUser.js";
import { fetchAllUser } from "../../controllers/admin-controllers/fetchAllUser.js";

const router = express.Router();


router.get('/users/:id',fetchOneUser);
router.get('/users',fetchAllUser);
router.post('/users/:id/enroll',enrollUser);
router.post('/users/:id/revoke',revokeUser);


export default router;