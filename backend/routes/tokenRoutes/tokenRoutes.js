import express from "express";
import { getBalanceHandler } from "../../controllers/token-controllers/getBalance.js";
import { getExchangeRateHandler } from "../../controllers/token-controllers/getExchangeRate.js";
import { setExchangeRateHandler } from "../../controllers/token-controllers/setExchangeRate.js";
import { getTokenMetadataHandler } from "../../controllers/token-controllers/getTokenMetadata.js";
import { setTokenMetadataHandler } from "../../controllers/token-controllers/setTokenMetadata.js";
import { minTokenHandler } from "../../controllers/token-controllers/minToken.js";

const router = express.Router();

router.get("/balance",getBalanceHandler);
router.get('/exchange-rate',getExchangeRateHandler);
router.get('/metadata',getTokenMetadataHandler);

router.post('/exchange-rate',setExchangeRateHandler);
router.post('/metadata',setTokenMetadataHandler);
router.post('/mint',minTokenHandler);

export default router;
