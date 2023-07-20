import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './swagger/swaggerConfig';  

// import binRoutes from './routes/binRoutes';
// import folderRoutes from './routes/folderRoutes';
// import libraryRoutes from './routes/libraryRoutes';
// import noteRoutes from './routes/noteRoutes';
// import userConfigRoutes from './routes/userConfigRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();

// Configurações do MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp';
mongoose.connect(mongoURI);

app.use(express.json());

// Rotas da API
// app.use('/bin', binRoutes);
// app.use('/folder', folderRoutes);
// app.use('/library', libraryRoutes);
// app.use('/note', noteRoutes);
// app.use('/config', userConfigRoutes);
app.use('/users', userRoutes);

// Configurações do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
