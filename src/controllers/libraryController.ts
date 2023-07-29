import { Request, Response } from 'express';
import { LibraryService } from '../services/libraryService';
import { sendEmail, EmailOptions, Template } from '../utils/email';

export class LibraryController {
  static async getLibrary(req: Request, res: Response): Promise<Response> {
    // ID do usuário obtido pelo middleware de autenticação
    const user_id = req.user_id;

    const { library, error } = await LibraryService.getLibrary(user_id);
    if (error) {
      return res.status(500).json({ msg: error });
    }
    if (!library || library.length === 0) {
      return res.status(404).json({ msg: 'Nenhum dado encontrado' });
    }

    return res.status(200).json(library);
  }

  static async deleteLibrary(req: Request, res: Response): Promise<Response> {
    // ID do usuário obtido pelo middleware de autenticação
    const user_id = req.user_id;

    // Remove o usuário do banco de dados
    const { deletedUserWithoutLibrary, error: deleteLibraryError } = await LibraryService.deleteLibraryAndKeepDefault(user_id);
    if (deleteLibraryError) {
      return res.status(500).json({ msg: deleteLibraryError });
    }
    if (!deletedUserWithoutLibrary) {
      return res.status(404).json({ msg: 'Nenhum dado encontrado' });
    }

    const emailOptions: EmailOptions = {
      to: deletedUserWithoutLibrary.email,
      subject: 'Bibliteca apagada',
      html: Template.deleteLibraryTemplate(deletedUserWithoutLibrary),
    };

    sendEmail(emailOptions);

    // Retorna mensagem de sucesso
    return res.status(200).json({ msg: 'Excluído com sucesso' });
  }
}