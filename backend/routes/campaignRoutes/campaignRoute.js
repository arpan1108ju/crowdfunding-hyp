import express from "express";
import { getAllCampaignsHandler } from "../../controllers/campaign-controllers/getAllCampaigns.js";
import { getCampaignHandler } from "../../controllers/campaign-controllers/getCampaign.js";
import { createCampaignHandler } from "../../controllers/campaign-controllers/createCampaign.js";
import { donateCampaignHandler } from "../../controllers/campaign-controllers/donateCampaign.js";
import { withdrawCampaignHandler } from "../../controllers/campaign-controllers/withdrawCampaign.js";
import { cancelCampaignHandler } from "../../controllers/campaign-controllers/cancelCampaign.js";
import { deleteCampaignHandler } from "../../controllers/campaign-controllers/deleteCampaign.js";
import { updateCampaignHandler } from "../../controllers/campaign-controllers/updateCampaign.js";
import {authenticateToken} from "../../middlewares/authMiddleware.js"

const router = express.Router();

router.get('/',authenticateToken,getAllCampaignsHandler);
router.get('/:id',authenticateToken,getCampaignHandler);

router.post('/',authenticateToken,createCampaignHandler);

router.post('/:id/donate',authenticateToken,donateCampaignHandler);
router.post('/:id/withdraw',authenticateToken,withdrawCampaignHandler);
router.post('/:id/cancel',authenticateToken,cancelCampaignHandler);
router.patch('/:id',authenticateToken,updateCampaignHandler);
router.delete('/:id',authenticateToken,deleteCampaignHandler);


export default router;