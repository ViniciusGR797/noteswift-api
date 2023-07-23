import { ObjectId } from "mongodb";
import { getDB } from '../utils/database';

export class UserService {
  // Função para buscar o usuário por ID 
  static async getUserById(userId: string): Promise<{ user: any | null, error: string | null }> {
    try {
      const db = getDB();
      const collection = db.collection("users");
      const user = await collection.findOne({ _id: new ObjectId(userId) });

      return { user: user, error: null };      
    } catch (error) {
      return { user: null, error: "Erro interno do servidor" };
    }
  }

  // Função para buscar o usuário por email
  static async getUserByEmail(email: string): Promise<{ user: any | null, error: string | null }> {
    try {
      const db = getDB();
      const collection = db.collection("users");
      const user = await collection.findOne({ email });

      return { user, error: null };      
    } catch (error) {
      return { user: null, error: "Erro interno do servidor" };
    }
  }

  // Função para criar usuário
  static async createUser(data: any): Promise<{ createdUserID: string; error: string | null }> {
    try {
      const db = getDB();
      const collection = db.collection("users");
  
      // Insere o usuário no banco de dados
      const result = await collection.insertOne(data);
  
      // Retorna o _id do usuário cadastrado
      const createdUserID = result.insertedId.toString();
  
      return { createdUserID, error: null };
    } catch (error) {
      return { createdUserID: "", error: "Erro interno do servidor" };
    }
  }

  // Função para atualizar um usuário
  static async updateUser(userId: string, updatedUser: any): Promise<{ updatedUser: any | null; error: string | null }> {
    try {
      const db = getDB();
      const collection = db.collection('users');

      // Atualiza o usuário no banco de dados e retorna o documento atualizado após a atualização
      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: updatedUser },
        { returnDocument: 'after' } 
      );

      // Verifica se o usuário foi encontrado e atualizado
      if (!result.value) {
        return { updatedUser: null, error: 'Erro interno do servidor' };
      }

      // Retorna o usuário atualizado
      return { updatedUser: result.value, error: null };
    } catch (error) {
      return { updatedUser: null, error: 'Erro interno do servidor' };
    }
  }

  // // Função para excluir um usuário do banco de dados
  // static async deleteUser(userId: string): Promise<void> {
  //   try {
  //     const db = getDB();
  //     const collection = db.collection("users");

  //     // Converte o ID em ObjectId
  //     const userObjectId = new ObjectId(userId);

  //     // Exclui o usuário do banco de dados usando o ID
  //     await collection.deleteOne({ _id: userObjectId });
  //   } catch (error) {
  //     console.error("Error deleting user:", error);
  //     throw new Error("Error deleting user.");
  //   }
  // }
}
