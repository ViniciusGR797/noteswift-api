import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { Folder } from './folderModel';  
import { UserConfig } from './userConfigModel';

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

class User {
  @prop({ required: true })
  public _id!: string;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public email!: string;

  @prop({ required: true })
  public pwd!: string;

  @prop({ required: true, type: () => [Folder] })
  public library!: Ref<Folder>[];

  @prop({ required: true, type: () => UserConfig })
  public config!: UserConfig;
}

const UserModel = getModelForClass(User);

export { User, UserModel };
