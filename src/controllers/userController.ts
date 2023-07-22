import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';

import { folderDefault } from '../models/folderModel';
import { userConfigDefault } from '../models/userConfigModel';
import { UserService } from '../services/userService';
import { Validate } from '../utils/validate';

export class UserController {
  static async getUserMe(req: Request, res: Response): Promise<Response> {
    const user_id = req.params.user_id;
    // const user_id = "64bb64b8c81f442cd9d5f729";
    // Verifica se o user_id é um ObjectId válido
    if (!ObjectId.isValid(user_id)) {
      return res.status(400).json({ msg: 'Alguns parâmetros podem estar faltando ou serem inválidos' });
    }

    const { user, error } = await UserService.getUserById(user_id);
    if (error) {
      return res.status(500).json({ error });
    }
    if (!user) {
      return res.status(404).json({ msg: 'Nenhum dado encontrado' });
    }

    return res.status(200).json(user);
  }

  static async createUser(req: Request, res: Response): Promise<Response> {
    // Valida o payload do novo usuário antes de prosseguir
    const { newUser, error: payloadError } = await Validate.validateUserCreationData(req.body);
    if (payloadError) {
      return res.status(500).json({ payloadError });
    }

    // Popula payload
    newUser.library = [folderDefault];
    newUser.config = userConfigDefault;

    // Cria o novo usuário
    const { createdUserID, error: createUserError } = await UserService.createUser(newUser);
    if (createUserError) {
      return res.status(500).json({ createUserError });
    }

    // Busca o usuário criado para validação
    const { user, error: getUserError } = await UserService.getUserById(createdUserID);
    if (getUserError) {
      return res.status(500).json({ getUserError });
    }
    if (!user) {
      return res.status(404).json({ msg: 'Nenhum dado encontrado' });
    }

    return res.status(201).json(user);
  }
}
