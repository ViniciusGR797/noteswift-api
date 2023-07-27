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

const userSchema = new Schema(
  {
    _id: { 
      type: String,
      required: true,
    },
    name: { 
      type: String, 
      required: true,
      trim: true
    },
    email: { 
      type: String, 
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Email inválido'
      ]
    },
    pwd: { 
      type: String, 
      required: true,
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Senha fraca. A senha deve ter no mínimo 8 caracteres, incluindo pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial (@ $ ! % * ? &)'
      ]
    },
    library: [folderSchema], 
    config: { 
      type: userConfigSchema, 
      required: true 
    },
  }
);

const User = mongoose.model<IUser>("User", userSchema);

/**
 * @swagger
 * components:
 *   schemas:
 *     UpsertUser:
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

export interface IUpsertUser extends Document {
  name: string;
  email: string;
  pwd: string;
}

const upsertUserSchema = new Schema(
  {
    name: { 
      type: String, 
      required: true,
      trim: true
    },
    email: { 
      type: String, 
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          'Email inválido'
      ]
    },
    pwd: { 
      type: String, 
      required: true,
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Senha fraca. A senha deve ter no mínimo 8 caracteres, incluindo pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial (@ $ ! % * ? &)'
      ]
    },
  },{ 
    _id: false 
  }
);

const UpsertUser = mongoose.model<IUpsertUser>("UpsertUser", upsertUserSchema);

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

const userLoginSchema = new Schema(
  {
    email: { 
      type: String, 
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          'Email inválido'
      ]
    },
    pwd: { 
      type: String, 
      required: true,
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Senha fraca. A senha deve ter no mínimo 8 caracteres, incluindo pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial (@ $ ! % * ? &)'
      ]
    },
  },{ 
    _id: false 
  }
);

const UserLogin = mongoose.model<IUserLogin>("UserLogin", userLoginSchema);

export { User, UpsertUser, UserLogin, userSchema, upsertUserSchema, userLoginSchema };