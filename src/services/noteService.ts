import { ObjectId } from "mongodb";
import { getDB } from '../utils/database';

export class NoteService {
    // Função para buscar note por id
    static async getNoteById(user_id: string, note_id: string): Promise<{ note: any | null, error: string | null }> {
        try {
            const db = getDB();
            const collection = db.collection("users");
            const user = await collection.findOne({ _id: new ObjectId(user_id) });

            // Verificar se o usuário foi encontrado no banco de dados
            if (!user) {
                return { note: null, error: null };
            }

            // Percorrer as pastas do usuário para encontrar a nota com o _id correspondente
            const foundNote = user.library
                .flatMap((folder: any) => folder.notes)
                .find((note: any) => note._id.equals(new ObjectId(note_id)));

            return { note: foundNote, error: null };
        } catch (error) {
            return { note: null, error: "Erro interno do servidor" };
        }
    }

    // Função para criar note
    static async createNote(user_id: string, folder_id: string, data: any): Promise<{ createdNoteID: string; error: string | null }> {
        try {
            const db = getDB();
            const collection = db.collection("users");
            const user = await collection.findOne({ _id: new ObjectId(user_id) });

            // Verificar se o usuário foi encontrado no banco de dados
            if (!user) {
                return { createdNoteID: "", error: null };
            }

            // Encontrar a pasta na library com base no folder_id
            const folderToUpdate = user.library.find((folder: any) => folder._id.equals(new ObjectId(folder_id)));

            // Verificar se a pasta foi encontrada
            if (!folderToUpdate) {
                return { createdNoteID: "", error: null };
            }

            // Adicionar a nova anotação (data) à lista de notas da pasta
            folderToUpdate.notes.push(data);

            // Atualizar o usuário no banco de dados e retornar o documento atualizado após a atualização
            const result = await collection.findOneAndUpdate(
                { _id: new ObjectId(user_id) },
                { $set: { library: user.library } },
                { returnDocument: 'after' }
            );

            // Verificar se o usuário foi encontrado e atualizado
            if (!result.value) {
                return { createdNoteID: "", error: null };
            }

            // Retorna o ID da nova anotação
            return { createdNoteID: folderToUpdate.notes[folderToUpdate.notes.length - 1]._id.toString(), error: null };
        } catch (error) {
            return { createdNoteID: "", error: 'Erro interno do servidor' };
        }
    }

    // Função para atualizar note
    static async updateNote(user_id: string, updatedNote: any): Promise<{ updatedNote: any | null; error: string | null }> {
        try {
            const db = getDB();
            const collection = db.collection("users");
            const user = await collection.findOne({ _id: new ObjectId(user_id) });

            // Verificar se o usuário foi encontrado no banco de dados
            if (!user) {
                return { updatedNote: null, error: null };
            }

            // Procurar a pasta que contém a nota a ser atualizada
            const folderWithNote = user.library.find((folder: any) => folder.notes.some((note: any) => note._id.equals(updatedNote._id)));

            // Verificar se a pasta foi encontrada
            if (!folderWithNote) {
                return { updatedNote: null, error: null };
            }

            // Atualizar a nota dentro da pasta
            folderWithNote.notes = folderWithNote.notes.map((note: any) => {
                if (note._id.equals(updatedNote._id)) {
                    return { ...note, ...updatedNote };
                }
                return note;
            });

            // Atualiza o usuário no banco de dados e retorna o documento atualizado após a atualização
            const result = await collection.findOneAndUpdate(
                { _id: new ObjectId(user_id) },
                { $set: { library: user.library } },
                { returnDocument: 'after' }
            );

            // Verifica se o usuário foi encontrado e atualizado
            if (!result.value) {
                return { updatedNote: null, error: null };
            }

            // Procurar e retornar a nota atualizada
            const updatedNoteFromResult = result.value.library.find((folder: any) => folder._id.equals(folderWithNote._id))?.notes.find((note: any) => note._id.equals(updatedNote._id));

            return { updatedNote: updatedNoteFromResult, error: null };
        } catch (error) {
            return { updatedNote: null, error: 'Erro interno do servidor' };
        }
    }

    // Função para mover note
    static async moveNote(user_id: string, folder_id: string, note_id: string): Promise<{ updatedNote: any | null; error: string | null }> {
        try {
            const db = getDB();
            const collection = db.collection("users");
            const user = await collection.findOne({ _id: new ObjectId(user_id) });

            // Verificar se o usuário foi encontrado no banco de dados
            if (!user) {
                return { updatedNote: null, error: null };
            }

            // Encontrar a nota a ser movida na biblioteca do usuário
            const noteToMove = user.library
                .map((folder: any) => folder.notes.find((note: any) => note._id.equals(note_id)))
                .find((note: any) => !!note);

            // Verificar se a nota foi encontrada
            if (!noteToMove) {
                return { updatedNote: null, error: null };
            }

            // Encontrar a pasta de destino na biblioteca do usuário
            const destinationFolder = user.library.find((folder: any) => folder._id.equals(folder_id));

            // Verificar se a pasta de destino foi encontrada
            if (!destinationFolder) {
                return { updatedNote: null, error: null };
            }

            // Remover a nota da pasta de origem
            for (const folder of user.library) {
                folder.notes = folder.notes.filter((note: any) => !note._id.equals(note_id));
            }

            // Adicionar a nota na pasta de destino
            destinationFolder.notes.push(noteToMove);

            // Atualizar o usuário no banco de dados e retorna o documento atualizado após a atualização
            const result = await collection.findOneAndUpdate(
                { _id: new ObjectId(user_id) },
                { $set: { library: user.library } },
                { returnDocument: 'after' }
            );

            // Verifica se o usuário foi encontrado e atualizado
            if (!result.value) {
                return { updatedNote: null, error: null };
            }

            // Procurar e retornar a nota atualizada
            const updatedNoteFromResult = result.value.library.find((folder: any) => folder._id.equals(folder_id))?.notes.find((note: any) => note._id.equals(note_id));

            return { updatedNote: updatedNoteFromResult, error: null };
        } catch (error) {
            return { updatedNote: null, error: 'Erro interno do servidor' };
        }
    }

    // Função para remover a anotação
    static async deleteNote(user_id: string, note_id: string): Promise<{ deletedUserWithoutNote: any | null; error: string | null }> {
        try {
            const db = getDB();
            const collection = db.collection('users');

            // Encontra o usuário no banco de dados pelo ID
            const user = await collection.findOne({ _id: new ObjectId(user_id) });

            // Verifica se o usuário foi encontrado
            if (!user) {
                return { deletedUserWithoutNote: null, error: null };
            }

            let noteToDelete = null;
            // Procura a nota a ser removida dentro das pastas do usuário
            for (const folder of user.library) {
                const note = folder.notes.find((note: any) => note._id.equals(new ObjectId(note_id)));
                if (note) {
                    noteToDelete = note;
                    // Remove a nota da lista de notas da pasta
                    folder.notes = folder.notes.filter((note: any) => !note._id.equals(new ObjectId(note_id)));
                    break;
                }
            }

            if (!noteToDelete) {
                return { deletedUserWithoutNote: null, error: null };
            }

            // Atualiza o usuário no banco de dados após remover a nota
            await collection.updateOne({ _id: new ObjectId(user_id) }, { $set: { library: user.library } });

            // Pega user com apenas note apagada para mandar por email
            const deletedUserWithoutNote = {
                "_id": user._id,
                "name": user.name,
                "email": user.email,
                "library": [{
                    "notes": [noteToDelete]
                }]
            }            

            // Retorna a nota removida
            return { deletedUserWithoutNote: deletedUserWithoutNote, error: null };
        } catch (error) {
            return { deletedUserWithoutNote: null, error: 'Erro interno do servidor' };
        }
    }
}