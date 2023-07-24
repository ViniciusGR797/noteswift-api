import { ObjectId } from "mongodb";
import { getDB } from '../utils/database';

export class LibraryService {
  // Função para buscar library 
  static async getLibrary(userId: string): Promise<{ library: any | null, error: string | null }> {
    try {
      const db = getDB();
      const collection = db.collection("users");
      const user = await collection.findOne({ _id: new ObjectId(userId) });

      // Verificar se o usuário foi encontrado no banco de dados
      if (!user) {
        return { library: null, error: null };
      }

      // Obter o campo library do usuário e retorná-lo
      const library = user.library;

      return { library: library, error: null };      
    } catch (error) {
      return { library: null, error: "Erro interno do servidor" };
    }
  }

  // Função para remover library, deixa apenas library default
  static async deleteLibraryAndKeepDefault(userId: string): Promise<{ deletedUserWithoutLibrary: any | null; error: string | null }> {
    try {
      const db = getDB();
      const collection = db.collection('users');
  
      // Encontra o usuário no banco de dados pelo ID
      const user = await collection.findOne({ _id: new ObjectId(userId) });
  
      // Verifica se o usuário foi encontrado
      if (!user) {
        return { deletedUserWithoutLibrary: null, error: null };
      }
  
      // Filtra as pastas para manter apenas a pasta padrão (is_default === true)
      const updatedLibrary = user.library.filter((folder: any) => folder.is_default);
  
      // Atualiza o usuário no banco de dados, mantendo apenas a pasta padrão na biblioteca
      await collection.updateOne({ _id: new ObjectId(userId) }, { $set: { library: updatedLibrary } });
  
      // Retorna o usuário atualizado
      return { deletedUserWithoutLibrary: user, error: null };
    } catch (error) {
      return { deletedUserWithoutLibrary: null, error: 'Erro interno do servidor' };
    }
  }
}