import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';
import { BinController } from '../controllers/binController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Bin
 *   description: Rotas para manipulação da lixeira
 */


/**
 * @swagger
 * /bins:
 *   get:
 *     summary: Lista anotações da lixeira
 *     description: Retorna as informações das anotações da lixeira
 *     tags:
 *       - Bin
 *     operationId: get_bin
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Bin"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Unauthorized"
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Forbidden"
 *       404:
 *         description: NotFound
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/NotFound"
 *       500:
 *         description: InternalServerError
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/InternalServerError"
 */

router.get('/', authMiddleware, BinController.getBin);

/**
 * @swagger
 * /bins/backup:
 *   post:
 *     summary: Cria um arquivo PDF com lixeira para download e o envia por email
 *     description: Cria um arquivo PDF com base nos dados da lixeira para download e o envia por email
 *     tags:
 *       - Bin
 *     operationId: backup_bin
 *     responses:
 *       201:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Bin"
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
 *       500:
 *         description: InternalServerError
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/InternalServerError"
 */

router.post('/backup', authMiddleware, BinController.backupBin);

/**
 * @swagger
 * /bins/restore:
 *   put:
 *     summary: Recuperar todas as anotações da lixeira
 *     description: Recuperar todas as anotações em que se encontram na lixeira
 *     tags:
 *       - Bin
 *     operationId: restore_bin
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/RestoreSuccess"
 *       400:
 *         description: BadRequest
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/BadRequest"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Unauthorized"
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Forbidden"
 *       404:
 *         description: NotFound
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/NotFound"
 *       500:
 *         description: InternalServerError
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/InternalServerError"
 */

router.put('/restore', authMiddleware, BinController.restoreBin);

/**
 * @swagger
 * /bins:
 *   delete:
 *     summary: Remove todas as anotações da lixeira
 *     description: Apaga todas as anotações em que se encontram na lixeira
 *     tags:
 *       - Bin
 *     operationId: delete_bin
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DeleteSuccess"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Unauthorized"
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Forbidden"
 *       404:
 *         description: NotFound
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/NotFound"
 *       500:
 *         description: InternalServerError
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/InternalServerError"
 */

router.delete('/', authMiddleware, BinController.deleteBin);

export default router;
