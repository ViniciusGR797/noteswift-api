import mongoose, { Schema, Document } from 'mongoose';
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
 *           example: "2022-01-01 10:30:00"
 *         update_at:
 *           type: string
 *           description: Data de atualização da nota
 *           example: "2022-01-01 10:30:00"
 */

export interface INote extends Document {
  _id: string | undefined;
  title: string;
  body: string;
  style: string;
  trashed: boolean;
  deleted_date: string;
  update_at: string;
}

const noteSchema = new Schema({
  _id: { 
    type: String,
    required: true
  },
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  body: { 
    type: String, 
    required: true, 
    trim: true 
  },
  style: { 
    type: String, 
    required: true, 
    trim: true 
  },
  trashed: { 
    type: Boolean, 
    required: true, 
    lowercase: true, 
    trim: true
  },
  deleted_date: { 
    type: String, 
    required: true, 
    lowercase: true, 
    trim: true,
    match: [
      /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/,
      'Data inválida'
    ]
  },
  update_at: { 
    type: String, 
    required: true, 
    lowercase: true, 
    trim: true,
    default: moment().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss'), // Valor padrão usando Moment.js
    match: [
      /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}$/,
      'Data inválida'
    ]
  },
});

const Note = mongoose.model<INote>("Note", noteSchema);

// Define a note padrão
const noteDefault = {
  _id: new ObjectId().toHexString(),
  title: 'Título da anotação',
  body: 'Texto da anotação',
  style: '',
  trashed: false,
  deleted_date: '',
  update_at: moment().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss'),
};

export { Note, noteSchema, noteDefault };
