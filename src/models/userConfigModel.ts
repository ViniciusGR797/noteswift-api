import mongoose, { Schema, Document } from 'mongoose';

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

export interface IUserConfig extends Document {
    dark_mode: boolean;
    draft_notification: boolean;
    archived: boolean;
    auto_backup: boolean;
    news: boolean;
}

const userConfigSchema = new Schema({
    dark_mode: { type: Boolean, required: true },
    draft_notification: { type: Boolean, required: true },
    archived: { type: Boolean, required: true },
    auto_backup: { type: Boolean, required: true },
    news: { type: Boolean, required: true },
});

const UserConfig = mongoose.model<IUserConfig>("UserConfig", userConfigSchema);

// Define a config padrão
const userConfigDefault = {
    dark_mode: false,
    draft_notification: true,
    archived: true,
    auto_backup: true,
    news: true
};

export { UserConfig, userConfigSchema, userConfigDefault };