import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';
import { NoteController } from '../controllers/noteController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Note
 *   description: Rotas para manipulação de anotações
 */

/**
 * @swagger
 * /notes/{note_id}:
 *   parameters:
 *     - name: note_id
 *       in: path
 *       required: true
 *       description: ID da anotação que será visualizada
 *       schema:
 *         type: string
 *   get:
 *     summary: Visualiza anotação pelo _id
 *     description: Retorna as informações da anotação pelo _id
 *     tags:
 *       - Note
 *     operationId: get_note_by_id
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Note"
 *         links: [] 
 *       400:
 *         description: BadRequest
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BadRequest"
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

router.get('/:note_id', authMiddleware, NoteController.getNoteById);

/**
 * @swagger
 * /notes:
 *   post:
 *     summary: Cria uma nova anotação
 *     description: Cria uma nova anotação com base nos dados fornecidos no corpo da requisição.
 *     tags:
 *       - Note
 *     operationId: create_note
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/NoteCreate"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Note"
 *         links: [] 
 *       400:
 *         description: BadRequest
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BadRequest"
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

router.post('/', authMiddleware, NoteController.createNote);

export default router;