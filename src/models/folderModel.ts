import { IsString, IsBoolean, IsNotEmpty, IsInt, Min, ArrayNotEmpty, ValidateNested, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectId } from "mongodb";
import { Note, noteDefault } from './noteModel';
import { IsObjectId } from '../utils/validate';

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
  @IsObjectId({ message: 'O campo _id deve ser um ObjectId válido' })
  @IsNotEmpty({ message: 'O campo _id é obrigatório' })
  _id: ObjectId;

  @IsString({ message: 'O campo name deve ser uma string' })
  @IsNotEmpty({ message: 'O campo name é obrigatório' })
  name: string;

  @IsBoolean({ message: 'O campo is_default deve ser um valor booleano' })
  @IsNotEmpty({ message: 'O campo is_default é obrigatório' })
  is_default: boolean;

  @IsString({ message: 'O campo color deve ser uma string' })
  @IsNotEmpty({ message: 'O campo color é obrigatório' })
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'O campo "color" deve ser um valor hexadecimal válido no formato "#RRGGBB" (ex: #FF0000).',
  })
  color: string;

  @IsInt({ message: 'O campo order deve ser um número inteiro' })
  @IsNotEmpty({ message: 'O campo order é obrigatório' })
  @Min(1, { message: 'O campo order deve ser maior ou igual a 1' })
  order: number;

  @IsNotEmpty({ message: 'O campo notes é obrigatório' })
  @ValidateNested({ each: true })
  @Type(() => Note)
  notes: Note[];

  constructor(payload: Folder) {
    this._id = payload._id;
    this.name = typeof payload.name === 'string' ? payload.name.trim() : payload.name;
    this.is_default = payload.is_default;
    this.color = typeof payload.color === 'string' ? payload.color.trim() : payload.color;
    this.order = payload.order;
    this.notes = payload.notes;
  }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     FolderCreate:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Nome da pasta
 *           example: "Nome da pasta"
 */

class FolderCreate {
  @IsString({ message: 'O campo name deve ser uma string' })
  @IsNotEmpty({ message: 'O campo name é obrigatório' })
  name: string;

  constructor(payload: FolderCreate) {
    this.name = typeof payload.name === 'string' ? payload.name.trim() : payload.name;
  }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     FolderUpdate:
 *       type: object
 *       required:
 *         - name
 *         - color
 *       properties:
 *         name:
 *           type: string
 *           description: Nome da pasta
 *           example: "Nome da pasta"
 *         color:
 *           type: string
 *           description: Cor da pasta
 *           example: "#FF0000"
 */

class FolderUpdate {
  @IsString({ message: 'O campo name deve ser uma string' })
  @IsNotEmpty({ message: 'O campo name é obrigatório' })
  name: string;

  @IsString({ message: 'O campo color deve ser uma string' })
  @IsNotEmpty({ message: 'O campo color é obrigatório' })
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'O campo "color" deve ser um valor hexadecimal válido no formato "#RRGGBB" (ex: #FF0000).',
  })
  color: string;

  constructor(payload: FolderUpdate) {
    this.name = typeof payload.name === 'string' ? payload.name.trim() : payload.name;
    this.color = typeof payload.color === 'string' ? payload.color.trim() : payload.color;
  }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     LibraryOrder:
 *       type: array
 *       items:
 *         $ref: "#/components/schemas/FolderOrder"
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     FolderOrder:
 *       type: object
 *       required:
 *         - _id
 *         - order
 *       properties:
 *         _id:
 *           type: ObjectId
 *           description: Identificador único da pasta
 *           example: "6123456789abcdef01234567"
 *         order:
 *           type: integer
 *           description: Ordem da pasta
 *           example: 1
 */

class FolderOrder {
  @IsObjectId({ message: 'O campo _id deve ser um ObjectId válido' })
  @IsNotEmpty({ message: 'O campo _id é obrigatório' })
  _id: ObjectId;

  @IsInt({ message: 'O campo order deve ser um número inteiro' })
  @IsNotEmpty({ message: 'O campo order é obrigatório' })
  @Min(1, { message: 'O campo order deve ser maior ou igual a 1' })
  order: number;

  constructor(payload: FolderOrder) {
    this._id = payload._id;
    this.order = payload.order;
  }
}

// Define a folder padrão
const folderDefault = {
  _id: new ObjectId(),
  name: "default",
  is_default: true,
  color: "#33A7FF",
  order: 1,
  notes: [noteDefault]
};

// Cores Hexadecimais Padrão
const coresDefault = [
  "#FF5733", // Vermelho
  "#FFC300", // Amarelo
  "#33FF57", // Verde
  "#33A7FF", // Azul
  "#A833FF", // Roxo
  "#FF33A8", // Rosa
  "#FF4500", // Laranja
  "#A8FF33", // Lima
  "#33FFE7", // Ciano
  "#FFC333", // Dourado
  "#57FF33", // Verde Claro
  "#333EFF", // Azul Escuro
];

// Cores Hexadecimais para Modo Light (Cores Pastel)
const coresLightMode = [
  "#FFC8B4", // Vermelho Claro
  "#FFF7B3", // Amarelo Claro
  "#C8FFBB", // Verde Claro
  "#A9E7FF", // Azul Claro
  "#D9B3FF", // Roxo Claro
  "#FFB3DA", // Rosa Claro
  "#FF8D7D", // Laranja Claro
  "#D8FFB3", // Lima Claro
  "#A7FFF7", // Ciano Claro
  "#FFECA2", // Dourado Claro
  "#A9FFAB", // Verde Claro
  "#B3C8FF", // Azul Claro
];

// Cores Hexadecimais para Modo Dark (Cores Pastel)
const coresDarkMode = [
  "#C15E5E", // Vermelho Escuro
  "#EBC653", // Amarelo Escuro
  "#89E97A", // Verde Escuro
  "#66BEEB", // Azul Escuro
  "#C88DEB", // Roxo Escuro
  "#E9669A", // Rosa Escuro
  "#FF925E", // Laranja Escuro
  "#7AE966", // Lima Escuro
  "#4CD2E4", // Ciano Escuro
  "#CDAA7D", // Dourado Escuro
  "#297A46", // Verde Escuro
  "#7D88EB", // Azul Escuro
];

export { Folder, FolderCreate, FolderUpdate, FolderOrder, folderDefault, coresDefault, coresLightMode, coresDarkMode };
