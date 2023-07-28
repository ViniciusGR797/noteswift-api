import { IsString, IsBoolean, IsNotEmpty, Matches } from 'class-validator';
import { ObjectId } from "mongodb";
import moment from 'moment-timezone';

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
 *           type: ObjectId
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
 *           example: "2022-01-01 10:30:00"
 *         update_at:
 *           type: string
 *           description: Data de atualização da nota
 *           example: "2022-01-01 10:30:00"
 */

class Note {
  @IsNotEmpty({ message: 'O campo _id é obrigatório.' })
  _id: ObjectId;

  @IsString({ message: 'O campo title deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo title é obrigatório.' })
  title: string;

  @IsString({ message: 'O campo body deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo body é obrigatório.' })
  body: string;

  @IsString({ message: 'O campo style deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo style é obrigatório.' })
  style: string;

  @IsBoolean({ message: 'O campo trashed deve ser um valor booleano.' })
  @IsNotEmpty({ message: 'O campo trashed é obrigatório.' })
  trashed: boolean;

  @IsString({ message: 'Formato de data inválido. Use o formato "YYYY-MM-DD HH:mm:ss".' })
  @Matches(/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/, { message: 'Data inválida. Use o formato "YYYY-MM-DD HH:mm:ss".' })
  deleted_date: string;

  @IsString({ message: 'Formato de data inválido. Use o formato "YYYY-MM-DD HH:mm:ss".' })
  @IsNotEmpty({ message: 'O campo update_at é obrigatório.' })
  @Matches(/^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/, { message: 'Data inválida. Use o formato "YYYY-MM-DD HH:mm:ss".' })
  update_at: string;

  constructor(payload: Note) {
    this._id = payload._id;
    this.title = payload.title ? payload.title.trim() : '';
    this.body = payload.body ? payload.body.trim() : '';
    this.style = payload.style ? payload.style.trim() : '';
    this.trashed = payload.trashed;
    this.deleted_date = payload.deleted_date ? payload.deleted_date.trim() : '';
    this.update_at = payload.update_at ? payload.update_at.trim() : '';
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

export { Note, noteDefault };
