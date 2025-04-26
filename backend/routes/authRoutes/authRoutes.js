import express from "express";
import { login } from "../../controllers/auth-controllers/login.js";
import { signup } from "../../controllers/auth-controllers/signup.js";
import { logout } from "../../controllers/auth-controllers/logout.js";


const router = express.Router();

router.post('/login',login);
router.post('/signup',signup);
router.post('/logout',logout);


export default router;