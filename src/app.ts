// src/app.ts

import express from 'express';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes';
import mongoose from 'mongoose';

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger/swaggerConfig';  

dotenv.config();

const app = express();

// Configurações do MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp';
mongoose.connect(mongoURI);

app.use(express.json());

// Rotas da API
app.use('/users', userRoutes);

// Configurações do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
