import dotenv from 'dotenv';

dotenv.config({
    path : "./.env"
});

const PORT = Number(process.env.PORT || "5000");
const DATABASE_URL = process.env.DATABASE_URL;
const SALT_LENGTH = Number(process.env.SALT_LENGTH || "10");
const EXP_TIME = process.env.EXP_TIME || "7d";
const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key";
const FRONT_END_URL = process.env.FRONT_END_URL || "http://localhost:3000";
const FRONT_END_FALLBACK_URL = process.env.FRONT_END_FALLBACK_URL || "http://localhost:3001";
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
export {
    PORT,
    DATABASE_URL,
    SALT_LENGTH,
    EXP_TIME,
    JWT_SECRET,
    FRONT_END_URL,
    FRONT_END_FALLBACK_URL,
    STRIPE_SECRET_KEY
};
