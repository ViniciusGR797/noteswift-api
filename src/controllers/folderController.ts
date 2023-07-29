import { Request, Response } from 'express';
import { FolderService } from '../services/folderService';
import { sendEmail, EmailOptions, Template } from '../utils/email';
import { ObjectId } from 'mongodb';
import { Folder, FolderCreate, coresDefault } from '../models/folderModel';
import { validate } from 'class-validator';
import { LibraryService } from '../services/libraryService';

export class FolderController {
    static async getDefaultFolder(req: Request, res: Response): Promise<Response> {
        // ID do usuário obtido pelo middleware de autenticação
        const user_id = req.user_id;

        const { folder, error } = await FolderService.getDefaultFolder(user_id);
        if (error) {
            return res.status(500).json({ msg: error });
        }
        if (!folder) {
            return res.status(404).json({ msg: 'Nenhum dado encontrado' });
        }

        return res.status(200).json(folder);
    }

    static async getFolderById(req: Request, res: Response): Promise<Response> {
        // ID do usuário obtido pelo middleware de autenticação
        const user_id = req.user_id;

        const folder_id = req.params.folder_id;

        // Valida parâmetro
        if (!ObjectId.isValid(folder_id)) {
            return res.status(400).json({ msg: 'O parâmetro folder_id não está no formato correto de ObjectID' });
        }

        const { folder, error } = await FolderService.getFolderById(user_id, folder_id);
        if (error) {
            return res.status(500).json({ msg: error });
        }
        if (!folder) {
            return res.status(404).json({ msg: 'Nenhum dado encontrado' });
        }

        return res.status(200).json(folder);
    }

    static async getFolderByName(req: Request, res: Response): Promise<Response> {
        // ID do usuário obtido pelo middleware de autenticação
        const user_id = req.user_id;

        const folder_name = req.params.folder_name;

        // Valida parâmetro
        if (typeof folder_name !== 'string' || folder_name.trim().length === 0 || folder_name.length > 100) {
            return res.status(400).json({ msg: 'O parâmetro folder_name não é um nome válido ou excede o tamanho permitido' });
        }

        const { folders, error } = await FolderService.getFolderByName(user_id, folder_name);
        if (error) {
            return res.status(500).json({ msg: error });
        }
        if (!folders || folders.length === 0) {
            return res.status(404).json({ msg: 'Nenhum dado encontrado' });
        }

        return res.status(200).json(folders);
    }

    static async createFolder(req: Request, res: Response): Promise<Response> {
        // ID do usuário obtido pelo middleware de autenticação
        const user_id = req.user_id;

        const payload = new FolderCreate(req.body);
    
        const errors = await validate(payload);
        if (errors.length > 0) {
          const firstError = errors[0];
          const errorMessage = firstError.constraints ? Object.values(firstError.constraints)[0] : 'Alguns parâmetros podem estar faltando ou serem inválidos';
          return res.status(400).json({ msg: errorMessage });
        }

        const { library, error } = await LibraryService.getLibrary(user_id);
        if (error) {
            return res.status(500).json({ msg: error });
        }
        if (!library || library.length === 0) {
            return res.status(404).json({ msg: 'Nenhum dado encontrado' });
        }

        // Popula com dados a nova folder
        const data = new Folder({
          "_id": new ObjectId(),
          "name": payload.name,
          "is_default": false,
          "color": coresDefault[Math.floor(Math.random() * coresDefault.length)],
          "order": library.length + 1,
          "notes": []
        });

        // Cria o novo usuário
        const { createdFolderID, error: createFolderError } = await FolderService.createFolder(user_id, data);
        if (createFolderError) {
          return res.status(500).json({ msg: createFolderError });
        }        
    
        // Busca o usuário criado para validação
        const { folder, error: getFolderError } = await FolderService.getFolderById(user_id, createdFolderID);
        if (getFolderError) {
            return res.status(500).json({ msg: error });
        }
        if (!folder) {
            return res.status(404).json({ msg: 'Nenhum dado encontrado' });
        }
    
        return res.status(201).json(folder);
      }
}