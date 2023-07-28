import { IsString, IsBoolean, IsNotEmpty, IsInt, Min, ArrayNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectId } from "mongodb";
import { Note, noteDefault } from './noteModel';

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
 *           type: ObjectId
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

class Folder {
  @IsNotEmpty({ message: 'O campo _id é obrigatório.' })
  _id: ObjectId;

  @IsString({ message: 'O campo name deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo name é obrigatório.' })
  name: string;

  @IsBoolean({ message: 'O campo is_default deve ser um valor booleano.' })
  @IsNotEmpty({ message: 'O campo is_default é obrigatório.' })
  is_default: boolean;

  @IsString({ message: 'O campo color deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo color é obrigatório.' })
  color: string;

  @IsInt({ message: 'O campo order deve ser um número inteiro.' })
  @IsNotEmpty({ message: 'O campo order é obrigatório.' })
  @Min(0, { message: 'O campo order deve ser maior ou igual a 0.' })
  order: number;

  @IsNotEmpty({ message: 'O campo notes é obrigatório.' })
  @ValidateNested({ each: true })
  @Type(() => Note)
  notes: Note[];

  constructor(payload: Folder) {
    this._id = payload._id;
    this.name = payload.name ? payload.name.trim() : '';
    this.is_default = payload.is_default;
    this.color = payload.color ? payload.color.trim() : '';
    this.order = payload.order;
    this.notes = payload.notes;
  }
}

// Define a folder padrão
const folderDefault = {
  _id: new ObjectId(),
  name: "default",
  is_default: true,
  color: "#FFFFFF",
  order: 1,
  notes: [noteDefault]
};

export { Folder, folderDefault };
