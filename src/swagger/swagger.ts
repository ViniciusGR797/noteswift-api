import { SwaggerDefinition } from 'swagger-ui-express';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API de Gerenciamento de Anotações',
    version: '1.0.0',
    description: 'Uma API para gerenciar anotações online',
  },
  servers: [
    {
      url: 'http://localhost:3000', // Substitua pela URL correta da sua API
    },
  ],
};

export default swaggerDefinition;
