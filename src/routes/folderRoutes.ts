import { Router } from 'express';
import { FolderController } from '../controllers/folderController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Folder
 *   description: Rotas para manipulação de pastas
 */

/**
 * @swagger
 * /folders:
 *   get:
 *     summary: Vizualiza pasta default
 *     description: Retorna as informações da pasta default
 *     tags:
 *       - Folder
 *     operationId: get_default_folder
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Folder"
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

router.get('/', authMiddleware, FolderController.getDefaultFolder);

/**
 * @swagger
 * /folders/{folder_id}:
 *   parameters:
 *     - name: folder_id
 *       in: path
 *       required: true
 *       description: ID da pasta que será visualizada
 *       schema:
 *         type: string
 *   get:
 *     summary: Visualiza pasta pelo _id
 *     description: Retorna as informações da pasta pelo _id
 *     tags:
 *       - Folder
 *     operationId: get_folder_by_id
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Folder"
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

router.get('/:folder_id', authMiddleware, FolderController.getFolderById);

/**
 * @swagger
 * /folders/name/{folder_name}:
 *   parameters:
 *     - name: folder_name
 *       in: path
 *       required: true
 *       description: Nome da pasta que será visualizada
 *       schema:
 *         type: string
 *   get:
 *     summary: Lista pastas pelo name
 *     description: Retorna as informações da pastas pelo name
 *     tags:
 *       - Folder
 *     operationId: get_folder_by_name
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Library"
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

router.get('/name/:folder_name', authMiddleware, FolderController.getFolderByName);

/**
 * @swagger
 * /folders:
 *   post:
 *     summary: Cria uma nova pasta
 *     description: Cria uma nova pasta com base nos dados fornecidos no corpo da requisição.
 *     tags:
 *       - Folder
 *     operationId: create_folder
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/FolderCreate"
 *     responses:
 *       201:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Folder"
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

router.post('/', authMiddleware, FolderController.createFolder);

/**
 * @swagger
 * /folders/{folder_id}:
 *   parameters:
 *     - name: folder_id
 *       in: path
 *       required: true
 *       description: ID da pasta que será atualizada
 *       schema:
 *         type: string
 *   put:
 *     summary: Atualiza pasta
 *     description: Atualiza as informações da pasta desejada
 *     tags:
 *       - Folder
 *     operationId: update_folder
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/FolderUpdate"
 *     security:
 *       - jwt: []
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Folder"
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

router.put('/:folder_id', authMiddleware, FolderController.updateFolder);

/**
 * @swagger
 * /folders/{folder_id}:
 *   parameters:
 *     - name: folder_id
 *       in: path
 *       required: true
 *       description: ID da pasta que será deletada
 *       schema:
 *         type: string
 *   delete:
 *     summary: Remove pasta
 *     description: Apaga pasta, lembrando que a pasta default não pode ser apagada
 *     tags:
 *       - Folder
 *     operationId: delete_folder
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

router.delete('/:folder_id', authMiddleware, FolderController.deleteFolder);

export default router;