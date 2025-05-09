
import { CONNECTION_PROFILE_PATH } from "../../paths.js";
import { CustomError } from "../../utils/customError.js";
import db from "../../utils/db.js";
import { sendError, sendSuccess } from "../../utils/responses.js";


import FabricCAServices from 'fabric-ca-client';
import fs from 'fs';
import { getCurrentUser } from "../../utils/getCurrentUser.js";


export const enrollSuperAdminHandler = async (req, res) => {
  try {
    const user = await getCurrentUser();
    const superadmin = await db.user.findUnique({
        where : {
            email : user.email
        }
    })
    const updatedSuperAdmin = await enrollSuperAdmin(superadmin);
    
    sendSuccess(res,updatedSuperAdmin, '✅ Successfully enrolled super-admin');
  } catch (error) {
    // Catch and handle CustomError
    sendError(res, error.details || error.message, error.message, error.statusCode || 500);
  }
};




async function enrollSuperAdmin(superadmin) {

        if(superadmin.x509Identity){
            throw new CustomError("Super Admin already enrolled",405);
        }

        const ccp = JSON.parse(fs.readFileSync(CONNECTION_PROFILE_PATH, 'utf8'));
        const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
        if (!caURL.startsWith('https://')) {
            throw new CustomError('Error: The CA URL must start with https://');
        }
        const ca = new FabricCAServices(caURL);

        const enrollment = await ca.enroll({
            enrollmentID: 'admin',
            enrollmentSecret: 'adminpw',
        });
        // Create and store identity
        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };

        // Store in DB
        const updatedSuperAdmin = await db.user.update({
            where: { id : superadmin.id },
            data: {
            isVerified : true,
            x509Identity
            },
            select: {
            id: true,
            username: true,
            email: true,
            isVerified: true,
            createdAt: true,
            role : true,
            }
        });
        
        console.log('✅ Successfully enrolled admin');

        return updatedSuperAdmin;

}

