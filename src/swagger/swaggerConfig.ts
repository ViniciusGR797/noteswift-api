import swaggerJSDoc from 'swagger-jsdoc';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API RESTful - NoteSwift',
      version: '1.0.0',
      description: "Este projeto consiste na construção de uma **API RESTful usando Node.js e TypeScript**, com integração ao banco de dados **MongoDB**, " +
        "para criar um sistema que permita aos usuários gerenciar **anotações online**. As anotações serão organizadas em pastas e " +
        "também terão uma lixeira para recuperação de itens excluídos. Através de uma interface amigável, os usuários poderão " +
        "**criar, visualizar, editar e excluir anotações**, além de **restaurar itens previamente descartados**.\n\n" +

        "A API fornecerá aos usuários todas as funcionalidades necessárias para realizar operações básicas em suas anotações, " +
        "como criar, visualizar, editar e excluir. Além disso, ela será projetada para garantir a segurança e a privacidade dos " +
        "dados do usuário, implementando práticas adequadas de autenticação e autorização.\n\n" +

        "O uso do **Node.js e TypeScript** permitirá uma **fácil implementação dos endpoints da API**, bem como a manutenção do código " +
        "com tipagem estática, tornando o processo de desenvolvimento mais seguro e organizado. Utilizaremos o **MongoDB** como nosso " +
        "banco de dados para **armazenar as anotações e as informações relacionadas a pastas e lixeira**.\n\n" +

        "Para a **documentação da API**, faremos uso do **Swagger UI** através do pacote **'swagger-ui-express'** em conjunto com o **'swagger-jsdoc'**, " +
        "o que permitirá gerar automaticamente a documentação da API a partir das anotações do código-fonte. Isso tornará mais fácil " +
        "para os desenvolvedores e usuários entenderem e interagirem com os endpoints da API.\n\n" +

        "Para gerenciar as dependências do projeto, utilizaremos o **Yarn** como gerenciador de pacotes, garantindo uma instalação mais " +
        "rápida e confiável das bibliotecas necessárias para o desenvolvimento.\n\n" +

        "Em suma, o objetivo deste software é oferecer aos usuários uma **maneira prática e segura de gerenciar suas anotações online**, " +
        "proporcionando organização através de pastas e a capacidade de recuperar itens excluídos da lixeira. Com uma API RESTful " +
        "completa e bem documentada, esperamos fornecer uma solução confiável e eficiente para atender às necessidades de " +
        "gerenciamento de anotações de nossos usuários.",
      license: {
        name: 'MIT License',
        url: 'https://github.com/ViniciusGR797/noteswift-api/blob/main/LICENSE',
      },
    },
    components: {
      securitySchemes: {
        jwt: {
          type: "apiKey",
          in: "header",
          name: "Authorization",
          description: "Para autenticar, coloque o token JWT no formato **Bearer _token_**.",
        },
      },
    },
    security: [
      {
        jwt: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/models/*.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
