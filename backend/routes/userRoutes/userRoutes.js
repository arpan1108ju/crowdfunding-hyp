import express from "express";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { reEnrollUser } from "../../controllers/user-controllers/re-enrollUser.js";
import { getUserSelf } from "../../controllers/user-controllers/getUserSelf.js";
import { profileMiddleware } from "../../middlewares/profileMiddleware.js";
import { createPaymentIntent } from "../../controllers/user-controllers/payment.js";
import { getAllUserPayments } from "../../controllers/user-controllers/getAllUserPayments.js";


const router = express.Router();

router.post('/re-enroll',authMiddleware,reEnrollUser);
router.get('/',profileMiddleware , getUserSelf);

router.post('/payment',authMiddleware,createPaymentIntent);
router.get('/payment',authMiddleware,getAllUserPayments);


export default router;