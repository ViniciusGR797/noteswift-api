import { Request, Response } from 'express';
import { folderDefault } from '../models/folderModel';
import { userConfigDefault } from '../models/userConfigModel';
import { UserService } from '../services/userService';
import { Password } from '../securities/password';
import { Token } from '../securities/token';
import { sendEmail, EmailOptions, TemplateEmail } from '../utils/email';
import { UserUpsert, User, UserLogin } from '../models/userModel';
import { validate } from 'class-validator';
import { ObjectId } from "mongodb";

export class UserController {
  static async getUserMe(req: Request, res: Response): Promise<Response> {
    // ID do usuário obtido pelo middleware de autenticação
    const user_id = req.user_id;

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
    let payload = new UserUpsert(req.body);

    const errors = await validate(payload);
    if (errors.length > 0) {
      const firstError = errors[0];
      const errorMessage = firstError.constraints ? Object.values(firstError.constraints)[0] : 'Alguns parâmetros podem estar faltando ou serem inválidos';
      return res.status(400).json({ msg: errorMessage });
    }

    // Verifica se o email já existe no banco de dados (garante que seja único)
    const { user: existingUser, error: getUserEmailError } = await UserService.getUserByEmail(payload.email);
    if (getUserEmailError) {
      return res.status(500).json({ msg: getUserEmailError });
    }
    if (existingUser) {
      return res.status(400).json({ msg: 'Email já cadastrado no sistema' });
    }

    // Popula com dados o novo user
    const data = new User({
      "_id": new ObjectId(),
      "name": payload.name,
      "email": payload.email,
      "pwd": await Password.hashPassword(payload.pwd),
      "library": [folderDefault],
      "config": userConfigDefault
    });

    // Cria o novo usuário
    const { createdUserID, error: createUserError } = await UserService.createUser(data);
    if (createUserError) {
      return res.status(500).json({ msg: createUserError });
    }
    if (!createdUserID || createdUserID === "") {
        return res.status(404).json({ msg: 'Nenhum dado encontrado' });
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
    const payload = new UserLogin(req.body);

    const errors = await validate(payload);
    if (errors.length > 0) {
      const firstError = errors[0];
      const errorMessage = firstError.constraints ? Object.values(firstError.constraints)[0] : 'Alguns parâmetros podem estar faltando ou serem inválidos';
      return res.status(400).json({ msg: errorMessage });
    }

    // Verifica se o email existe no banco de dados
    const { user, error: getUserError } = await UserService.getUserByEmail(payload.email);
    if (getUserError) {
      return res.status(500).json({ msg: getUserError });
    }
    if (!user) {
      return res.status(401).json({ msg: 'Credenciais de usuário inválidas' });
    }

    // Verifica se a senha é válida
    const isPasswordValid = await Password.comparePassword(payload.pwd, user.pwd);
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
    const user_id = req.user_id;

    // Verifica se o usuário existe no banco de dados
    const { user, error: getUserError } = await UserService.getUserById(user_id);
    if (getUserError) {
      return res.status(500).json({ msg: getUserError });
    }
    if (!user) {
      return res.status(404).json({ msg: 'Nenhum dado encontrado' });
    }

    const payload = new UserUpsert(req.body);

    const errors = await validate(payload);
    if (errors.length > 0) {
      const firstError = errors[0];
      const errorMessage = firstError.constraints ? Object.values(firstError.constraints)[0] : 'Alguns parâmetros podem estar faltando ou serem inválidos';
      return res.status(400).json({ msg: errorMessage });
    }

    // Verifica se o email já existe no banco de dados, exceto se for o email atual do usuário
    if (payload.email !== user.email) {
      const { user: existingUser, error: getUserEmailError } = await UserService.getUserByEmail(payload.email);
      if (getUserEmailError) {
        return res.status(500).json({ msg: getUserEmailError });
      }
      if (existingUser) {
        return res.status(400).json({ msg: 'Email já cadastrado no sistema' });
      }
    }

    // Criptografa a senha antes de salvar o usuário no banco de dados
    payload.pwd = await Password.hashPassword(payload.pwd);

    // Mantém o valor anterior se não fornecer um novo 
    user.name = payload.name || user.name;
    user.email = payload.email || user.email;
    user.pwd = payload.pwd || user.pwd;

    // Salva as alterações no banco de dados
    const { updatedUser, error: updateUserError } = await UserService.updateUser(user_id, user);
    if (updateUserError) {
      return res.status(500).json({ msg: updateUserError });
    }

    // Retorna o usuário atualizado
    return res.status(200).json(updatedUser);
  }

  static async deleteUserMe(req: Request, res: Response): Promise<Response> {
    // ID do usuário obtido pelo middleware de autenticação
    const user_id = req.user_id;

    // Remove o usuário do banco de dados
    const { deletedUser, error: deleteUserError } = await UserService.deleteUser(user_id);
    if (deleteUserError) {
      return res.status(500).json({ msg: deleteUserError });
    }
    if (!deletedUser) {
      return res.status(404).json({ msg: 'Nenhum dado encontrado' });
    }

    const emailOptions: EmailOptions = {
      to: deletedUser.email,
      subject: 'Conta do usuário apagada',
      html: TemplateEmail.deleteUserTemplate(deletedUser),
    };

    sendEmail(emailOptions);

    // Retorna mensagem de sucesso
    return res.status(200).json({ msg: 'Excluído com sucesso' });
  }
}
