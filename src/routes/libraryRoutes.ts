import { Router } from 'express';
import { LibraryController } from '../controllers/libraryController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Library
 *   description: Rotas para manipulação de biblioteca de pastas
 */

/**
 * @swagger
 * /libraries:
 *   get:
 *     summary: Lista biblioteca de pastas
 *     description: Retorna as informações da biblioteca de pastas
 *     tags:
 *       - Library
 *     operationId: get_library
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Library"
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

router.get('/', authMiddleware, LibraryController.getLibrary);

/**
 * @swagger
 * /libraries/order:
 *   put:
 *     summary: Atualiza ordem da biblioteca
 *     description: Atualiza as informações ordem da biblioteca
 *     tags:
 *       - Library
 *     operationId: update_order_library
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/LibraryOrder"
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Library"
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

router.put('/order', authMiddleware, LibraryController.updateOrderLibrary);

/**
 * @swagger
 * /libraries:
 *   delete:
 *     summary: Remove biblioteca de pastas
 *     description: Apaga biblioteca de pastas, deixando apenas a pasta default
 *     tags:
 *       - Library
 *     operationId: delete_library
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

router.delete('/', authMiddleware, LibraryController.deleteLibrary);

export default router;
