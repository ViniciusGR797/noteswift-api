import { IsBoolean, IsNotEmpty } from 'class-validator';

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
  @IsBoolean({ message: 'O campo dark_mode deve ser um valor booleano.' })
  @IsNotEmpty({ message: 'O campo dark_mode é obrigatório.' })
  dark_mode: boolean;

  @IsBoolean({ message: 'O campo draft_notification deve ser um valor booleano.' })
  @IsNotEmpty({ message: 'O campo draft_notification é obrigatório.' })
  draft_notification: boolean;

  @IsBoolean({ message: 'O campo archived deve ser um valor booleano.' })
  @IsNotEmpty({ message: 'O campo archived é obrigatório.' })
  archived: boolean;

  @IsBoolean({ message: 'O campo auto_backup deve ser um valor booleano.' })
  @IsNotEmpty({ message: 'O campo auto_backup é obrigatório.' })
  auto_backup: boolean;

  @IsBoolean({ message: 'O campo news deve ser um valor booleano.' })
  @IsNotEmpty({ message: 'O campo news é obrigatório.' })
  news: boolean;

  constructor(payload: UserConfig) {
    this.dark_mode = payload.dark_mode;
    this.draft_notification = payload.draft_notification;
    this.archived = payload.archived;
    this.auto_backup = payload.auto_backup;
    this.news = payload.news;
  }
}

// Define a config padrão
const userConfigDefault = {
    dark_mode: false,
    draft_notification: true,
    archived: true,
    auto_backup: true,
    news: true
};

export { UserConfig, userConfigDefault };