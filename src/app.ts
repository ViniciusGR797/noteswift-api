// src/app.ts

import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import dotenv from 'dotenv';

import userRoutes from './routes/userRoutes';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

// Configurações do MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp';
mongoose.connect(mongoURI);

app.use(express.json());

// Rotas da API
app.use('/users', userRoutes);

// Configurações do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gerenciamento de Anotações Online',
      version: '1.0.0',
      description: 'API para gerenciar anotações online',
      contact: {
        name: 'Seu Nome',
        url: 'https://seusite.com',
        email: 'seuemail@exemplo.com',
      },
      license: {
        name: 'Licença MIT',
        url: 'https://url-licenca.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento',
      },
      {
        url: 'https://api.suaempresa.com',
        description: 'Servidor de Homologação',
      },
      {
        url: 'https://api.suaempresa.com',
        description: 'Servidor de Produção',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
