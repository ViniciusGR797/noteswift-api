import { prop, getModelForClass, Ref } from '@typegoose/typegoose';

/**
 * @swagger
 * components:
 *   schemas:
 *     UserConfig:
 *       type: object
 *       required:
 *         - dark_mode
 *         - draft_notification
 *         - archived
 *         - auto_backup
 *         - news
 *       properties:
 *         dark_mode:
 *           type: boolean
 *           description: Indica se o modo escuro está ativado
 *           example: false
 *         draft_notification:
 *           type: boolean
 *           description: Indica se as notificações de rascunho estão ativadas
 *           example: true
 *         archived:
 *           type: boolean
 *           description: Indica se a funcionalidade de arquivamento está ativada
 *           example: true
 *         auto_backup:
 *           type: boolean
 *           description: Indica se o backup automático está ativado
 *           example: true
 *         news:
 *           type: boolean
 *           description: Indica se as notícias estão habilitadas
 *           example: true
 */

class UserConfig {
    @prop({ required: true })
    public dark_mode!: boolean;
  
    @prop({ required: true })
    public draft_notification!: boolean;
  
    @prop({ required: true })
    public archived!: boolean;
  
    @prop({ required: true })
    public auto_backup!: boolean;
  
    @prop({ required: true })
    public news!: boolean;
}

const UserConfigModel = getModelForClass(UserConfig);

export { UserConfig, UserConfigModel };