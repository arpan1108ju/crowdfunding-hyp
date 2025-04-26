
import { CONNECTION_PROFILE_PATH } from "../../paths.js";
import { CustomError } from "../../utils/customError.js";
import db from "../../utils/db.js";
import { sendError, sendSuccess } from "../../utils/responses.js";


import FabricCAServices from 'fabric-ca-client';
import fs from 'fs';
import { getCurrentUser } from "../../utils/getCurrentUser.js";
import { SUPERADMIN } from "../../constants.js";
import { Wallets } from "fabric-network";


// ******************** EXTREMELY DANGEROUS (WILL BREAK THE SYSTEM) **********************//


export const revokeSuperAdminHandler = async (req, res) => {
  try {
    const user = await getCurrentUser();
    const superadmin = await db.user.findUnique({
        where : {
            email : user.email
        }
    })
    const updatedSuperAdmin = await revokeSuperAdmin(superadmin);
    
    sendSuccess(res,updatedSuperAdmin, 'Revoked super-admin Successfully');
  } catch (error) {
    // Catch and handle CustomError
    sendError(res, error.details || error.message, error.message, error.statusCode || 500);
  }
};




async function revokeSuperAdmin(superadmin) {

           return null;

    //     if(!superadmin.x509Identity){
    //         throw new CustomError("Super Admin not enrolled",405);
    //     }

    //     const ccp = JSON.parse(fs.readFileSync(CONNECTION_PROFILE_PATH, 'utf8'));
    //     const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
    //     if (!caURL.startsWith('https://')) {
    //         throw new CustomError('Error: The CA URL must start with https://');
    //     }
    //     const ca = new FabricCAServices(caURL);

    // // 1. Create in-memory wallet and load identity
    //     const wallet = await Wallets.newInMemoryWallet();
    //     await wallet.put(superadmin.id, superadmin.x509Identity);
    
    //     // 2. Get provider and user context
    //     const provider = wallet.getProviderRegistry().getProvider(superadmin.x509Identity.type);
    //     const superadminUser = await provider.getUserContext(superadmin.x509Identity, superadmin.id);
    

    //     await ca.revoke({ enrollmentID: SUPERADMIN}, superadminUser);


    //     // Store in DB
    //     const updatedSuperAdmin = await db.user.update({
    //         where: { id : superadmin.id },
    //         data: {
    //         isVerified : false,
    //         x509Identity : null
    //         },
    //         select: {
    //         id: true,
    //         username: true,
    //         email: true,
    //         isVerified: true,
    //         createdAt: true,
    //         role : true,
    //         }
    //     });
        
    //     console.log('❌ Revoked super-admin Successfully');

    //     return updatedSuperAdmin;

}

