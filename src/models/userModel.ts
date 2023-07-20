import { prop, getModelForClass, Ref } from '@typegoose/typegoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     Folder:
 *       type: object
 *       required:
 *         - _id
 *         - name
 *         - color
 *         - order
 *         - notes
 *       properties:
 *         _id:
 *           type: string
 *           description: Identificador único da pasta
 *           example: "6123456789abcdef01234567"
 *         name:
 *           type: string
 *           description: Nome da pasta
 *           example: "Nome da pasta"
 *         color:
 *           type: string
 *           description: Cor da pasta
 *           example: "#FF0000"
 *         order:
 *           type: integer
 *           description: Ordem da pasta
 *           example: 1
 *         notes:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/Note"
 */
class Folder {
  @prop({ required: true })
  public _id!: string;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public color!: string;

  @prop({ required: true })
  public order!: number;

  @prop({ required: true })
  public notes!: Ref<Note>[];
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Note:
 *       type: object
 *       required:
 *         - _id
 *         - title
 *         - body
 *         - style
 *         - trashed
 *         - deleted_date
 *         - update_at
 *       properties:
 *         _id:
 *           type: string
 *           description: Identificador único da nota
 *           example: "6123456789abcdef01234567"
 *         title:
 *           type: string
 *           description: Título da nota
 *           example: "Título da nota"
 *         body:
 *           type: string
 *           description: Corpo da nota
 *           example: "Corpo da nota"
 *         style:
 *           type: string
 *           description: Estilo da nota
 *           example: "Estilo da nota"
 *         trashed:
 *           type: boolean
 *           description: Indica se a nota está na lixeira
 *           example: false
 *         deleted_date:
 *           type: string
 *           description: Data de exclusão da nota
 *           example: "2022-01-01"
 *         update_at:
 *           type: string
 *           description: Data de atualização da nota
 *           example: "2022-01-01"
 */
class Note {
  @prop({ required: true })
  public _id!: string;

  @prop({ required: true })
  public title!: string;

  @prop({ required: true })
  public body!: string;

  @prop({ required: true })
  public style!: string;

  @prop({ required: true })
  public trashed!: boolean;

  @prop({ required: true })
  public deleted_date!: string;

  @prop({ required: true })
  public update_at!: string;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UserConfig:
 *       type: object
 *       required:
 *         - dark_mode
 *         - draft_notification
 *         - archived
 *         - auto_backup
 *         - news
 *       properties:
 *         dark_mode:
 *           type: boolean
 *           description: Indica se o modo escuro está ativado
 *           example: false
 *         draft_notification:
 *           type: boolean
 *           description: Indica se as notificações de rascunho estão ativadas
 *           example: true
 *         archived:
 *           type: boolean
 *           description: Indica se a funcionalidade de arquivamento está ativada
 *           example: true
 *         auto_backup:
 *           type: boolean
 *           description: Indica se o backup automático está ativado
 *           example: true
 *         news:
 *           type: boolean
 *           description: Indica se as notícias estão habilitadas
 *           example: true
 */
class UserConfig {
  @prop({ required: true })
  public dark_mode!: boolean;

  @prop({ required: true })
  public draft_notification!: boolean;

  @prop({ required: true })
  public archived!: boolean;

  @prop({ required: true })
  public auto_backup!: boolean;

  @prop({ required: true })
  public news!: boolean;
}

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

  @prop({ required: true })
  public library!: Ref<Folder>[];

  @prop({ required: true })
  public config!: UserConfig;
}

const UserModel = getModelForClass(User);

export { User, UserModel, Folder, Note };
