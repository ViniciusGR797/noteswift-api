// src/controllers/userController.ts

import { Request, Response } from 'express';
import { UserModel } from '../models/userModel'; // Importe explicitamente o modelo User

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar os usuários' });
  }
};
