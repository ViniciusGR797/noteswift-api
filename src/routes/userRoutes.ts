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
 *     summary: Lista o usuário logado
 *     description: Retorna as informações do usuário logado
 *     tags:
 *       - User
 *     operationId: get_user_me
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *         links: [] 
 *       500:
 *         description: Erro ao buscar os usuários.
 *         links: []
 */
router.get('/', getUsers);

export default router;
