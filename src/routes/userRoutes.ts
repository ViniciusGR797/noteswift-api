// src/routes/userRoutes.ts

import { Router } from 'express';
import { getUsers } from '../controllers/userController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Rotas para manipulação de usuários
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retorna a lista de todos os usuários.
 *     tags:
 *       - User
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       500:
 *         description: Erro ao buscar os usuários.
 */
router.get('/', getUsers);

export default router;
