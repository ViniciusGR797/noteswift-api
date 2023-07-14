import 'reflect-metadata';
//import express from 'express';
import { createExpressServer, useContainer, Action } from 'routing-controllers';
import { Container } from 'typedi';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { getMetadataArgsStorage } from 'routing-controllers';
import { join } from 'path';
import * as swaggerUi from 'swagger-ui-express';

// Controllers
import { UserController } from './controllers/userController';

// Configure routing-controllers to use typedi container
useContainer(Container);

// Create express app
const app = createExpressServer({
  controllers: [UserController],
});

// Generate Swagger spec
const storage = getMetadataArgsStorage();
const spec = routingControllersToSpec(storage, {}, {
  components: {
    securitySchemes: {
      jwt: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
});

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(spec));

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
