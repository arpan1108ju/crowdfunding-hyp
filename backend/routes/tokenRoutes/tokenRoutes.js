import express from "express";
import { getBalanceHandler } from "../../controllers/token-controllers/getBalance.js";
import { getExchangeRateHandler } from "../../controllers/token-controllers/getExchangeRate.js";
import { setExchangeRateHandler } from "../../controllers/token-controllers/setExchangeRate.js";
import { getTokenMetadataHandler } from "../../controllers/token-controllers/getTokenMetadata.js";
import { setTokenMetadataHandler } from "../../controllers/token-controllers/setTokenMetadata.js";
import { mintTokenHandler } from "../../controllers/token-controllers/mintToken.js";
import { getUserPaymentsHandler } from "../../controllers/token-controllers/getUserPayments.js";

import { adminMiddleware } from "../../middlewares/adminMiddleware.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";
import { getAllExchangeRateHandler } from "../../controllers/token-controllers/getAllExchangeRate.js";
import { getClientIdFromX509Handler } from "../../controllers/token-controllers/getClientIdFromX509.js";


const router = express.Router();

router.get("/balance", authMiddleware, getBalanceHandler);
router.get("/exchange-rate", authMiddleware, getExchangeRateHandler);
router.get("/metadata", authMiddleware, getTokenMetadataHandler);
router.get("/payments", authMiddleware, getUserPaymentsHandler);

router.get("/exchange-rates",authMiddleware,getAllExchangeRateHandler);
router.get("/client-id",adminMiddleware,getClientIdFromX509Handler);

router.post("/exchange-rate", adminMiddleware, setExchangeRateHandler);
router.post("/metadata", adminMiddleware, setTokenMetadataHandler);

router.post("/mint", authMiddleware, mintTokenHandler);

export default router;
