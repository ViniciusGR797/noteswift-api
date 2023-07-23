import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authMiddleware } from '../middlewares/auth';

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
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *         links: [] 
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Unauthorized"
 *         links: [] 
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Forbidden"
 *         links: [] 
 *       404:
 *         description: NotFound
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/NotFound"
 *         links: [] 
 *       500:
 *         description: InternalServerError
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/InternalServerError"
 *         links: [] 
 */

router.get('/', authMiddleware, UserController.getUserMe);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Cria um novo usuário
 *     description: Cria um novo usuário com base nos dados fornecidos no corpo da requisição.
 *     tags:
 *       - User
 *     operationId: create_user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UserCreation"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       400:
 *         description: BadRequest
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BadRequest"
 *       404:
 *         description: NotFound
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/NotFound"
 *         links: [] 
 *       500:
 *         description: InternalServerError
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/InternalServerError"
 */

router.post('/', UserController.createUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Faz login do usuário
 *     description: Autentica o usuário com base no email e senha fornecidos no corpo da requisição.
 *     tags:
 *       - User
 *     operationId: login_user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UserLogin"
 *     responses:
 *       200:
 *         description: Usuário autenticado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LoginSuccess"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/LoginFail"
 *       500:
 *         description: InternalServerError
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/InternalServerError"
 */
router.post('/login', UserController.loginUser);

export default router;
