# NoteSwift RESTful API

<div align="center">
  <img src="https://img.shields.io/static/v1?label=javascript&message=language&color=yellow&style=for-the-badge&logo=javascript"/>
  <img src="https://img.shields.io/static/v1?label=node&message=environment&color=orange&style=for-the-badge&logo=node.js"/>  
  <img src="https://img.shields.io/static/v1?label=express&message=framework&color=green&style=for-the-badge&logo=express"/>  
  <img src="https://img.shields.io/static/v1?label=typescript&message=superset&color=blue&style=for-the-badge&logo=typescript"/>
  <img src="https://img.shields.io/static/v1?label=mongodb&message=database&color=green&style=for-the-badge&logo=mongodb"/>
  <img src="https://img.shields.io/static/v1?label=docker&message=container&color=blue&style=for-the-badge&logo=docker"/>
  <img src="http://img.shields.io/static/v1?label=License&message=MIT&color=green&style=for-the-badge"/>
  <img alt="GitHub repo size" src="https://img.shields.io/github/repo-size/ViniciusGR797/noteswift-api?style=for-the-badge">
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/ViniciusGR797/noteswift-api?style=for-the-badge">
  <img alt="GitHub forks" src="https://img.shields.io/github/forks/ViniciusGR797/noteswift-api?style=for-the-badge">
  <img alt="Bitbucket open issues" src="https://img.shields.io/bitbucket/issues/ViniciusGR797/noteswift-api?style=for-the-badge">
  <img alt="Bitbucket open pull request" src="https://img.shields.io/bitbucket/pr-raw/ViniciusGR797/noteswift-api?style=for-the-badge">
  <img src="http://img.shields.io/static/v1?label=STATUS&message=Development&color=GREEN&style=for-the-badge"/>
</div>

<div align="center">
  <img src="https://cdn.discordapp.com/attachments/1089358473483006105/1139671477684277309/logo_NoteSwift.png?ex=66106cc6&is=65fdf7c6&hm=bb2b64001c59e09c7455d00750278284279c906131588d866addebcc3b7839cd&" alt="logo NoteSwift">
</div>

> O software proposto tem como objetivo controlar anotações online, com pastas e lixeira. Organize de forma intuitiva, recupere notas excluídas e tenha acesso rápido às informações importantes. Simplifique seu gerenciamento de notas com praticidade e eficiência.

## Tópicos 

:small_blue_diamond: [🏡 Execução localmente](#-execução-localmente)

:small_blue_diamond: [🐳 Execução com Docker](#-execução-com-docker)

:small_blue_diamond: [📃 Executando os Testes Unitários](#-executando-os-testes-unitários)

:small_blue_diamond: [⚙ Executando os Testes Automatizados](#-executando-os-testes-automatizados)

:small_blue_diamond: [📭 Postman e Testes Funcionais](#-postman-e-testes-funcionais)

:small_blue_diamond: [🛠 Construído com](#-construído-com)

:small_blue_diamond: [📫 Documentação](#-documentação)

:small_blue_diamond: [🙌 Reconhecimento](#-reconhecimento)

:small_blue_diamond: [📄 Licença](#-licença)

## 🏡 Execução localmente

Certifique-se de ter o [Node.js](https://nodejs.org/en) instalado em sua máquina antes de prosseguir com essas etapas.

Siga as etapas abaixo para executar o projeto localmente em sua máquina:

* Clone esse repositório na sua máquina, colocando a respectiva URL do repositório:
```
git clone https://github.com/ViniciusGR797/noteswift-api.git
```

* Navegar para o diretório do projeto clonado:
```
cd noteswift-api
```

* Crie um arquivo chamado **_.env_** e configure corretamente as variáveis de ambiente necessárias. Você pode usar o arquivo **_.env.sample_** como referência.

* Instale o gerenciador de pacotes Yarn:
```
npm install -g yarn
```

* Agora, instale todas as dependências listadas no arquivo 'package.json', executando o seguinte comando:
```
yarn install
```

* Com as dependências instaladas, execute o seguinte comando para iniciar o servidor:
```
yarn start
```

* Após a execução, você poderá acessar a API por meio da porta local fornecida no terminal, por exemplo: `http://localhost:3000/api-docs/`.

* Se desejar parar a execução da aplicação, pressione `Ctrl + C` no terminal, a execução do projeto será encerrada.

## 🐳 Execução com Docker

Antes de executar o projeto com Docker, certifique-se de ter o [Docker](https://www.docker.com/get-started) e o [Docker Compose](https://docs.docker.com/compose/install/) instalados em sua máquina. 

Para executar o projeto usando Docker, siga as etapas abaixo:

* Crie um arquivo chamado **_.env_** e configure corretamente as variáveis de ambiente necessárias. Você pode usar o arquivo **_.env.sample_** como referência.

* No terminal, navegue até a pasta raiz do projeto e execute o seguinte comando:
```
docker-compose up --build
```
Isso iniciará os contêineres Docker necessários para executar o projeto.

Para parar a execução dos contêineres, pressione `Ctrl + C` no terminal. Isso interromperá a execução dos contêineres e liberará os recursos utilizados.

Caso deseje executar novamente o projeto usando o Docker, basta seguir novamente as etapas anteriores, garantindo que você tenha o arquivo **_.env_** configurado corretamente e execute o comando `docker-compose up` no terminal.

## 📃 Executando os Testes Unitários

## ⚙ Executando os Testes Automatizados

## 📭 Postman e Testes Funcionais

Neste projeto, incluímos um [arquivo Postman]() contendo uma coleção de requisições e testes funcionais para a API. Você pode importar facilmente esse arquivo no Postman para testar e interagir com a API.

Para importar a coleção do Postman e executar os testes, siga as etapas abaixo:

* Faça o download e instale o [Postman](https://www.postman.com/downloads/) em sua máquina.

* Após a instalação, abra o Postman.

* No topo da interface do Postman, clique em `File` e, em seguida, selecione `Import`.

* Na janela de importação, clique na guia `File` e escolha o arquivo Postman fornecido neste projeto.

* Clique em `Import` para importar a coleção no Postman.

* Agora você pode executar os testes funcionais na API usando a coleção importada. Certifique-se de que o servidor esteja em execução antes de executar os testes.

Os testes funcionais fornecidos na coleção do Postman são projetados para validar o comportamento da API.

## 🛠 Construído com

* [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript): Linguagem de programação de script amplamente usada para desenvolvimento web.
* [Node.js](https://nodejs.org/en): Plataforma de tempo de execução de JavaScript baseada no V8 do Google.
* [Express.js](https://expressjs.com/): Framework web rápido e minimalista para Node.js.
* [TypeScript](https://www.typescriptlang.org/): Superset do JavaScript que adiciona tipos estáticos e outras características ao código.
* [MongoDB](https://www.mongodb.com/): Banco de dados NoSQL altamente escalável e flexível.
* [Swagger UI](https://swagger.io/tools/swagger-ui/): Interface de usuário interativa para explorar e testar APIs RESTful.
* [Docker](https://www.docker.com/): Plataforma de contêineres que facilita a criação e implantação de aplicativos em ambientes isolados.

Essas são as principais tecnologias utilizadas para construir esta API RESTful. O JavaScript e TypeScript, onde o primeiro proporciona a base e o último adiciona uma camada de tipos sólidos. Node.js fornece o ambiente de execução, enquanto o Express.js agiliza o desenvolvimento da web. O MongoDB é utilizado como banco de dados para armazenar e recuperar os dados da aplicação de forma eficiente. O Swagger UI fornece uma interface amigável para explorar e testar a API. O Docker é utilizado para empacotar a aplicação e suas dependências em contêineres, facilitando a implantação e a portabilidade.

## 📫 Documentação

A documentação do projeto e da API está disponível nos seguintes links:

- [Documentação do Projeto](): Este documento fornece uma visão geral do projeto NoteSwift, incluindo sua finalidade, escopo e funcionalidades.
- [Documentação do Swagger Json](https://github.com/ViniciusGR797/noteswift-api/blob/main/src/swagger/swagger.json) e [Yaml](https://github.com/ViniciusGR797/noteswift-api/blob/main/src/swagger/swagger.yaml): A documentação do Swagger descreve os endpoints e os modelos da API de forma detalhada.

Após executar a aplicação, você pode acessar o Swagger UI pela rota `/api-docs` e `/docs`, onde encontrará uma interface interativa para explorar e testar a API.

Certifique-se de revisar esses documentos para obter mais informações sobre o projeto NoteSwift e para entender como interagir com a API usando o Swagger UI. Eles fornecerão detalhes importantes sobre o escopo, os recursos e os endpoints disponíveis na aplicação.

## 🙌 Reconhecimento

Gostaria de aproveitar este espaço para expressar minha sincera gratidão à jornada que percorri na realização deste projeto:

<div align="center">
  <table>
    <tr>
      <td align="center">
        <a href="https://github.com/ViniciusGR797">
          <img src="https://avatars.githubusercontent.com/u/106624536?v=4" width="100px;" alt="Foto do Vinícius"/><br>
          <sub>
            <b>Vinícius Gomes Ribeiro</b>
          </sub>
        </a>
      </td>
    </tr>
  </table>
</div>

Embora tenha sido uma jornada individual, esta realização não teria sido possível sem a dedicação, esforço e comprometimento. Cada etapa deste projeto foi impulsionada pelo empenho e habilidades que empreguei. Agradeço profundamente por esta oportunidade de crescimento e aprendizado.

## 📝 Licença

Este projeto está licenciado sob os termos da [Licença](LICENSE). Por favor, consulte o arquivo LICENSE para obter mais detalhes.

A licença escolhida para o projeto é um elemento importante para estabelecer os direitos de uso, distribuição e modificações do código-fonte. É essencial que todos os usuários, colaboradores e interessados revisem e compreendam os termos e condições da licença antes de utilizar ou contribuir para o projeto.

Recomenda-se que você leia atentamente o arquivo LICENSE para garantir o cumprimento das regras estabelecidas e o uso adequado do código fornecido neste repositório.

[⬆ Voltar ao topo](#noteswift-restful-api)
