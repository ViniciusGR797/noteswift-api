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
    // ID do usuário obtido pelo middleware de autenticação
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
    const { upsertUser, error: payloadError } = await Validate.validateUpsertUserData(req.body);
    if (payloadError) {
      return res.status(400).json({ msg: payloadError });
    }

    // Verifica se o email já existe no banco de dados (garante que seja único)
    const { user: existingUser, error: getUserEmailError } = await UserService.getUserByEmail(upsertUser.email);
    if (getUserEmailError) {
      return res.status(500).json({ msg: getUserEmailError });
    }
    if (existingUser) {
      return res.status(400).json({ msg: 'Email já cadastrado no sistema' });
    }

    // Popula payload
    upsertUser.library = [folderDefault];
    upsertUser.config = userConfigDefault;

    // Criptografa a senha antes de salvar o usuário no banco de dados
    upsertUser.pwd = await Password.hashPassword(upsertUser.pwd);

    // Cria o novo usuário
    const { createdUserID, error: createUserError } = await UserService.createUser(upsertUser);
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

  static async updateUserMe(req: Request, res: Response): Promise<Response> {
    // ID do usuário obtido pelo middleware de autenticação
    const userId = req.userId; 

    // Verifica se o usuário existe no banco de dados
    const { user, error: getUserError } = await UserService.getUserById(userId);
    if (getUserError) {
      return res.status(500).json({ msg: getUserError });
    }
    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }

    // Valida o payload do usuário atualizado antes de prosseguir
    const { upsertUser, error: payloadError } = await Validate.validateUpsertUserData(req.body);
    if (payloadError) {
      return res.status(400).json({ msg: payloadError });
    }

    // Verifica se o email já existe no banco de dados, exceto se for o email atual do usuário
    if (upsertUser.email !== user.email) {
      const { user: existingUser, error: getUserEmailError } = await UserService.getUserByEmail(upsertUser.email);
      if (getUserEmailError) {
        return res.status(500).json({ msg: getUserEmailError });
      }
      if (existingUser) {
        return res.status(400).json({ msg: 'Email já cadastrado no sistema' });
      }
    }  

    // Criptografa a senha antes de salvar o usuário no banco de dados
    upsertUser.pwd = await Password.hashPassword(upsertUser.pwd);

    // Mantém o valor anterior se não fornecer um novo nome, email ou senha
    user.name = upsertUser.name || user.name; 
    user.email = upsertUser.email || user.email; 
    user.pwd = upsertUser.pwd || user.pwd;

    // Salva as alterações no banco de dados
    const { updatedUser, error: updateUserError } = await UserService.updateUser(userId, user);
    if (updateUserError) {
      return res.status(500).json({ msg: updateUserError });
    }

    // Retorna o usuário atualizado
    return res.status(200).json(updatedUser);
  }

  static async removeUserMe(req: Request, res: Response): Promise<Response> {
    // ID do usuário obtido pelo middleware de autenticação
    const userId = req.userId;

    // Verifica se o usuário existe no banco de dados
    const { user, error: getUserError } = await UserService.getUserById(userId);
    if (getUserError) {
      return res.status(500).json({ msg: getUserError });
    }
    if (!user) {
      return res.status(404).json({ msg: 'Usuário não encontrado' });
    }

    // Remove o usuário do banco de dados
    const { deletedUser, error: deleteUserError } = await UserService.deleteUser(userId);
    if (deleteUserError) {
      return res.status(500).json({ msg: deleteUserError });
    }

    // ********** Mandar por email o user deletado (deletedUser)

    // Retorna mensagem de sucesso
    return res.status(200).json({ msg: 'Excluído com sucesso' });
  }
}
