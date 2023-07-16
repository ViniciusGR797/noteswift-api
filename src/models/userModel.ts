import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  // Outros campos do usuário, se houver
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  // Defina outros campos do usuário, se houver
});

export default model<IUser>('User', UserSchema);
