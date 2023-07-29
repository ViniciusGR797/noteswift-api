import { Request, Response } from 'express';
import { LibraryService } from '../services/libraryService';
import { sendEmail, EmailOptions, Template } from '../utils/email';
import { FolderOrder } from '../models/folderModel';
import { validate } from 'class-validator';
import { ObjectId, ProfilingLevel } from 'mongodb';

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

  static async updateOrderLibrary(req: Request, res: Response): Promise<Response> {
    // ID do usuário obtido pelo middleware de autenticação
    const user_id = req.user_id;

    const payload: FolderOrder[] = req.body.map((data: any) => new FolderOrder(data));

    // Validar cada item do payload individualmente
    for (const item of payload) {
      const itemErrors = await validate(item);
      if (itemErrors.length > 0) {
        const firstError = itemErrors[0];
        const errorMessage = firstError.constraints ? Object.values(firstError.constraints)[0] : 'Alguns parâmetros podem estar faltando ou serem inválidos';
        return res.status(400).json({ msg: errorMessage });
      }
    }

    // Busca library
    const { library, error } = await LibraryService.getLibrary(user_id);
    if (error) {
      return res.status(500).json({ msg: error });
    }
    if (!library || library.length === 0) {
      return res.status(404).json({ msg: 'Nenhum dado encontrado' });
    }

    // Garantir tamanho correto do payload em relação à library
    if (library.length !== payload.length) {
      return res.status(400).json({ msg: 'O payload deve ter o mesmo tamanho da library' });
    }

    // Garantir que os valores de _id de pasta existem e são únicos
    const uniqueIds = new Set<string>();
    for (const item of payload) {
      if (!item._id || uniqueIds.has(item._id.toString()) || !library.some((folder: any) => folder._id.equals(new ObjectId(item._id)))) {
        return res.status(400).json({ msg: 'Os valores de _id de pasta devem ser únicos e não podem ser inválidos' });
      }
      uniqueIds.add(item._id.toString());
    }

    // Coloca order 1 na pasta default do payload
    const defaultFolderInPayload = payload.find((item) => item._id === library.find((folder: any) => folder.is_default)?._id.toString());
    if (defaultFolderInPayload) {
      defaultFolderInPayload.order = 1;
    }

    // Garantir que apenas a pasta default tenha order valor 1 e que os valores de order são únicos
    const uniqueOrders = new Set<number>();
    for (const item of payload) {
      if (item.order === 1 && item._id !== defaultFolderInPayload?._id) {
        return res.status(400).json({ msg: 'Apenas a pasta padrão pode ter o valor de order igual a 1' });
      }
      if (uniqueOrders.has(item.order)) {
        return res.status(400).json({ msg: 'Os valores de order devem ser únicos' });
      }
      uniqueOrders.add(item.order);
    }

    // Ordenar de forma crescente o payload pelo campo order
    payload.sort((a, b) => a.order - b.order);

    // Atribuir as pastas não default, valor de index + 1 no campo order
    let nextOrder = 2; // Começando em 2 porque 1 já foi atribuído à pasta padrão
    for (const item of payload) {
      if (item._id !== defaultFolderInPayload?._id) {
        item.order = nextOrder;
        nextOrder++;
      }
    }

    // Atualizar a ordem na estrutura da biblioteca com base nos dados do payload
    payload.forEach((item: FolderOrder) => {
      const folderToUpdate = library.find((folder: any) => folder._id.equals(new ObjectId(item._id)));
      if (folderToUpdate) {
        folderToUpdate.order = item.order;
      }
    });

    // Salva as alterações no banco de dados
    const { updatedLibrary, error: updateLibraryError } = await LibraryService.updateLibrary(user_id, library);
    if (updateLibraryError) {
      return res.status(500).json({ msg: updateLibraryError });
    }
    if (!updatedLibrary || updatedLibrary.length === 0) {
      return res.status(404).json({ msg: 'Nenhum dado encontrado' });
    }

    // Retorna o usuário atualizado
    return res.status(200).json(updatedLibrary);
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