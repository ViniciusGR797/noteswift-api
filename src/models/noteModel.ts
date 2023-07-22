import mongoose, { Schema, Document } from 'mongoose';

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
  _id: { type: String },
  title: { type: String, required: true },
  body: { type: String, required: true },
  style: { type: String, required: true },
  trashed: { type: Boolean, required: true },
  deleted_date: { type: String, required: true },
  update_at: { type: String, required: true },
});

const Note = mongoose.model<INote>("Note", noteSchema);

export { Note, noteSchema };
