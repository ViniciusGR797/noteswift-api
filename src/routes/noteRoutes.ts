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
 *     description: Cria uma nova anotação com base nos dados fornecidos no corpo da requisição
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

/**
 * @swagger
 * /notes/download:
 *   post:
 *     summary: Cria um arquivo PDF de anotações 
 *     description: Cria um arquivo PDF de anotações com base nos dados fornecidos no corpo da requisição
 *     tags:
 *       - Note
 *     operationId: download_note
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/NoteList"
 *     responses:
 *       201:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Bin"
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

router.post('/download', authMiddleware, NoteController.downloadNote);

/**
 * @swagger
 * /notes/{note_id}:
 *   parameters:
 *     - name: note_id
 *       in: path
 *       required: true
 *       description: ID da anotação que será atualizada
 *       schema:
 *         type: string
 *   put:
 *     summary: Atualiza anotação
 *     description: Atualiza as informações da anotação desejada
 *     tags:
 *       - Note
 *     operationId: update_note
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/NoteUpdate"
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

router.put('/:note_id', authMiddleware, NoteController.updateNote);

/**
 * @swagger
 * /notes/moved/{note_id}:
 *   parameters:
 *     - name: note_id
 *       in: path
 *       required: true
 *       description: ID da anotação que será movida
 *       schema:
 *         type: string
 *   put:
 *     summary: Mover anotação
 *     description: Alterar pasta em que se encontra a anotação
 *     tags:
 *       - Note
 *     operationId: move_note
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/NoteMove"
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MoveSuccess"
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

router.put('/moved/:note_id', authMiddleware, NoteController.moveNote);

/**
 * @swagger
 * /notes/trash/{note_id}:
 *   parameters:
 *     - name: note_id
 *       in: path
 *       required: true
 *       description: ID da anotação que será movida para lixeira
 *       schema:
 *         type: string
 *   put:
 *     summary: Mover anotação para lixeira
 *     description: Reciclar anotação para lixeira
 *     tags:
 *       - Note
 *     operationId: trash_note
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

router.put('/trash/:note_id', authMiddleware, NoteController.trashNote);

/**
 * @swagger
 * /notes/restore/{note_id}:
 *   parameters:
 *     - name: note_id
 *       in: path
 *       required: true
 *       description: ID da anotação que será recuperada da lixeira
 *       schema:
 *         type: string
 *   put:
 *     summary: Recuperar anotação da lixeira
 *     description: Recuperar anotação em que se encontra na lixeira
 *     tags:
 *       - Note
 *     operationId: restore_note
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

router.put('/restore/:note_id', authMiddleware, NoteController.restoreNote);

/**
 * @swagger
 * /notes/{note_id}:
 *   parameters:
 *     - name: note_id
 *       in: path
 *       required: true
 *       description: ID da anotação que será deletada
 *       schema:
 *         type: string
 *   delete:
 *     summary: Remove anotação
 *     description: Apaga dados de anotação
 *     tags:
 *       - Note
 *     operationId: delete_note
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DeleteSuccess"
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

router.delete('/:note_id', authMiddleware, NoteController.deleteNote);

export default router;