
import FabricCAServices from 'fabric-ca-client';
import fs from 'fs';
import { Wallets } from "fabric-network";
import { CONNECTION_PROFILE_PATH } from '../paths.js';
import { CustomError } from '../utils/customError.js';
import db from '../utils/db.js';
import { FabricRoles } from '../constants.js';


export async function enroll(admin, client,role) {
  
    if(!admin.x509Identity){
       throw new CustomError("Admin not enrolled (prefrebly re-login).",405);
    }

    if(client.x509Identity){
       throw new CustomError("User already enrolled",405);
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


    let attrs = [];
    if (role === FabricRoles.ADMIN) {
      attrs.push(
        { name: 'hf.Registrar.Roles', value: 'client,admin', ecert: true },
        { name: 'hf.Registrar.Attributes', value: '*', ecert: true },
        { name: 'hf.Revoker', value: 'true', ecert: true },
      );
    }

    // Use adminIdentity passed in to register user
    const secret = await ca.register({
      affiliation: 'org1.department1',
      enrollmentID: client.email,
      role: role,
      attrs
    }, adminUser);

    const enrollment = await ca.enroll({
      enrollmentID: client.email,
      enrollmentSecret: secret,
    });

    const x509Identity = {
      credentials: {
          certificate: enrollment.certificate,
          privateKey: enrollment.key.toBytes(),
      },
      mspId: 'Org1MSP',
      type: 'X.509',
    };
    // Store in DB
    const updatedUser = await db.user.update({
      where: { id: client.id },
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
        role : true
      }
    });

    console.log(`✅ Successfully registered ${role} and enrolled ${client.username} by ${admin.username}`);

    return updatedUser;
  
}