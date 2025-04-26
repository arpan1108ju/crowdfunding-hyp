import { sendSuccess, sendError } from "../../utils/responses.js";
import { getCurrentUser } from "../../utils/getCurrentUser.js";
import { mintTokenSchema } from "../../utils/apiSchema.js";
import { CustomError } from "../../utils/customError.js";

import db from "../../utils/db.js";
import Stripe from "stripe";
import { STRIPE_SECRET_KEY } from "../../config.js";

// Currency conversion multipliers (amount to smallest unit)
const CURRENCY_MULTIPLIERS = {
  USD: 100, // 1 USD = 100 cents
  EUR: 100, // 1 EUR = 100 cents
  GBP: 100, // 1 GBP = 100 pence
  INR: 100, // 1 INR = 100 paise
  AUD: 100, // 1 AUD = 100 cents
  CAD: 100, // 1 CAD = 100 cents
  JPY: 1, // 1 JPY = 1 yen (no smaller unit)
  CNY: 100, // 1 CNY = 100 fen
  SGD: 100, // 1 SGD = 100 cents
  NZD: 100, // 1 NZD = 100 cents
  CHF: 100, // 1 CHF = 100 rappen
  HKD: 100, // 1 HKD = 100 cents
  SEK: 100, // 1 SEK = 100 öre
  NOK: 100, // 1 NOK = 100 øre
  DKK: 100, // 1 DKK = 100 øre
  ZAR: 100, // 1 ZAR = 100 cents
  BRL: 100, // 1 BRL = 100 centavos
  MXN: 100, // 1 MXN = 100 centavos
};

export const createPaymentIntent = async (req, res) => {
  try {
    const user = await getCurrentUser();

    const userAgain = await db.user.findFirst({
       where : {
         email : user.email
       }
    })

    const validation = mintTokenSchema.safeParse(req.body);

    if (!validation.success) {
      throw new CustomError(
        validation.error.issues
          .map((e) => `${e.path.join(".")}: ${e.message}`)
          .join(" | "),
        400
      );
    }

    const { currency, amountPaid } = validation.data;

    console.log("Received amount:", amountPaid);
    console.log("Received currency:", currency);

    const stripe = new Stripe(STRIPE_SECRET_KEY);

    // Get the multiplier for the currency
    const multiplier = CURRENCY_MULTIPLIERS[currency];
    if (!multiplier) {
      throw new CustomError(`Unsupported currency: ${currency}`, 400);
    }

    // Convert amount to smallest currency unit
    const amountInSmallestUnit = Math.round(amountPaid * multiplier);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInSmallestUnit,
      currency: currency.toLowerCase(),
      payment_method_types: ["card"],
    });

    await db.payment.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        paymentIntentId: paymentIntent.id,
        amountPaid: amountPaid,
        currency: currency,
        status: paymentIntent.status,
      },
    });
    


    console.log("Payment intent created successfully");

    sendSuccess(
      res,
      {
        clientSecret: paymentIntent.client_secret,
      },
      "Payment intent created successfully."
    );
  } catch (error) {
    console.error("Payment intent creation failed:", error);
    sendError(
      res,
      error.details || error.message,
      error.message,
      error.statusCode || 500
    );
  }
};
