import { prop, getModelForClass, Ref } from '@typegoose/typegoose';
import { Note } from './noteModel';  

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

  @prop({ required: true, type: () => [Note] })
  public notes!: Ref<Note>[];
}

const FolderModel = getModelForClass(Folder);

export { Folder, FolderModel };