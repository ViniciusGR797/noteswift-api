import { Request, Response } from 'express';
import { folderDefault } from '../models/folderModel';
import { userConfigDefault } from '../models/userConfigModel';
import { UserService } from '../services/userService';
import { Password } from '../securities/password';
import { Token } from '../securities/token'; 
import { Validate } from '../utils/validate';
import { sendEmail, EmailOptions, Template  } from '../utils/email';
import { UpsertUser } from '../models/userModel';

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
    const payload = new UpsertUser(req.body);

    // Valida o payload do novo usuário antes de prosseguir
    const { data, error: payloadError } = await Validate.validateData(payload);
    if (payloadError) {
      return res.status(400).json({ msg: payloadError });
    }

    console.log("Passou")

    // Verifica se o email já existe no banco de dados (garante que seja único)
    const { user: existingUser, error: getUserEmailError } = await UserService.getUserByEmail(data.email);
    if (getUserEmailError) {
      return res.status(500).json({ msg: getUserEmailError });
    }
    if (existingUser) {
      return res.status(400).json({ msg: 'Email já cadastrado no sistema' });
    }

    // Popula payload
    data.library = [folderDefault];
    data.config = userConfigDefault;

    // Criptografa a senha antes de salvar o usuário no banco de dados
    data.pwd = await Password.hashPassword(data.pwd);

    // Cria o novo usuário
    const { createdUserID, error: createUserError } = await UserService.createUser(data);
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
      return res.status(404).json({ msg: 'Nenhum dado encontrado' });
    }

    // Valida o payload do usuário atualizado antes de prosseguir
    const { data, error: payloadError } = await Validate.validateData(req.body);
    if (payloadError) {
      return res.status(400).json({ msg: payloadError });
    }

    // Verifica se o email já existe no banco de dados, exceto se for o email atual do usuário
    if (data.email !== user.email) {
      const { user: existingUser, error: getUserEmailError } = await UserService.getUserByEmail(data.email);
      if (getUserEmailError) {
        return res.status(500).json({ msg: getUserEmailError });
      }
      if (existingUser) {
        return res.status(400).json({ msg: 'Email já cadastrado no sistema' });
      }
    }  

    // Criptografa a senha antes de salvar o usuário no banco de dados
    data.pwd = await Password.hashPassword(data.pwd);

    // Mantém o valor anterior se não fornecer um novo nome, email ou senha
    user.name = data.name || user.name; 
    user.email = data.email || user.email; 
    user.pwd = data.pwd || user.pwd;

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

    // Remove o usuário do banco de dados
    const { deletedUser, error: deleteUserError } = await UserService.deleteUser(userId);
    if (deleteUserError) {
      return res.status(500).json({ msg: deleteUserError });
    }
    if (!deletedUser) {
      return res.status(404).json({ msg: 'Nenhum dado encontrado' });
    }

    const emailOptions: EmailOptions = {
      to: deletedUser.email,
      subject: 'Conta do usuário apagada',
      html: Template.deleteUserTemplate(deletedUser),
    };

    sendEmail(emailOptions);

    // Retorna mensagem de sucesso
    return res.status(200).json({ msg: 'Excluído com sucesso' });
  }
}
