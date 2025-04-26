import FabricCAServices from 'fabric-ca-client';
import fs from 'fs';
import { Wallets } from "fabric-network";
import { CONNECTION_PROFILE_PATH } from '../paths.js';
import { CustomError } from '../utils/customError.js';
import db from '../utils/db.js';

export async function reenroll(client) {
  
    if (client.isRevoked) {
      throw new CustomError(`${client.username} has been revoked, cannot reenroll.`, 405);       
    }

    if (!client.x509Identity) {
      throw new CustomError(`${client.username} is not enrolled.`, 405);       
    }

    const ccp = JSON.parse(fs.readFileSync(CONNECTION_PROFILE_PATH, 'utf8'));
    const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
    const caTLSCACerts = fs.readFileSync(caInfo.tlsCACerts.path);
    const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

    // 1. Create in-memory wallet and load identity
    const wallet = await Wallets.newInMemoryWallet();
    await wallet.put(client.id, client.x509Identity);

    // 2. Get provider and user context
    const provider = wallet.getProviderRegistry().getProvider(client.x509Identity.type);
    const clientUser = await provider.getUserContext(client.x509Identity, client.id);

    // 3. Reenroll using existing identity
    const reenrollment = await ca.reenroll(clientUser);

    const x509Identity = {
      credentials: {
        certificate: reenrollment.certificate,
        privateKey: reenrollment.key.toBytes(),
      },
      mspId: 'Org1MSP',
      type: 'X.509',
    };

    // 4. Update in database
    const updatedUser = await db.user.update({
      where: { id: client.id },
      data: {
        isVerified: true,
        x509Identity: x509Identity,
        isRevoked: false
      },
      select: {
        id: true,
        username: true,
        email: true,
        isVerified: true,
        createdAt: true,
        role: true,
        x509Identity: true
      }
    });

    console.log(`✅ Successfully reenrolled ${client.username}`);
    return updatedUser;
}
