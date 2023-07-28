import { Request, Response } from 'express';
import { UserConfigService } from '../services/userConfigService';
import { UserConfig } from '../models/userConfigModel';
import { validate } from 'class-validator';

export class UserConfigController {
  static async getUserConfig(req: Request, res: Response): Promise<Response> {
    // ID do usuário obtido pelo middleware de autenticação
    const user_id = req.userId;

    const { userConfig, error } = await UserConfigService.getUserConfig(user_id);
    if (error) {
      return res.status(500).json({ msg: error });
    }
    if (!userConfig) {
      return res.status(404).json({ msg: 'Nenhum dado encontrado' });
    }

    return res.status(200).json(userConfig);
  }

  static async updateUserConfig(req: Request, res: Response): Promise<Response> {
    // ID do usuário obtido pelo middleware de autenticação
    const userId = req.userId; 

    const payload = new UserConfig(req.body);

    const errors = await validate(payload);
    if (errors.length > 0) {
      const firstError = errors[0];
      const errorMessage = firstError.constraints ? Object.values(firstError.constraints)[0] : 'Alguns parâmetros podem estar faltando ou serem inválidos';
      return res.status(400).json({ msg: errorMessage });
    }

    // Salva as alterações no banco de dados
    const { updatedUserConfig, error: updateUserError } = await UserConfigService.updateUserConfig(userId, payload);
    if (updateUserError) {
      return res.status(500).json({ msg: updateUserError });
    }
    if (!updatedUserConfig) {
        return res.status(404).json({ msg: 'Nenhum dado encontrado' });
    }

    // Retorna o usuário atualizado
    return res.status(200).json(updatedUserConfig);
  }
}