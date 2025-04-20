import express from "express";
import { enrollUser } from "../../controllers/admin-controllers/enrollUser.js";
import { revokeUser } from "../../controllers/admin-controllers/revokeUser.js";
import { fetchOneUser } from "../../controllers/admin-controllers/fetchOneUser.js";
import { fetchAllUser } from "../../controllers/admin-controllers/fetchAllUser.js";

const router = express.Router();


router.get('/fetch-one-user/:id',fetchOneUser);
router.get('/fetch-all-users',fetchAllUser);
router.post('/enroll-user/:id',enrollUser);
router.post('/revoke-user',revokeUser);


export default router;