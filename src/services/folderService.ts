import { ObjectId } from "mongodb";
import { getDB } from '../utils/database';

export class FolderService {
    // Função para buscar pasta default
    static async getDefaultFolder(user_id: string): Promise<{ folder: any | null, error: string | null }> {
        try {
            const db = getDB();
            const collection = db.collection("users");
            const user = await collection.findOne({ _id: new ObjectId(user_id) });

            // Verificar se o usuário foi encontrado no banco de dados
            if (!user) {
                return { folder: null, error: null };
            }

            // Obter a pasta default e retorná-lo
            const defaultFolder = user.library.find((folder: any) => folder.is_default);

            return { folder: defaultFolder, error: null };
        } catch (error) {
            return { folder: null, error: "Erro interno do servidor" };
        }
    }

    // Função para buscar pasta por id
    static async getFolderById(user_id: string, folder_id: string): Promise<{ folder: any | null, error: string | null }> {
        try {
            const db = getDB();
            const collection = db.collection("users");
            const user = await collection.findOne({ _id: new ObjectId(user_id) });

            // Verificar se o usuário foi encontrado no banco de dados
            if (!user) {
                return { folder: null, error: null };
            }

            // Obter a pasta por id e retorná-lo
            const folder = user.library.find((folder: any) => folder._id.equals(new ObjectId(folder_id)));

            return { folder: folder, error: null };
        } catch (error) {
            return { folder: null, error: "Erro interno do servidor" };
        }
    }

    // Função para buscar pasta por name
    static async getFolderByName(user_id: string, folder_name: string): Promise<{ folders: any | null, error: string | null }> {
        try {
            const db = getDB();
            const collection = db.collection("users");
            const user = await collection.findOne({ _id: new ObjectId(user_id) });

            // Verificar se o usuário foi encontrado no banco de dados
            if (!user) {
                return { folders: null, error: null };
            }

            // Obter a pasta por id e retorná-lo
            const folders = user.library.filter((folder: any) =>
                new RegExp(folder_name, 'i').test(folder.name)
            );

            return { folders: folders, error: null };
        } catch (error) {
            return { folders: null, error: "Erro interno do servidor" };
        }
    }

    // Função para criar folder
    static async createFolder(user_id: string, data: any): Promise<{ createdFolderID: string; error: string | null }> {
        try {
            const db = getDB();
            const collection = db.collection("users");
            const user = await collection.findOne({ _id: new ObjectId(user_id) });

            // Verificar se o usuário foi encontrado no banco de dados
            if (!user) {
                return { createdFolderID: "", error: null };
            }

            // Obter o campo library e adiciona folder
            const library = user.library;
            library.push(data)

            // Atualiza o usuário no banco de dados e retorna o documento atualizado após a atualização
            const result = await collection.findOneAndUpdate(
                { _id: new ObjectId(user_id) },
                { $set: { library: library } },
                { returnDocument: 'after' }
            );

            // Verifica se o usuário foi encontrado e atualizado
            if (!result.value) {
                return { createdFolderID: "", error: null };
            }

            // Retorna a configuração atualizada
            return { createdFolderID: result.value.library[user.library.length - 1]._id, error: null };
        } catch (error) {
            return { createdFolderID: "", error: 'Erro interno do servidor' };
        }
    }

    // Função para atualizar folder
    static async updateFolder(user_id: string, updatedFolder: any): Promise<{ updatedFolder: any | null; error: string | null }> {
        try {
            const db = getDB();
            const collection = db.collection("users");
            const user = await collection.findOne({ _id: new ObjectId(user_id) });

            // Verificar se o usuário foi encontrado no banco de dados
            if (!user) {
                return { updatedFolder: null, error: null };
            }

            // Encontrar o folder na biblioteca do usuário
            const folderIndex = user.library.findIndex((folder: any) => folder._id.equals(updatedFolder._id));

            // Verificar se o folder foi encontrado na biblioteca do usuário
            if (folderIndex === -1) {
                return { updatedFolder: null, error: null };
            }

            // Atualizar o folder com os dados fornecidos
            user.library[folderIndex] = { ...user.library[folderIndex], ...updatedFolder };

            // Atualiza o usuário no banco de dados e retorna o documento atualizado após a atualização
            const result = await collection.findOneAndUpdate(
                { _id: new ObjectId(user_id) },
                { $set: { library: user.library } },
                { returnDocument: 'after' }
            );

            // Verifica se o usuário foi encontrado e atualizado
            if (!result.value) {
                return { updatedFolder: null, error: null };
            }

            // Retorna o ID do folder atualizado
            return { updatedFolder: result.value.library[folderIndex], error: null };
        } catch (error) {
            return { updatedFolder: null, error: 'Erro interno do servidor' };
        }
    }

    // Função para remover library, deixa apenas library default
    static async deleteFolder(user_id: string, folder_id: string): Promise<{ deletedUserWithoutFolder: any | null; error: string | null }> {
        try {
            const db = getDB();
            const collection = db.collection('users');

            // Encontra o usuário no banco de dados pelo ID
            const user = await collection.findOne({ _id: new ObjectId(user_id) });

            // Verifica se o usuário foi encontrado
            if (!user) {
                return { deletedUserWithoutFolder: null, error: null };
            }

            // Filtra as pastas para remover pasta desejada
            const updatedLibrary = user.library.filter((folder: any) => !folder._id.equals(new ObjectId(folder_id)));

            // Atualiza o usuário no banco de dados, mantendo apenas a pasta padrão na biblioteca
            await collection.updateOne({ _id: new ObjectId(user_id) }, { $set: { library: updatedLibrary } });

            // Pega user com apenas folder apagada para mandar por email
            user.library = user.library.filter((folder: any) => folder._id.equals(new ObjectId(folder_id)));

            // Retorna o usuário atualizado
            return { deletedUserWithoutFolder: user, error: null };
        } catch (error) {
            return { deletedUserWithoutFolder: null, error: 'Erro interno do servidor' };
        }
    }
}