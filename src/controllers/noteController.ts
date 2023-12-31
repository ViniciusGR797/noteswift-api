import { Request, Response } from 'express';
import { sendEmail, EmailOptions, TemplateEmail } from '../utils/email';
import { ObjectId } from 'mongodb';
import { isDefined, validate } from 'class-validator';
import { NoteService } from '../services/noteService';
import { Note, NoteCreate, NoteDownload, NoteMove, NoteUpdate } from '../models/noteModel';
import moment from 'moment';
import { FolderService } from '../services/folderService';
import { TemplatePDF, generatePDF } from '../utils/pdf';
import { LibraryService } from '../services/libraryService';

export class NoteController {
    static async getNoteById(req: Request, res: Response): Promise<Response> {
        // ID do usuário obtido pelo middleware de autenticação
        const user_id = req.user_id;

        const note_id = req.params.note_id;

        // Valida parâmetro
        if (!ObjectId.isValid(note_id)) {
            return res.status(400).json({ msg: 'O parâmetro note_id não está no formato correto de ObjectID' });
        }

        const { note, error } = await NoteService.getNoteById(user_id, note_id);
        if (error) {
            return res.status(500).json({ msg: error });
        }
        if (!note) {
            return res.status(404).json({ msg: 'Nenhum dado encontrado' });
        }

        return res.status(200).json(note);
    }

    static async createNote(req: Request, res: Response): Promise<Response> {
        // ID do usuário obtido pelo middleware de autenticação
        const user_id = req.user_id;

        const payload = new NoteCreate(req.body);

        const errors = await validate(payload);
        if (errors.length > 0) {
            const firstError = errors[0];
            const errorMessage = firstError.constraints ? Object.values(firstError.constraints)[0] : 'Alguns parâmetros podem estar faltando ou serem inválidos';
            return res.status(400).json({ msg: errorMessage });
        }

        // Garantir que o folder_id é existe
        const { folder, error } = await FolderService.getFolderById(user_id, payload.folder_id.toString());
        if (error) {
            return res.status(500).json({ msg: error });
        }
        if (!folder) {
            return res.status(404).json({ msg: 'Nenhuma pasta encontrada com esse folder_id passado' });
        }

        // Popula com dados a nova note
        const data = new Note({
            "_id": new ObjectId(),
            "title": payload.title,
            "body": payload.body,
            "style": payload.style,
            "trashed": false,
            "deleted_date": '',
            "update_at": moment().tz('America/Sao_Paulo').format('YYYY-MM-DD HH:mm:ss')
        });

        // Cria a note
        const { createdNoteID, error: createNoteError } = await NoteService.createNote(user_id, payload.folder_id.toString(), data);
        if (createNoteError) {
            return res.status(500).json({ msg: createNoteError });
        }
        if (!createdNoteID || createdNoteID === "") {
            return res.status(404).json({ msg: 'Nenhum dado encontrado' });
        }

        // Busca a note criado para validação
        const { note, error: getNoteError } = await NoteService.getNoteById(user_id, createdNoteID);
        if (getNoteError) {
            return res.status(500).json({ msg: getNoteError });
        }
        if (!note) {
            return res.status(404).json({ msg: 'Nenhum dado encontrado' });
        }

        return res.status(201).json(note);
    }

    static async downloadNote(req: Request, res: Response): Promise<Response> {
        // ID do usuário obtido pelo middleware de autenticação
        const user_id = req.user_id;

        const payload: NoteDownload[] = req.body.map((data: any) => new NoteDownload(data));

        // Validar cada item do payload individualmente
        for (const item of payload) {
            const itemErrors = await validate(item);
            if (itemErrors.length > 0) {
                const firstError = itemErrors[0];
                const errorMessage = firstError.constraints ? Object.values(firstError.constraints)[0] : 'Alguns parâmetros podem estar faltando ou serem inválidos';
                return res.status(400).json({ msg: errorMessage });
            }
        }

        // Garantir que os valores de _id de note existem e são únicos, além de popular com dados
        const notes = [];
        const uniqueIds = new Set<string>();
        for (const item of payload) {
            const { note, error } = await NoteService.getNoteById(user_id, item._id.toString());
            if (error) {
                return res.status(500).json({ msg: error });
            }
            if (!note) {
                return res.status(404).json({ msg: 'Nenhum dado encontrado' });
            }
            if (uniqueIds.has(item._id.toString())) {
                return res.status(400).json({ msg: 'Os valores de _id de anotação devem ser únicos, evitar repetição de dados no PDF' });
            }

            uniqueIds.add(item._id.toString());
            notes.push(note);
        }

        // Pega library do user
        const { library, error } = await LibraryService.getLibrary(user_id);
        if (error) {
            return res.status(500).json({ msg: error });
        }
        if (!library || library.length === 0) {
            return res.status(404).json({ msg: 'Nenhum dado encontrado' });
        }

        // Filtrar as pastas que contêm anotações presentes no payload
        const foldersWithNotes = library
            .filter((folder: any) => folder.notes.some((note: any) => payload.some((item) => item._id.toString() === note._id.toString())))
            .map((folder: any) => ({
                ...folder,
                notes: folder.notes.filter((note: any) => payload.some((item) => item._id.toString() === note._id.toString()))
            }));

        const fileName = 'download_note.pdf'
        generatePDF(foldersWithNotes, TemplatePDF.downloadNoteTemplate, fileName);

        const fileNameSimple = 'download_note_simple.pdf'
        generatePDF(foldersWithNotes, TemplatePDF.downloadNoteSimpleTemplate, fileNameSimple);

        return res.status(200).json(foldersWithNotes);
    }

    static async updateNote(req: Request, res: Response): Promise<Response> {
        // ID do usuário obtido pelo middleware de autenticação
        const user_id = req.user_id;

        const note_id = req.params.note_id;

        // Valida parâmetro
        if (!ObjectId.isValid(note_id)) {
            return res.status(400).json({ msg: 'O parâmetro note_id não está no formato correto de ObjectID' });
        }

        const payload = new NoteUpdate(req.body);

        const errors = await validate(payload);
        if (errors.length > 0) {
            const firstError = errors[0];
            const errorMessage = firstError.constraints ? Object.values(firstError.constraints)[0] : 'Alguns parâmetros podem estar faltando ou serem inválidos';
            return res.status(400).json({ msg: errorMessage });
        }

        // Busca a note 
        const { note, error: getNoteError } = await NoteService.getNoteById(user_id, note_id);
        if (getNoteError) {
            return res.status(500).json({ msg: getNoteError });
        }
        if (!note) {
            return res.status(404).json({ msg: 'Nenhum dado encontrado' });
        }

        // Mantém o valor anterior se não fornecer um novo 
        note.title = payload.title || note.title;
        note.body = payload.body || note.body;
        note.style = payload.style || note.style;

        // Salva as alterações no banco de dados
        const { updatedNote, error: updateNoteError } = await NoteService.updateNote(user_id, note);
        if (updateNoteError) {
            return res.status(500).json({ msg: updateNoteError });
        }
        if (!updatedNote) {
            return res.status(404).json({ msg: 'Nenhum dado encontrado' });
        }

        return res.status(200).json(updatedNote);
    }

    static async moveNote(req: Request, res: Response): Promise<Response> {
        // ID do usuário obtido pelo middleware de autenticação
        const user_id = req.user_id;

        const note_id = req.params.note_id;

        // Valida parâmetro
        if (!ObjectId.isValid(note_id)) {
            return res.status(400).json({ msg: 'O parâmetro note_id não está no formato correto de ObjectID' });
        }

        const payload = new NoteMove(req.body);

        const errors = await validate(payload);
        if (errors.length > 0) {
            const firstError = errors[0];
            const errorMessage = firstError.constraints ? Object.values(firstError.constraints)[0] : 'Alguns parâmetros podem estar faltando ou serem inválidos';
            return res.status(400).json({ msg: errorMessage });
        }

        // Garantir que o folder_id existe
        const { folder, error } = await FolderService.getFolderById(user_id, payload.folder_id.toString());
        if (error) {
            return res.status(500).json({ msg: error });
        }
        if (!folder) {
            return res.status(404).json({ msg: 'Nenhuma pasta encontrada com esse folder_id passado' });
        }

        // Garantir que o note_id existe
        const { note, error: getNoteError } = await NoteService.getNoteById(user_id, note_id);
        if (getNoteError) {
            return res.status(500).json({ msg: getNoteError });
        }
        if (!note) {
            return res.status(404).json({ msg: 'Nenhum dado encontrado' });
        }

        // Salva as alterações no banco de dados
        const { updatedNote, error: updateNoteError } = await NoteService.moveNote(user_id, payload.folder_id.toString(), note_id);
        if (updateNoteError) {
            return res.status(500).json({ msg: updateNoteError });
        }
        if (!updatedNote) {
            return res.status(404).json({ msg: 'Nenhum dado encontrado' });
        }

        return res.status(200).json({ msg: 'Movida com sucesso' });
    }

    static async trashNote(req: Request, res: Response): Promise<Response> {
        // ID do usuário obtido pelo middleware de autenticação
        const user_id = req.user_id;

        const note_id = req.params.note_id;

        // Valida parâmetro
        if (!ObjectId.isValid(note_id)) {
            return res.status(400).json({ msg: 'O parâmetro note_id não está no formato correto de ObjectID' });
        }

        // Busca a note 
        const { note, error: getNoteError } = await NoteService.getNoteById(user_id, note_id);
        if (getNoteError) {
            return res.status(500).json({ msg: getNoteError });
        }
        if (!note) {
            return res.status(404).json({ msg: 'Nenhum dado encontrado' });
        }

        // Marca anotação na lixeira e dá 2 semanas para ser excluida definitivamente
        note.trashed = true;
        note.deleted_date = moment().tz('America/Sao_Paulo').add(2, 'week').format('YYYY-MM-DD HH:mm:ss');

        // Salva as alterações no banco de dados
        const { updatedNote, error: updateNoteError } = await NoteService.updateNote(user_id, note);
        if (updateNoteError) {
            return res.status(500).json({ msg: updateNoteError });
        }
        if (!updatedNote) {
            return res.status(404).json({ msg: 'Nenhum dado encontrado' });
        }

        return res.status(200).json(updatedNote);
    }

    static async restoreNote(req: Request, res: Response): Promise<Response> {
        // ID do usuário obtido pelo middleware de autenticação
        const user_id = req.user_id;

        const note_id = req.params.note_id;

        // Valida parâmetro
        if (!ObjectId.isValid(note_id)) {
            return res.status(400).json({ msg: 'O parâmetro note_id não está no formato correto de ObjectID' });
        }

        // Busca a note 
        const { note, error: getNoteError } = await NoteService.getNoteById(user_id, note_id);
        if (getNoteError) {
            return res.status(500).json({ msg: getNoteError });
        }
        if (!note) {
            return res.status(404).json({ msg: 'Nenhum dado encontrado' });
        }

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

        return res.status(200).json(updatedNote);
    }

    static async deleteNote(req: Request, res: Response): Promise<Response> {
        // ID do usuário obtido pelo middleware de autenticação
        const user_id = req.user_id;

        const note_id = req.params.note_id;

        // Valida parâmetro
        if (!ObjectId.isValid(note_id)) {
            return res.status(400).json({ msg: 'O parâmetro note_id não está no formato correto de ObjectID' });
        }

        // Garantir que o note_id existe
        const { note, error: getNoteError } = await NoteService.getNoteById(user_id, note_id);
        if (getNoteError) {
            return res.status(500).json({ msg: getNoteError });
        }
        if (!note) {
            return res.status(404).json({ msg: 'Nenhum dado encontrado' });
        }

        // Remove a anotação
        const { deletedUserWithoutNote, error: deleteNoteError } = await NoteService.deleteNote(user_id, note_id);
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

        // Retorna mensagem de sucesso
        return res.status(200).json({ msg: 'Excluído com sucesso' });
    }
}