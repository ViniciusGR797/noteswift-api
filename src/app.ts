import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger/swaggerConfig';  

import binRoutes from './routes/binRoutes';
import folderRoutes from './routes/folderRoutes';
import libraryRoutes from './routes/libraryRoutes';
import noteRoutes from './routes/noteRoutes';
import userConfigRoutes from './routes/userConfigRoutes';
import userRoutes from './routes/userRoutes';

import { connectDB } from './utils/database'; // Importa apenas a função connectDB

const app = express();

// Conecte ao MongoDB uma vez, ao iniciar o aplicativo
connectDB();

app.use(express.json());

// Rotas da API
app.use('/bins', binRoutes);
app.use('/folders', folderRoutes);
app.use('/libraries', libraryRoutes);
app.use('/notes', noteRoutes);
app.use('/configs', userConfigRoutes);
app.use('/users', userRoutes);

// Configurações do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
