import { IsString, IsBoolean, IsNotEmpty, Matches } from 'class-validator';
import { ObjectId } from "mongodb";
import moment from 'moment-timezone';
import { IsObjectId } from '../utils/validate';

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
 *           example: true
 *         deleted_date:
 *           type: string
 *           description: Data de exclusão da nota
 *           example: "2022-01-01 10:30:00"
 *         update_at:
 *           type: string
 *           description: Data de atualização da nota
 *           example: "2022-01-01 10:30:00"
 */

class Note {
  @IsObjectId({ message: 'O campo _id deve ser um ObjectId válido' })
  @IsNotEmpty({ message: 'O campo _id é obrigatório' })
  _id: ObjectId;

  @IsString({ message: 'O campo title deve ser uma string' })
  @IsNotEmpty({ message: 'O campo title é obrigatório' })
  title: string;

  @IsString({ message: 'O campo body deve ser uma string' })
  @IsNotEmpty({ message: 'O campo body é obrigatório' })
  body: string;

  @IsString({ message: 'O campo style deve ser uma string' })
  @IsNotEmpty({ message: 'O campo style é obrigatório' })
  style: string;

  @IsBoolean({ message: 'O campo trashed deve ser um valor booleano' })
  @IsNotEmpty({ message: 'O campo trashed é obrigatório' })
  trashed: boolean;

  @IsString({ message: 'Formato de data inválido. Use o formato "YYYY-MM-DD HH:mm:ss"' })
  @Matches(/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/, { message: 'Data inválida. Use o formato "YYYY-MM-DD HH:mm:ss"' })
  deleted_date: string;

  @IsString({ message: 'Formato de data inválido. Use o formato "YYYY-MM-DD HH:mm:ss"' })
  @IsNotEmpty({ message: 'O campo update_at é obrigatório.' })
  @Matches(/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/, { message: 'Data inválida. Use o formato "YYYY-MM-DD HH:mm:ss"' })
  update_at: string;

  constructor(payload: Note) {
    this._id = payload._id;
    this.title = typeof payload.title === 'string' ? payload.title.trim() : payload.title;
    this.body = typeof payload.body === 'string' ? payload.body.trim() : payload.body;
    this.style = typeof payload.style === 'string' ? payload.style.trim() : payload.style;
    this.trashed = payload.trashed;
    this.deleted_date = typeof payload.deleted_date === 'string' ? payload.deleted_date.trim() : payload.deleted_date;
    this.update_at = typeof payload.update_at === 'string' ? payload.update_at.trim() : payload.update_at;
  }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     NoteCreate:
 *       type: object
 *       required:
 *         - title
 *         - body
 *         - style
 *         - folder_id
 *       properties:
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
 *         folder_id:
 *           type: string
 *           description: Identificador único da pasta, onde a anotação será armazenada
 *           example: "6123456789abcdef01234567"
 */

class NoteCreate {
  @IsString({ message: 'O campo title deve ser uma string' })
  @IsNotEmpty({ message: 'O campo title é obrigatório' })
  title: string;

  @IsString({ message: 'O campo body deve ser uma string' })
  @IsNotEmpty({ message: 'O campo body é obrigatório' })
  body: string;

  @IsString({ message: 'O campo style deve ser uma string' })
  @IsNotEmpty({ message: 'O campo style é obrigatório' })
  style: string;

  @IsObjectId({ message: 'O campo folder_id deve ser um ObjectId válido' })
  @IsNotEmpty({ message: 'O campo folder_id é obrigatório' })
  folder_id: ObjectId;

  constructor(payload: NoteCreate) {
    this.title = typeof payload.title === 'string' ? payload.title.trim() : payload.title;
    this.body = typeof payload.body === 'string' ? payload.body.trim() : payload.body;
    this.style = typeof payload.style === 'string' ? payload.style.trim() : payload.style;
    this.folder_id = payload.folder_id;
  }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     NoteUpdate:
 *       type: object
 *       required:
 *         - title
 *         - body
 *         - style
 *       properties:
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
 */

class NoteUpdate {
  @IsString({ message: 'O campo title deve ser uma string' })
  @IsNotEmpty({ message: 'O campo title é obrigatório' })
  title: string;

  @IsString({ message: 'O campo body deve ser uma string' })
  @IsNotEmpty({ message: 'O campo body é obrigatório' })
  body: string;

  @IsString({ message: 'O campo style deve ser uma string' })
  @IsNotEmpty({ message: 'O campo style é obrigatório' })
  style: string;

  constructor(payload: NoteUpdate) {
    this.title = typeof payload.title === 'string' ? payload.title.trim() : payload.title;
    this.body = typeof payload.body === 'string' ? payload.body.trim() : payload.body;
    this.style = typeof payload.style === 'string' ? payload.style.trim() : payload.style;
  }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     NoteMove:
 *       type: object
 *       required:
 *         - folder_id
 *       properties:
 *         folder_id:
 *           type: string
 *           description: Identificador único da pasta, onde a anotação será armazenada
 *           example: "6123456789abcdef01234567"
 */

class NoteMove {
  @IsObjectId({ message: 'O campo folder_id deve ser um ObjectId válido' })
  @IsNotEmpty({ message: 'O campo folder_id é obrigatório' })
  folder_id: ObjectId;

  constructor(payload: NoteMove) {
    this.folder_id = payload.folder_id;
  }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Bin:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/Note"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     NoteList:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/NoteDownload"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     NoteDownload:
 *       type: object
 *       required:
 *         - _id
 *       properties:
 *         _id:
 *           type: string
 *           description: Identificador único da nota
 *           example: "6123456789abcdef01234567"
 */

class NoteDownload {
  @IsObjectId({ message: 'O campo _id deve ser um ObjectId válido' })
  @IsNotEmpty({ message: 'O campo _id é obrigatório' })
  _id: ObjectId;

  constructor(payload: NoteDownload) {
    this._id = payload._id;
  }
}

// Define a note padrão
const noteDefault = {
  _id: new ObjectId(),
  title: 'Título da anotação',
  body: 'Texto da anotação',
  style: 'Estilo',
  trashed: false,
  deleted_date: '',
  update_at: moment().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss'),
};

export { Note, NoteCreate, NoteUpdate, NoteMove, NoteDownload, noteDefault };
