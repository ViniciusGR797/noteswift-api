import { IUpsertUser, UpsertUser } from '../models/userModel';

export class Validate {
  static async validateUpsertUserData(data: IUpsertUser): Promise<{ upsertUser: any | null, error: string | null }> {
    const upsertUser = new UpsertUser(data);
    try {
      await upsertUser.validate();

      // Validação do email usando regex
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(data.email)) {
        throw new Error('Email inválido');
      }

      // Validação da senha forte
      const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!strongPasswordRegex.test(data.pwd)) {
        throw new Error('Senha fraca. A senha deve ter no mínimo 8 caracteres, incluindo pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial (@ $ ! % * ? &)');
      }

      const upsertUserWithoutExtras = {
        name: data.name,
        email: data.email,
        pwd: data.pwd
      };
      return { upsertUser: upsertUserWithoutExtras, error: null };
    } catch (error: any) {
      return { upsertUser: null, error: error.message };
    }
  }
}



// private static mapUserToIUser(user: any): IUser {
//     return {
//       ...user,
//       _id: user._id.toString()
//     };
//   }




