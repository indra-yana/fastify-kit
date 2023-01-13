const {
    ACCESS_TOKEN_KEY,
    REFRESH_TOKEN_KEY,
    ACCESS_TOKEN_AGE = '1d',
    REFRESH_TOKEN_AGE = '30d',
} = process.env;

module.exports = {
    jwt: {
        default: {
            secret: ACCESS_TOKEN_KEY,
            sign: {
                expiresIn: ACCESS_TOKEN_AGE,
            },
        },

        access_token: {
            // key: ACCESS_TOKEN_KEY,
            expiresIn: ACCESS_TOKEN_AGE,
        },

        refresh_token: {
            // key: REFRESH_TOKEN_KEY,
            expiresIn: REFRESH_TOKEN_AGE,
        },
    },
};