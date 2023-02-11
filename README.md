# Fastify Starter Kit

a REST API project with Fastify JS Starter Kit. 
This project is purposed for building your awesome app that needed a starting point with basic fitur that listed bellow:


# Fitur
- Basic Authentication
    - Login
    - Register
    - Forgot Password
    - Verify Account
    - Password Confirmation
- User Management (CRUD)
- Role Management (CRUD)

# Dependencies
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

# How to Install

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

# API SPEC

### Base URL :

```sh
http://localhost:3000
```

### General Header :

```json
{
    "Content-Type": "application/json",
    "Accept": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    "Accept-Language": "id",        // id|en
    "Authorization": "bearer_token" // if authenticated
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