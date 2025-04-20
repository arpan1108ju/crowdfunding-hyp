import express from "express";
import { getAllCampaignsHandler } from "../../controllers/campaign-controllers/getAllCampaigns.js";
import { getCampaignHandler } from "../../controllers/campaign-controllers/getCampaign.js";
import { createCampaignHandler } from "../../controllers/campaign-controllers/createCampaign.js";
import { donateCampaignHandler } from "../../controllers/campaign-controllers/donateCampaign.js";
import { withdrawCampaignHandler } from "../../controllers/campaign-controllers/withdrawCampaign.js";
import { cancelCampaignHandler } from "../../controllers/campaign-controllers/cancelCampaign.js";
import { deleteCampaignHandler } from "../../controllers/campaign-controllers/deleteCampaign.js";
import { updateCampaignHandler } from "../../controllers/campaign-controllers/updateCampaign.js";
import {authMiddleware} from "../../middlewares/authMiddleware.js"
import { adminMiddleware } from "../../middlewares/adminMiddleware.js";

const router = express.Router();

router.get('/',authMiddleware,getAllCampaignsHandler);
router.get('/:id',authMiddleware,getCampaignHandler);

router.post('/',adminMiddleware,createCampaignHandler);

router.post('/:id/donate',authMiddleware,donateCampaignHandler);
router.post('/:id/withdraw',adminMiddleware,withdrawCampaignHandler);
router.post('/:id/cancel',adminMiddleware,cancelCampaignHandler);
router.patch('/:id',adminMiddleware,updateCampaignHandler);
router.delete('/:id',adminMiddleware,deleteCampaignHandler);


export default router;