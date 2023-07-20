import { prop, getModelForClass, Ref } from '@typegoose/typegoose';

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

const NoteModel = getModelForClass(Note);

export { Note, NoteModel };