// add express

import express from 'express';
import cors from 'cors';
import { PORT } from './config.js';


import dummyRoute from "./routes/dummyRoute/dummyRoute.js";
import adminRoutes from "./routes/adminRoutes/adminRoutes.js";
import userRoutes from "./routes/userRoutes/userRoutes.js";
import campaignRoutes from "./routes/campaignRoutes/campaignRoute.js";
import tokenRoutes from "./routes/tokenRoutes/tokenRoutes.js";

import { errorHandler, notFound } from './middlewares/errorMiddleware.js';

const app = express();


app.use(cors())
app.use(express.json());

app.use('/api/v1/users',userRoutes);
app.use('/api/v1/campaigns',campaignRoutes);

app.use('/api/v1/dummy',dummyRoute);

//admin
app.use('/api/v1/admin',adminRoutes);
app.use('/api/v1/token',tokenRoutes);

app.use(notFound);
app.use(errorHandler);


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});