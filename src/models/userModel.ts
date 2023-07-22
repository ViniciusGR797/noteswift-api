import mongoose, { Schema, Document } from 'mongoose';
import { IFolder, folderSchema } from './folderModel';
import { IUserConfig, userConfigSchema } from './userConfigModel';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - _id
 *         - name
 *         - email
 *         - pwd
 *         - library
 *         - config
 *       properties:
 *         _id:
 *           type: string
 *           description: Identificador único do usuário
 *           example: "6123456789abcdef01234567"
 *         name:
 *           type: string
 *           description: Nome do usuário
 *           example: "Nome do usuário"
 *         email:
 *           type: string
 *           description: Email do usuário
 *           example: "email@example.com"
 *         pwd:
 *           type: string
 *           description: Senha do usuário
 *           example: "senha"
 *         library:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/Folder"
 *         config:
 *           $ref: "#/components/schemas/UserConfig"
 */

export interface IUser extends Document {
  _id: string | undefined;
  name: string;
  email: string;
  pwd: string;
  library: IFolder[];
  config: IUserConfig;
}

const userSchema = new Schema({
  _id: { type: String },
  name: { type: String, required: true },
  email: { type: String, required: true },
  pwd: { type: String, required: true },
  library: [folderSchema], 
  config: { type: userConfigSchema, required: true },
});

const User = mongoose.model<IUser>("User", userSchema);

/**
 * @swagger
 * components:
 *   schemas:
 *     UserCreation:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - pwd
 *       properties:
 *         name:
 *           type: string
 *           description: Nome do usuário
 *           example: "Nome do usuário"
 *         email:
 *           type: string
 *           description: Email do usuário
 *           example: "email@example.com"
 *         pwd:
 *           type: string
 *           description: Senha do usuário
 *           example: "senha"
 */

export interface IUserCreation extends Document {
  name: string;
  email: string;
  pwd: string;
}

const userCreationSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  pwd: { type: String, required: true },
});

const UserCreation = mongoose.model<IUserCreation>("UserCreation", userCreationSchema);

/**
 * @swagger
 * components:
 *   schemas:
 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - pwd
 *       properties:
 *         email:
 *           type: string
 *           description: Email do usuário
 *           example: "email@example.com"
 *         pwd:
 *           type: string
 *           description: Senha do usuário
 *           example: "senha"
 */

export interface IUserLogin extends Document {
  email: string;
  pwd: string;
}

const userLoginSchema = new Schema({
  email: { type: String, required: true },
  pwd: { type: String, required: true },
});

const UserLogin = mongoose.model<IUserLogin>("UserLogin", userLoginSchema);

export { User, UserCreation, UserLogin, userSchema, userCreationSchema, userLoginSchema };