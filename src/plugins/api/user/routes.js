const routes = (fastify, { handler, meta }) => [
    {
        method: 'GET',
        url: '/api/v1/user/show/:id',
        preHandler: [fastify.auth([fastify.jwtAuthStrategy])],
        handler: async (request, reply) => handler.showHandler(request, reply),
    },
    {
        method: 'GET',
        url: '/api/v1/user/list',
        handler: async (request, reply) => handler.listHandler(request, reply),
    },
    {
        method: 'POST',
        url: '/api/v1/user/create',
        preHandler: [
            fastify.upload.any(),
        ],
        handler: async (request, reply) => handler.createHandler(request, reply),
    },
    {
        method: 'PUT',
        url: '/api/v1/user/update',
        preHandler: [
            fastify.auth([fastify.jwtAuthStrategy]),
            fastify.upload.any(),
        ],
        handler: async (request, reply) => handler.updateHandler(request, reply),
    },
    {
        method: 'DELETE',
        url: '/api/v1/user/delete',
        preHandler: [fastify.auth([fastify.jwtAuthStrategy])],
        handler: async (request, reply) => handler.deleteHandler(request, reply),
    },
];

module.exports = routes;