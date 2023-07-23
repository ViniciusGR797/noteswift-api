import { IUserCreation, UserCreation } from '../models/userModel';

export class Validate {
  static async validateUserCreationData(data: IUserCreation): Promise<{ newUser: any | null, error: string | null }> {
    const newUser = new UserCreation(data);
    try {
      await newUser.validate();

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

      const newUserWithoutExtras = {
        name: data.name,
        email: data.email,
        pwd: data.pwd
      };
      return { newUser: newUserWithoutExtras, error: null };
    } catch (error: any) {
      return { newUser: null, error: error.message };
    }
  }
}



// private static mapUserToIUser(user: any): IUser {
//     return {
//       ...user,
//       _id: user._id.toString()
//     };
//   }




