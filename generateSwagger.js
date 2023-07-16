const swaggerJSDoc = require('swagger-jsdoc');
const fs = require('fs');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Exemplo',
      version: '1.0.0',
      description: 'Uma API de exemplo usando Node.js, MongoDB e Swagger'
    }
  },
  apis: ['./*.js'] // Especifique os arquivos onde você adicionou as anotações JSDoc
};

const swaggerSpec = swaggerJSDoc(options);

fs.writeFileSync('./swagger.json', JSON.stringify(swaggerSpec, null, 2));
console.log('Arquivo swagger.json gerado com sucesso!');
