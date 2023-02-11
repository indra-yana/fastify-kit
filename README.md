# Fastify Starter Kit

a REST API Starter Kit Project with [Fastify JS](https://www.fastify.io). 

This project is a starter kit project with basic features listed bellow:

## Fitur

- Basic Authentication
    - Login
    - Register
    - Forgot Password
    - Verify Account
    - Password Confirmation
- User Management (CRUD)
- Role Management (CRUD)
- File Management (Upload, Download, Preview, List of User Files)

## Dependencies

- Fastify v4.11.x
- Fastify Auth
- Fastify JWT
- Potgres Database
- Objection JS (ORM)
- Knex (Query Builder and DB Manager)
- Multi Language Using [i18next](https://www.i18next.com) 
- Joi Validation
- EJS (View Templating)
- Node Mailer
- and more

## How to Install

- Clone project 
```sh 
git clone https://github.com/indra-yana/fastify-kit.git
``` 

- Install node dependency

```sh
npm install
```

- Copy & setup environment

```sh
cp .env.example .env
```

- Migrate database 
```sh
npm run db migrate:latest
```

- Run Development Server

```sh
npm run dev
```

- Module Generator 

```sh
npm run generate:module modele_name
```

## API SPEC

### Base URL :

```sh
http://localhost:3000
```

### General Header :

```json
{
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Accept-Language": "id",                // id|en
    "X-Requested-With": "XMLHttpRequest",
    "Authorization": "bearer_token"         // if authenticated
}
```

### Response :

Success Response :

```json
{
    "statusCode": 200,
    "message": "Success Message",
    "data": {
        "success_data"
    }
}
```

Error Response :

```json
{
    "statusCode": 500,
    "message": "Error Message",
    "error": {
        "error_data"
    }
}
```

## Available REST API

| Name | Method | Path |
| --- | --- | --- | 
| Login | POST | `/api/v1/auth/login` |
| Register | POST | `/api/v1/auth/register` |
| Password Request | POST | `/api/v1/auth/password/email` |
| Password Reset | POST | `/api/v1/auth/password/reset` |
| Password Confirmation | POST | `/api/v1/auth/password/confirm` |
| Verify Resend | POST | `/api/v1/auth/verify/resend` |
| Verify | PUT | `/api/v1/auth/verify` |
| Refresh Token | POST | `/api/v1/auth/refreshToken` |
| Whoami | GET | `/api/v1/auth/whoami` |
| Create User | POST | `/api/v1/user/create` |
| Update User | PUT | `/api/v1/user/update` |
| Delete User | DELETE | `/api/v1/user/delete` |
| Show User | GET | `/api/v1/user/show` |
| List User | GET | `/api/v1/user/list` |
| Create Role | POST | `/api/v1/role/create` |
| Update Role | PUT | `/api/v1/role/update` |
| Delete Role | DELETE | `/api/v1/role/delete` |
| Show Role | GET | `/api/v1/role/show` |
| List Role | GET | `/api/v1/role/list` |
| Upload | POST | `/api/v1/file/upload` |
| Download | GET | `/api/v1/file/download/file_name.jpeg/profile` |
| Preview | GET | `/api/v1/file/preview/file_name.jpeg/profile` |
| User Files | GET | `/api/v1/file/user-files` |
