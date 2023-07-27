import { Schema } from 'mongoose';
import { IUpsertUser, UpsertUser } from '../models/userModel';
import { IUserConfig, UserConfig } from '../models/userConfigModel';

export class Validate {
  static async validateData(data: any): Promise<{ data: any | null, error: string | null }> {
    try {
      await data.validate();
            
      return { data: data, error: null };
    } catch (error: any) {
      return { data: null, error: error.message.replace(/^.*: /, '') };
    }
  }

 
}
