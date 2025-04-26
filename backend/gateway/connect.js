// /backend/gateway/connect.js
import { Gateway, Wallets } from 'fabric-network';
import fs from 'fs';
import { CONNECTION_PROFILE_PATH, WALLET_PATH } from '../paths.js';
import { getGateway, setGateway } from './gateway.js';
import { APP_USER } from '../constants.js';
import { getCurrentUser } from '../utils/getCurrentUser.js';

const currentRole = APP_USER;

export const connectToGateway = async ({ enrollViaUser = null } = {}) => {
    const user = enrollViaUser || await getCurrentUser();


    let gateway;
    if (!enrollViaUser) {
      gateway = await getGateway();
      if (gateway) return;
    }

    const ccp = JSON.parse(fs.readFileSync(CONNECTION_PROFILE_PATH, 'utf8'));
    // 1. Create in-memory wallet and load identity
    const wallet = await Wallets.newInMemoryWallet();
    await wallet.put(user.username, user.x509Identity);


    gateway = new Gateway();
    await gateway.connect(ccp, {
        wallet,
        identity: user.username,
        discovery: { enabled: true, asLocalhost: true },
    });

    setGateway(gateway);
    console.log('✅ Gateway connected');
};
