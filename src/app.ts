import express from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec, swaggerSpecJson } from './swagger/swaggerConfig';  

import binRoutes from './routes/binRoutes';
import folderRoutes from './routes/folderRoutes';
import libraryRoutes from './routes/libraryRoutes';
import noteRoutes from './routes/noteRoutes';
import userConfigRoutes from './routes/userConfigRoutes';
import userRoutes from './routes/userRoutes';

import { connectDB } from './utils/database'; 

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
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecJson));

export default app;
