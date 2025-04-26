// add express

import express from 'express';
import cors from 'cors';
import { FRONT_END_FALLBACK_URL, FRONT_END_URL, PORT } from './config.js';
import cookieParser from 'cookie-parser';

import dummyRoute from "./routes/dummyRoute/dummyRoute.js";
import adminRoutes from "./routes/adminRoutes/adminRoutes.js";
import authRoutes from "./routes/authRoutes/authRoutes.js";
import campaignRoutes from "./routes/campaignRoutes/campaignRoute.js";
import tokenRoutes from "./routes/tokenRoutes/tokenRoutes.js";
import uploadRoutes from "./routes/uploadRoutes/uploadRoutes.js";
import superadminRoutes from "./routes/superadminRoutes/superadminRoutes.js";

import { errorHandler, notFound } from './middlewares/errorMiddleware.js';
import { contextMiddleware } from './middlewares/requestContextMiddleware.js';

const app = express();


const allowedOrigins = [
    FRONT_END_URL,
    FRONT_END_FALLBACK_URL,
    'https://your-production-frontend.com'
];
  
app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
}));


app.use(express.json());
app.use(cookieParser());
app.use(contextMiddleware); 

app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/campaigns',campaignRoutes);

app.use('/api/v1/dummy',dummyRoute);

//admin
app.use('/api/v1/admin',adminRoutes);
app.use('/api/v1/superadmin',superadminRoutes);
app.use('/api/v1/token',tokenRoutes);

//just for testing
app.use('/api/v1/upload',uploadRoutes);

app.use(notFound);
app.use(errorHandler);


app.listen(PORT, () => {
    console.log('======================================')
    console.log(`Server is running on port:${PORT}`);
    console.log('======================================')
});