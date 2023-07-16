// src/swagger/swagger.ts

import swaggerJSDoc from 'swagger-jsdoc';
import fs from 'fs';
import path from 'path';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gerenciamento de Anotações Online',
      version: '1.0.0',
      description: 'API para gerenciar anotações online',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

console.log(swaggerSpec);

const outputFile = path.resolve(__dirname, 'swagger.json');
fs.writeFileSync(outputFile, JSON.stringify(swaggerSpec, null, 2));

export default swaggerSpec;
