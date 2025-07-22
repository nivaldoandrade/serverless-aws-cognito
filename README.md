# Serverless API Auth com AWS Cognito

Esta API é uma aplicação serverless que demonstra a implementação de autenticação de usuários, envio de e-mails e integração com o Cognito da AWS. Utiliza Node.js, TypeScript e é hospedada na AWS Lambda via framework Serverless. A API possui endpoints para autenticação, cadastro, recuperação de senha, validações e envio de email de confirmação e de recuperação de senha.

## **Requisitos**

- [Node.js 20 ou superior](https://nodejs.org/en/)
- [Configuração do Serverless](#configuração-do-serverless)
- [Configuração das Credenciais AWS](#configuração-das-credenciais-aws)

#### Configuração do Serverless

1. Instale o Serverless via NPM:

   ```bash
   npm i serverless -g
   ```

   Para mais informações: [Installation](https://www.serverless.com/framework/docs/getting-started#installation).

2. Faça login no Serverless:

   Crie uma conta no Serverless e faça login com o comando abaixo:

   ```bash
   sls login
   ```

   Para mais informações: [Signing In](https://www.serverless.com/framework/docs/getting-started#signing-in).

#### Configuração das Credenciais AWS

Para mais informações: [AWS Credentials](https://www.serverless.com/framework/docs/providers/aws/guide/credentials#aws-credentials)

##### **Opção 1: AWS CLI (Recomendado)**

1. Faça o download e instalação: [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html#getting-started-install-instructions).

2. Crie um: [IAM user](https://docs.aws.amazon.com/cli/latest/userguide/cli-authentication-user.html#cli-authentication-user-create)

   **OBS:** No **Attach existing policies directly** e procure e adicione a política **AdministratorAccess**.

3. Configure AWS CLI:

   ```bash
   aws configure
   ```

   Preencha com:
   - AWS Access Key ID
   - AWS Secret Access Key
   - Default region: `us-east-1`
   - Default output format: `json`

   Para mais informações: [Configure the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-authentication-user.html#cli-authentication-user-configure.title)

##### **Opção 2: Variáveis de Ambiente**

1. Crie um: [IAM user](https://docs.aws.amazon.com/cli/latest/userguide/cli-authentication-user.html#cli-authentication-user-create)

   **OBS:** No **Attach existing policies directly** e procure e adicione a política **AdministratorAccess**.

2. Renomeie o arquivo `.env.example` para `.env` e preencha com os valores de `AWS_ACCESS_KEY_ID` e `AWS_SECRET_ACCESS_KEY`.

## Passo a passo

1. Clone o repositório:

   ```bash
   git clone https://github.com/nivaldoandrade/serverless-aws-cognito.git
   ```

2. Instale as dependências:

   ```bash
     yarn
     # ou
     npm install
   ```

3. Configure as variáveis de ambiente:

   Se caso não estiver utilizando a [AWS CLI](#opção-1-aws-clirecomendado) verifique a seção [Opção 2: Variáveis de Ambiente](#opção-2-variáveis-de-ambiente).

4. Realize o deploy na AWS:

   ```bash
   serverless deploy
   # ou
   sls deploy
   ```

   Se tudo ocorrer bem, o ouput esperado será:

   ```plaintext
   endpoints:
   POST - https://xxx.execute-api.xxx.amazonaws.com/auth/sign-up
   POST - https://xxx.execute-api.xxx.amazonaws.com/auth/confirm-signup
   ...
   ```

   O endpoint base da API será: `https://xxx.execute-api.xxx.amazonaws.com`

## Endpoints

| Método | Url                           | Descrição                         | Exemplo do request body válido                                      |
| ------ | ----------------------------- | --------------------------------- | ------------------------------------------------------------------- |
| POST   | /auth/sign-up                 | Criar um novo usuário             | [JSON](#sign-up---authsign-up)                                      |
| POST   | /auth/confirm-signup          | Confirmar código de cadastro      | [JSON](#confirm-sign-up---authconfirm-signup)                       |
| POST   | /auth/sign-in                 | Autenticar um usuário             | [JSON](#sign-in---authsign-in)                                      |
| POST   | /auth/refresh-token           | Obter novo par de tokens          | [JSON](#refresh-token---authrefresh-token)                          |
| GET    | /me                           | Obter um usuário pelo accessToken | [**HEADER**](#me---me)                                              |
| POST   | /auth/forgot-password         | Enviar e-mail de recuperação      | [JSON](#forgot-password---authforgot-password)                      |
| POST   | /auth/confirm-forgot-password | Redefinir senha                   | [JSON](#confirmation-forgot-password---authconfirm-forgot-password) |

### Exemplo do request body válido

##### Sign Up -> /auth/sign-up

```json
{
  "email": "john.doe@email.com",
  "password": "12345678"
}
```

##### Confirm Sign Up -> /auth/confirm-signup

```json
{
  "email": "john.doe@email.com",
  "code": "123456"
}
```

##### Sign In -> /auth/sign-in

```json
{
  "email": "john.doe@email.com",
  "password": "12345678"
}
```

##### Refresh Token -> /auth/refresh-token

```json
{
  "refreshToken": "{{refreshToken}}"
}
```

##### Me -> /me

Adicionar o Header:

```
authorization: Bearer {{accessToken}}
```

##### Forgot Password -> /auth/forgot-password

```json
{
  "email": "john.doe@email.com"
}
```

##### Confirmation Forgot Password -> /auth/confirm-forgot-password

```json
{
  "email": "john.doe@email.com",
  "code": "123456",
  "newPassword": "12341234"
}
```
