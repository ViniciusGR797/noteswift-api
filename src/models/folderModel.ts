import mongoose, { Schema, Document } from 'mongoose';
import { ObjectId } from "mongodb";
import { INote, noteSchema } from './noteModel';

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

export interface IFolder extends Document {
  _id: string | undefined;
  name: string;
  color: string;
  order: number;
  notes: INote[];
}

const folderSchema = new Schema({
  _id: { type: String },
  name: { type: String, required: true },
  color: { type: String, required: true },
  order: { type: Number, required: true },
  notes: [noteSchema], 
});

const Folder = mongoose.model<IFolder>("Folder", folderSchema);

// Define a folder padrão
const folderDefault = {
  _id: new ObjectId().toHexString(),
  name: "default",
  color: "#FFFFFF",
  order: 1,
  notes: []
};

export { Folder, folderSchema, folderDefault };
