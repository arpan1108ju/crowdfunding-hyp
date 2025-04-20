import { sendSuccess, sendError } from "../../utils/responses.js";
import db from "../../utils/db.js";
import { CustomError } from "../../utils/customError.js";
import { CONNECTION_PROFILE_PATH } from "../../paths.js";

import FabricCAServices from 'fabric-ca-client';
import fs from 'fs';

export const enrollUser = async (req, res) => {
  try {

    const { id } = req.params;

    // Step 1: Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new CustomError("User not found", 404);
    }

    // call enroll user here

    const admin = req.user;

    await registerUser(admin.x509Identity,existingUser);

    // Step 2: Update isVerified to true
    const updatedUser = await db.user.update({
      where: { id },
      data: { isVerified: true },
      select: {
        id: true,
        username: true,
        email: true,
        isVerified: true,
        createdAt: true,
      }
    });

    // Step 3: Send success response
    sendSuccess(res, updatedUser, "User successfully enrolled (verified).");
  } catch (error) {
    sendError(res, error.details || error.message , error.message, error.statusCode || 500);
  }
};



async function registerUser(adminIdentity, existingUser) {
  try {
    const ccp = JSON.parse(fs.readFileSync(CONNECTION_PROFILE_PATH, 'utf8'));
    const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
    const ca = new FabricCAServices(caURL);

    // Use adminIdentity passed in to register user
    const secret = await ca.register({
      affiliation: 'org1.department1',
      enrollmentID: existingUser.email,
      role: 'client',
    }, adminIdentity);

    const enrollment = await ca.enroll({
      enrollmentID: existingUser.email,
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
    await db.user.update({
      where: { id: existingUser.id },
      data: {
        x509Identity
      },
    });

    console.log(`✅ Successfully registered and enrolled ${existingUser.username}`);
  } catch (error) {
    console.error(`❌ Error registering user: ${error.message}`);
    throw error;
  }
}