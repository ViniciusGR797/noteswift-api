import { Request, Response } from 'express';
import { sendEmail, EmailOptions, Template } from '../utils/email';
import { ObjectId } from 'mongodb';
import { isDefined, validate } from 'class-validator';
import { NoteService } from '../services/noteService';
import { Note, NoteCreate, NoteMove, NoteUpdate } from '../models/noteModel';
import moment from 'moment';
import { FolderService } from '../services/folderService';

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

        // Garantir que o folder_id é existe
        const { folder, error } = await FolderService.getFolderById(user_id, payload.folder_id.toString());
        if (error) {
            return res.status(500).json({ msg: error });
        }
        if (!folder) {
            return res.status(404).json({ msg: 'Nenhuma pasta encontrada com esse folder_id passado' });
        }

        // Garantir que o note_id é existe
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

        // Marca anotação na lixeira e dá 2 semanas para ser excluida definitivamente
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
}