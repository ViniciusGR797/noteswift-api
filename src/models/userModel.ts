import { IsString, IsEmail, Matches, ValidateNested, IsNotEmpty, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ObjectId } from "mongodb";
import { Folder } from './folderModel';
import { UserConfig } from './userConfigModel';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - _id
 *         - name
 *         - email
 *         - pwd
 *         - library
 *         - config
 *       properties:
 *         _id:
 *           type: ObjectId
 *           description: Identificador único do usuário
 *           example: "6123456789abcdef01234567"
 *         name:
 *           type: string
 *           description: Nome do usuário
 *           example: "Nome do usuário"
 *         email:
 *           type: string
 *           description: Email do usuário
 *           example: "email@example.com"
 *         pwd:
 *           type: string
 *           description: Senha do usuário
 *           example: "senha"
 *         library:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/Folder"
 *         config:
 *           $ref: "#/components/schemas/UserConfig"
 */

class User {
  @IsNotEmpty({ message: 'O campo _id é obrigatório.' })
  _id: ObjectId;

  @IsString({ message: 'O campo name deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo name é obrigatório.' })
  name: string;

  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'O campo email é obrigatório.' })
  email: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Senha fraca. A senha deve ter no mínimo 8 caracteres, incluindo pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial (@ $ ! % * ? &)',
  })
  @IsNotEmpty({ message: 'O campo pwd é obrigatório.' })
  pwd: string;

  @ValidateNested({ each: true })
  @Type(() => Folder)
  @ArrayNotEmpty({ message: 'O campo library deve conter pelo menos um elemento.' })
  library: Folder[];

  @ValidateNested()
  @Type(() => UserConfig)
  @IsNotEmpty({ message: 'O campo config é obrigatório.' })
  config: UserConfig;

  constructor(payload: User) {
    this._id = payload._id;
    this.name = payload.name ? payload.name.trim() : '';
    this.email = payload.email ? payload.email.trim().toLowerCase() : '';
    this.pwd = payload.pwd ? payload.pwd.trim() :  '';
    this.library = payload.library;
    this.config = payload.config;
  }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UpsertUser:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - pwd
 *       properties:
 *         name:
 *           type: string
 *           description: Nome do usuário
 *           example: "Nome do usuário"
 *         email:
 *           type: string
 *           description: Email do usuário
 *           example: "email@example.com"
 *         pwd:
 *           type: string
 *           description: Senha do usuário
 *           example: "senha"
 */

class UpsertUser {
  @IsString({ message: 'O campo name deve ser uma string.' })
  @IsNotEmpty({ message: 'O campo name é obrigatório.' })
  name: string;

  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'O campo email é obrigatório.' })
  email: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Senha fraca. A senha deve ter no mínimo 8 caracteres, incluindo pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial (@ $ ! % * ? &)',
  })
  @IsNotEmpty({ message: 'O campo pwd é obrigatório.' })
  pwd: string;

  constructor(payload: User) {
    this.name = payload.name ? payload.name.trim() : '';
    this.email = payload.email ? payload.email.trim().toLowerCase() : '';
    this.pwd = payload.pwd ? payload.pwd.trim() :  '';
  }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - pwd
 *       properties:
 *         email:
 *           type: string
 *           description: Email do usuário
 *           example: "email@example.com"
 *         pwd:
 *           type: string
 *           description: Senha do usuário
 *           example: "senha"
 */

class UserLogin {
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'O campo email é obrigatório.' })
  email: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'Senha fraca. A senha deve ter no mínimo 8 caracteres, incluindo pelo menos uma letra maiúscula, uma letra minúscula, um número e um caractere especial (@ $ ! % * ? &)',
  })
  @IsNotEmpty({ message: 'O campo pwd é obrigatório.' })
  pwd: string;

  constructor(payload: User) {
    this.email = payload.email ? payload.email.trim().toLowerCase() : '';
    this.pwd = payload.pwd ? payload.pwd.trim() :  '';
  }
}

export { User, UpsertUser, UserLogin };