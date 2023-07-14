import express, { Application } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import folderRoutes from './routes/folderRoutes';
import noteRoutes from './routes/noteRoutes';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger/swagger';

dotenv.config();

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.config();
    this.connectDatabase();
    this.setupRoutes();
    this.setupSwagger();
  }

  private config(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: false }));
  }

  private async connectDatabase(): Promise<void> {
    try {
      await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      });
      console.log('Connected to the database');
    } catch (error) {
      console.error('Failed to connect to the database:', error);
    }
  }

  private setupRoutes(): void {
    this.app.use('/api/folders', folderRoutes);
    this.app.use('/api/notes', noteRoutes);
  }

  private setupSwagger(): void {
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }
}

export default new App().app;
