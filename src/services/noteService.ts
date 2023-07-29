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
}