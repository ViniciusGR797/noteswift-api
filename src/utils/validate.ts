import { IUserCreation, UserCreation } from '../models/userModel';

export class Validate {
    static async validateUserCreationData(data: IUserCreation): Promise<{ newUser: any | null, error: string | null }> {
        const newUser = new UserCreation(data);
        try {
          await newUser.validate();
          const newUserWithoutExtras = {
            name: data.name,
            email: data.email,
            pwd: data.pwd
          };
          return { newUser: newUserWithoutExtras, error: null };
        } catch (error: any) {
          return { newUser: null, error: "Alguns parâmetros podem estar faltando ou serem inválidos" };
        }
      }
}



// private static mapUserToIUser(user: any): IUser {
//     return {
//       ...user,
//       _id: user._id.toString()
//     };
//   }




