import dotenv from 'dotenv';

dotenv.config({
    path: "./env",
});

const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.DATABASE_URL;
export {
    PORT,
    DATABASE_URL
};