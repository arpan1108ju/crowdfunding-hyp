import dotenv from 'dotenv';

dotenv.config({
    path: "./env",
});

const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL;
const SALT_LENGTH = process.env.SALT_LENGTH || 10;
const EXP_TIME = process.env.EXP_TIME || 7;
const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_key";
export {
    PORT,
    DATABASE_URL,
    SALT_LENGTH,
    EXP_TIME,
    JWT_SECRET
};
