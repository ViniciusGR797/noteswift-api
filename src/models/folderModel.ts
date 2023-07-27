import mongoose, { Schema, Document } from 'mongoose';
import { ObjectId } from "mongodb";
import { INote, noteSchema, noteDefault } from './noteModel';

/**
 * @swagger
 * components:
 *   schemas:
 *     Library:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/Folder"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Folder:
 *       type: object
 *       required:
 *         - _id
 *         - name
 *         - is_default
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
 *         is_default:
 *           type: string
 *           description: Marcação da pasta default (não pode ser apagada)
 *           example: true
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
  is_default: boolean;
  color: string;
  order: number;
  notes: INote[];
}

const folderSchema = new Schema(
  {
    _id: { 
      type: String,
      required: true
    },
    name: { 
      type: String, 
      required: true, 
      trim: true 
    },
    is_default: { 
      type: Boolean, 
      required: true, 
      lowercase: true, 
      trim: true 
    },
    color: { 
      type: String, 
      required: true, 
      trim: true  
    },
    order: { 
      type: Number, 
      required: true,
      min: [
        0,
        'Order inválida'
      ]
    },
    notes: [noteSchema], 
  }
);

const Folder = mongoose.model<IFolder>("Folder", folderSchema);

// Define a folder padrão
const folderDefault = {
  _id: new ObjectId().toHexString(),
  name: "default",
  is_default: true,
  color: "#FFFFFF",
  order: 1,
  notes: [noteDefault]
};

export { Folder, folderSchema, folderDefault };
