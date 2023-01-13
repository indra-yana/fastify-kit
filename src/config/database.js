const {
    DB_CLIENT,
    DB_CONNECTION,
    DB_HOST = '127.0.0.1',
    DB_PORT = '3306',
    DB_USERNAME,
    DB_PASSWORD,
    DB_DATABASE,
} = process.env;

module.exports = {
    knex: {
        client: DB_CLIENT,
        connectionString: DB_CONNECTION,
        connection: DB_CONNECTION || {
            host: DB_HOST,
            port: DB_PORT,
            user: DB_USERNAME,
            password: DB_PASSWORD,
            database: DB_DATABASE,
        },
    },

    mysql: {
        connectionString: DB_CONNECTION,
        connection: {
            host: DB_HOST,
            port: DB_PORT,
            user: DB_USERNAME,
            password: DB_PASSWORD,
            database: DB_DATABASE,
        },
    },
};