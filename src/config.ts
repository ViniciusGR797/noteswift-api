import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

// Defina as configurações que você deseja usar
const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  mongodbUri: process.env.MONGODB_URI || 'mongodb+srv://<nome_do_usuario>:<senha_do_usuario>@<nome_do_cluster>.mongodb.net/<nome_do_banco_de_dados>?retryWrites=true&w=majority',
  saltRounds: parseInt(process.env.SALT_ROUNDS || '10', 10),
  jwt: {
    secretKey: process.env.JWT_SECRET_KEY || 'suaChaveSecretaAqui',
    accessTokenExpires: process.env.JWT_ACCESS_TOKEN_EXPIRES || '10h',
  },
  email: {
    host: process.env.EMAIL_HOST || 'smtp.example.com',
    port: parseInt(process.env.EMAIL_PORT || '587', 10),
    secure: Boolean(process.env.EMAIL_SECURE  || false),
    auth: {
      user: process.env.EMAIL_AUTH_USER || '',
      pass: process.env.EMAIL_AUTH_PASS || '',
    },
  },
};

export default config;
