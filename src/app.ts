import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerDefinition from './swagger/swagger';

dotenv.config();

const app = express();

app.use(express.json());

// Configuração do Swagger
const swaggerOptions = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'], // Caminho para os arquivos de rotas, ajuste conforme a sua estrutura
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas
// Adicione as rotas aqui
// Exemplo: app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
  });

export default app;
