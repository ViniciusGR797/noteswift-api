import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';

import { folderDefault } from '../models/folderModel';
import { userConfigDefault } from '../models/userConfigModel';
import { UserService } from '../services/userService';
import { Password } from '../securities/password';
import { Token } from '../securities/token'; 
import { Validate } from '../utils/validate';

export class UserController {
  static async getUserMe(req: Request, res: Response): Promise<Response> {
    // Pega ID do token vindo da resquest
    const user_id = req.userId;

    const { user, error } = await UserService.getUserById(user_id);
    if (error) {
      return res.status(500).json({ msg: error });
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
      return res.status(400).json({ msg: payloadError });
    }

    // Verifica se o email já existe no banco de dados (garante que seja único)
    const { user: existingUser, error: getUserEmailError } = await UserService.getUserByEmail(newUser.email);
    if (getUserEmailError) {
      return res.status(500).json({ msg: getUserEmailError });
    }
    if (existingUser) {
      return res.status(400).json({ msg: 'Email já cadastrado no sistema' });
    }

    // Popula payload
    newUser.library = [folderDefault];
    newUser.config = userConfigDefault;

    // Criptografa a senha antes de salvar o usuário no banco de dados
    newUser.pwd = await Password.hashPassword(newUser.pwd);

    // Cria o novo usuário
    const { createdUserID, error: createUserError } = await UserService.createUser(newUser);
    if (createUserError) {
      return res.status(500).json({ msg: createUserError });
    }

    // Busca o usuário criado para validação
    const { user, error: getUserError } = await UserService.getUserById(createdUserID);
    if (getUserError) {
      return res.status(500).json({ msg: getUserError });
    }
    if (!user) {
      return res.status(404).json({ msg: 'Nenhum dado encontrado' });
    }

    return res.status(201).json(user);
  }

  static async loginUser(req: Request, res: Response): Promise<Response> {
    const { email, pwd } = req.body;

    // Verifica se o email existe no banco de dados
    const { user, error: getUserError } = await UserService.getUserByEmail(email);
    if (getUserError) {
      return res.status(500).json({ msg: getUserError });
    }
    if (!user) {
      return res.status(401).json({ msg: 'Credenciais de usuário inválidas' });
    }

    // Verifica se a senha é válida
    const isPasswordValid = await Password.comparePassword(pwd, user.pwd);
    if (!isPasswordValid) {
      return res.status(401).json({ msg: 'Credenciais de usuário inválidas' });
    }

    // Gera o token JWT
    const token = Token.generateToken(user._id);

    // Retorna o token no corpo da resposta
    return res.status(200).json({ access_token: token });
  }
}
