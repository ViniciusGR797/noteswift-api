import { ObjectId } from "mongodb";
import { getDB } from '../utils/database';

export class UserConfigService {
  // Função para buscar configurações do usuário
  static async getUserConfig(userId: string): Promise<{ userConfig: any | null, error: string | null }> {
    try {
      const db = getDB();
      const collection = db.collection("users");
      const user = await collection.findOne({ _id: new ObjectId(userId) });

      // Verifica se o usuário foi encontrado
      if (!user) {
        return { userConfig: null, error: null };
      }

      return { userConfig: user.config, error: null };      
    } catch (error) {
      return { userConfig: null, error: "Erro interno do servidor" };
    }
  }

  // Função para atualizar configurações do usuário
  static async updateUserConfig(userId: string, updatedUserConfig: any): Promise<{ updatedUserConfig: any | null; error: string | null }> {
    try {
      const db = getDB();
      const collection = db.collection('users');

      // Atualiza o usuário no banco de dados e retorna o documento atualizado após a atualização
      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: { config: updatedUserConfig } },
        { returnDocument: 'after' } 
      );

      // Verifica se o usuário foi encontrado e atualizado
      if (!result.value) {
        return { updatedUserConfig: null, error: null };
      }

      // Retorna a configuração atualizada
      return { updatedUserConfig: result.value.config, error: null };
    } catch (error) {
      return { updatedUserConfig: null, error: 'Erro interno do servidor' };
    }
  }
}