module.exports = {

    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',

    origin: process.env.ORIGINS?.split(',') || 'localhost',

    allowedHeaders: null,

    exposedHeaders: null,

    maxAge: null,

    credentials: true,

};