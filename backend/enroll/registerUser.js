import FabricCAServices from 'fabric-ca-client';
import { Wallets } from 'fabric-network';

import fs from 'fs';

import { CONNECTION_PROFILE_PATH , WALLET_PATH } from '../paths.js';
import { APP_ADMIN, APP_USER } from '../constants.js';


async function registerUser() {
    try {
        const ccp = JSON.parse(fs.readFileSync(CONNECTION_PROFILE_PATH, 'utf8'));

        const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
        const ca = new FabricCAServices(caURL);

        const wallet = await Wallets.newFileSystemWallet(WALLET_PATH);

        const userExists = await wallet.get(APP_USER);
        if (userExists) {
            console.log('appUser already exists in wallet');
            return;
        }

        const adminIdentity = await wallet.get(APP_ADMIN);
        if (!adminIdentity) {
            console.log('Admin identity not found in wallet');
            return;
        }

        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, APP_ADMIN);

        const secret = await ca.register({
            affiliation: 'org1.department1',
            enrollmentID: APP_USER,
            role: 'client'
        }, adminUser);

        const enrollment = await ca.enroll({
            enrollmentID: APP_USER,
            enrollmentSecret: secret
        });

        const x509Identity = {
            credentials: {
                certificate: enrollment.certificate,
                privateKey: enrollment.key.toBytes(),
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };

        await wallet.put(APP_USER, x509Identity);
        console.log('✅ Successfully registered and enrolled appUser');
    } catch (error) {
        console.error(`❌ Error registering user: ${error}`);
    }
}

registerUser();
