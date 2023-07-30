import { Request, Response } from 'express';
import { LibraryService } from '../services/libraryService';
import { sendEmail, EmailOptions, TemplateEmail } from '../utils/email';
import { FolderOrder } from '../models/folderModel';
import { validate } from 'class-validator';
import { ObjectId, ProfilingLevel } from 'mongodb';
import { BinService } from '../services/binService';
import { NoteService } from '../services/noteService';
import { generatePDF } from '../utils/pdf';

export class BinController {
    static async getBin(req: Request, res: Response): Promise<Response> {
        // ID do usuário obtido pelo middleware de autenticação
        const user_id = req.user_id;

        const { bin, error } = await BinService.getBin(user_id);
        if (error) {
            return res.status(500).json({ msg: error });
        }
        if (!bin || bin.length === 0) {
            return res.status(404).json({ msg: 'Nenhum dado encontrado' });
        }

        return res.status(200).json(bin);
    }

    static async backupBin(req: Request, res: Response): Promise<Response> {
        // ID do usuário obtido pelo middleware de autenticação
        const user_id = req.user_id;

        const { bin, error } = await BinService.getBin(user_id);
        if (error) {
            return res.status(500).json({ msg: error });
        }
        if (!bin || bin.length === 0) {
            return res.status(404).json({ msg: 'Nenhum dado encontrado' });
        }

        generatePDF(bin, 'trashed_notes.pdf');

        return res.status(200).json(bin);
    }

    static async restoreBin(req: Request, res: Response): Promise<Response> {
        // ID do usuário obtido pelo middleware de autenticação
        const user_id = req.user_id;

        // Pega anotações da lixeira
        const { bin, error } = await BinService.getBin(user_id);
        if (error) {
            return res.status(500).json({ msg: error });
        }
        if (!bin || bin.length === 0) {
            return res.status(404).json({ msg: 'Nenhum dado encontrado' });
        }

        // Percorre toda lixeira recuperando
        for (const note of bin) {
            // Retira marcação e deleted_date
            note.trashed = false;
            note.deleted_date = '';

            // Salva as alterações no banco de dados
            const { updatedNote, error: updateNoteError } = await NoteService.updateNote(user_id, note);
            if (updateNoteError) {
                return res.status(500).json({ msg: updateNoteError });
            }
            if (!updatedNote) {
                return res.status(404).json({ msg: 'Nenhum dado encontrado' });
            }
        }

        return res.status(200).json({ msg: 'Recuperado com sucesso' });
    }

    static async deleteBin(req: Request, res: Response): Promise<Response> {
        // ID do usuário obtido pelo middleware de autenticação
        const user_id = req.user_id;

        // Pega anotações da lixeira
        const { bin, error } = await BinService.getBin(user_id);
        if (error) {
            return res.status(500).json({ msg: error });
        }
        if (!bin || bin.length === 0) {
            return res.status(404).json({ msg: 'Nenhum dado encontrado' });
        }

        // Percorre toda lixeira recuperando
        for (const note of bin) {
            // Remove a anotação
            const { deletedUserWithoutNote, error: deleteNoteError } = await NoteService.deleteNote(user_id, note._id);
            if (deleteNoteError) {
                return res.status(500).json({ msg: deleteNoteError });
            }
            if (!deletedUserWithoutNote) {
                return res.status(404).json({ msg: 'Nenhum dado encontrado' });
            }

            const emailOptions: EmailOptions = {
                to: deletedUserWithoutNote.email,
                subject: 'Anotação apagada',
                html: TemplateEmail.deleteNoteTemplate(deletedUserWithoutNote),
            };

            sendEmail(emailOptions);
        }

        return res.status(200).json({ msg: 'Excluído com sucesso' });
    }
}