import { ObjectId } from "mongodb";
import { getDB } from '../utils/database';
import { IUserCreation } from '../models/userModel';

export class UserService {
  // Função para buscar o usuário por ID no banco de dados
  static async getUserById(userId: string): Promise<{ user: any | null, error: string | null }> {
    try {
      const db = getDB();
      const collection = db.collection("users");
      const user = await collection.findOne({ _id: new ObjectId(userId) });

      return { user: user, error: null };
      
    } catch (error) {
      console.error("Error fetching user:", error);
      return { user: null, error: "Erro interno do servidor" };
    }
  }

  static async createUser(data: any): Promise<{ createdUserID: string; error: string | null }> {
    try {
      const db = getDB();
      const collection = db.collection("users");
  
      // Insere o usuário no banco de dados
      const result = await collection.insertOne(data);
  
      // Retorna o _id do usuário cadastrado
      const createdUserID = result.insertedId.toString();
  
      console.log(createdUserID);
  
      return { createdUserID, error: null };
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Error creating user.");
    }
  }

  // // Função para atualizar um usuário no banco de dados
  // static async updateUser(userId: string, newData: Partial<IUser>): Promise<void> {
  //   try {
  //     const db = getDB();
  //     const collection = db.collection("users");

  //     // Converte o ID em ObjectId
  //     const userObjectId = new ObjectId(userId);

  //     // Atualiza o usuário no banco de dados usando o ID
  //     await collection.updateOne({ _id: userObjectId }, { $set: newData });
  //   } catch (error) {
  //     console.error("Error updating user:", error);
  //     throw new Error("Error updating user.");
  //   }
  // }

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
