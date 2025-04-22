
import FabricCAServices from 'fabric-ca-client';
import fs from 'fs';
import { Wallets } from "fabric-network";
import { CONNECTION_PROFILE_PATH } from '../paths.js';
import { CustomError } from '../utils/customError.js';
import db from '../utils/db.js';


export async function revoke(admin, client,role) {
  
    if(!admin.x509Identity){
       throw new CustomError("Admin not enrolled (prefrebly re-login).",405);
    }

    if(!client.x509Identity){
       throw new CustomError(`${client.username} not enrolled`,405);
    }

    const ccp = JSON.parse(fs.readFileSync(CONNECTION_PROFILE_PATH, 'utf8'));
    const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
    const ca = new FabricCAServices(caURL);

    // 1. Create in-memory wallet and load identity
    const wallet = await Wallets.newInMemoryWallet();
    await wallet.put(admin.id, admin.x509Identity);

    // 2. Get provider and user context
    const provider = wallet.getProviderRegistry().getProvider(admin.x509Identity.type);
    const adminUser = await provider.getUserContext(admin.x509Identity, admin.id);


    await ca.revoke({ enrollmentID: client.email }, adminUser);

    // Optionally mark the user as not verified in DB
    const updatedUser = await db.user.update({
      where: { id: client.id },
      data: {
        isVerified: false,
        x509Identity: null, // optionally clear cert
      },
      select: {
        id: true,
        username: true,
        email: true,
        isVerified: true,
        createdAt: true,
        role : true
      }
    });

    console.log(`❌ Revoked ${role} access for ${client.email} by ${admin.username}`);
    return updatedUser;
}