import { ObjectId } from "mongodb";
import { getDB } from '../utils/database';

export class BinService {
    // Função para buscar bin 
    static async getBin(user_id: string): Promise<{ bin: any | null, error: string | null }> {
        try {
            const db = getDB();
            const collection = db.collection("users");
            const user = await collection.findOne({ _id: new ObjectId(user_id) });

            // Verificar se o usuário foi encontrado no banco de dados
            if (!user) {
                return { bin: null, error: null };
            }

            // Filtrar as notas com trashed = true de todas as pastas usando flatMap e find
            const bin = user.library
                .flatMap((folder: any) => folder.notes)
                .filter((note: any) => note.trashed === true);

            return { bin: bin, error: null };
        } catch (error) {
            return { bin: null, error: "Erro interno do servidor" };
        }
    }
}