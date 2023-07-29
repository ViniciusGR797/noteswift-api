import { ObjectId } from "mongodb";
import { getDB } from '../utils/database';

export class UserService {
  // Função para buscar o usuário por ID 
  static async getUserById(user_id: string): Promise<{ user: any | null, error: string | null }> {
    try {
      const db = getDB();
      const collection = db.collection("users");
      const user = await collection.findOne({ _id: new ObjectId(user_id) });

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
  static async updateUser(user_id: string, updatedUser: any): Promise<{ updatedUser: any | null; error: string | null }> {
    try {
      const db = getDB();
      const collection = db.collection('users');

      // Atualiza o usuário no banco de dados e retorna o documento atualizado após a atualização
      const result = await collection.findOneAndUpdate(
        { _id: new ObjectId(user_id) },
        { $set: updatedUser },
        { returnDocument: 'after' } 
      );

      // Verifica se o usuário foi encontrado e atualizado
      if (!result.value) {
        return { updatedUser: null, error: null };
      }

      // Retorna o usuário atualizado
      return { updatedUser: result.value, error: null };
    } catch (error) {
      return { updatedUser: null, error: 'Erro interno do servidor' };
    }
  }

  // Função para remover um usuário
  static async deleteUser(user_id: string): Promise<{ deletedUser: any | null; error: string | null }> {
    try {
      const db = getDB();
      const collection = db.collection('users');

      // Encontra o usuário no banco de dados pelo ID e o remove
      const result = await collection.findOneAndDelete({ _id: new ObjectId(user_id) });

      // Verifica se o usuário foi encontrado e removido
      if (!result.value) {
        return { deletedUser: null, error: null };
      }

      // Retorna o usuário removido
      return { deletedUser: result.value, error: null };
    } catch (error) {
      return { deletedUser: null, error: 'Erro interno do servidor' };
    }
  }
}
