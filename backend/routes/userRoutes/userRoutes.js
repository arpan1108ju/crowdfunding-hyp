import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { reEnrollUser } from "../../controllers/user-controllers/re-enrollUser.js";
import { getUserSelf } from "../../controllers/user-controllers/getUserSelf.js";
import { profileMiddleware } from "../../middlewares/profileMiddleware.js";


const router = express.Router();

router.post('/re-enroll',authMiddleware,reEnrollUser);
router.get('/',profileMiddleware , getUserSelf);


export default router;