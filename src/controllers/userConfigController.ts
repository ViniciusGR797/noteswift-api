import { Request, Response } from 'express';
import { UserConfigService } from '../services/userConfigService';
import { Validate } from '../utils/validate';

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

    // Valida o payload de config atualizado antes de prosseguir
    const { data, error: payloadError } = await Validate.validateData(req.body);
    if (payloadError) {
      return res.status(400).json({ msg: payloadError });
    }

    // Salva as alterações no banco de dados
    const { updatedUserConfig, error: updateUserError } = await UserConfigService.updateUserConfig(userId, data);
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