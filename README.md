# API - Onda Tec

## Descrição
Esta API foi desenvolvida para auxiliar na educação de pessoas carentes, fornecendo recursos e ferramentas para promover a igualdade e o acesso à educação de qualidade. A API permite o gerenciamento de usuários, como alunos e professores, e facilita a autenticação e autorização de acesso.

## Endpoints

### Registro de Usuário (Aluno)
- **URL:** `/register/aluno`
- **Método:** `POST`
- **Descrição:** Registra um novo aluno no sistema.
- **Body Exemplo:**
  ```json
  {
    "username": "Labelle Candido",
    "password": "010203",
    "email": "labelle@gmail.com",
    "cpf": "0122334455",
    "nvl_aluno": "2"
  }
#

  ### Registro de Usuário (Professor)
- **URL:** `/register/professor`
- **Método:** `POST`
- **Descrição:** Registra um novo professor no sistema.
- **Body Exemplo:**
  ```json
  {
    "username": "Henning Summer",
    "password": "soufera",
    "email": "hemming@gmail.com",
    "cpf": "0122334455",
    "materia_prof": "FullStack"
  }
#

### Listar Todos os Alunos
- **URL:** `/`
- **Método:** `GET`
- **Descrição:** Retorna todos os alunos cadastrados.

### Obter Aluno por ID
- **URL:** `/:id`
- **Método:** `GET`
- **Descrição:** Retorna os detalhes de um aluno específico por ID.

### Atualizar Aluno
- **URL:** `/:id`
- **Método:** `PUT`
- **Descrição:** Atualiza as informações de um aluno existente.
- **Body Exemplo:**
  ```json
  {
  "username": "novoNome",
  "password": "novaSenha",
  "email": "novoemail@gmail.com",
  "cpf": "00112234",
  "nvl_aluno": "3"
  }
# 
### Deletar Aluno
- **URL:** `/:id`
- **Método:** `DELETE`
- **Descrição:** Deleta um aluno do sistema.

## Autenticação

A API utiliza tokens JWT (JSON Web Tokens) para autenticação e autorização dos usuários. Este método garante que apenas usuários autenticados possam acessar certos endpoints protegidos. Abaixo está uma explicação detalhada sobre o processo de autenticação:

#### Login de Usuário
- **URL:** `/login`
- **Método:** `POST`
- **Descrição:** Autentica o usuário e retorna um token JWT.
- **Body Exemplo:**
  ```json
  {
    "username": "usuario_exemplo",
    "password": "senha_exemplo"
  }
## Autenticação

A API utiliza tokens JWT (JSON Web Tokens) para autenticação e autorização dos usuários. Este método garante que apenas usuários autenticados possam acessar certos endpoints protegidos. Abaixo está uma explicação detalhada sobre o processo de autenticação:

#### Login de Usuário
- **URL:** `/login`
- **Método:** `POST`
- **Descrição:** Autentica o usuário e retorna um token JWT.
- **Body Exemplo:**
  ```json
  {
    "username": "usuario_exemplo",
    "password": "senha_exemplo"
  }
## Funcionamento:
- O usuário envia seu nome de usuário e senha.
- O servidor busca o usuário no banco de dados.
- Se o usuário for encontrado, a senha enviada é comparada com a senha armazenada no banco de dados usando bcrypt.
- Se as senhas coincidirem, um token JWT é gerado e enviado ao usuário. Esse token inclui a identificação do usuário e expira em 15 minutos.

## Instalação

1. Clone o repositório.
2. Instale as dependências:
   ```sh
   npm install
   ````
3. Inicie o servidor:
   ```sh
   npm start
   ````
#
# Tecnologias Utilizadas
- Node.js
- Express.js
- SQLite
- bcrypt
- jsonwebtoken