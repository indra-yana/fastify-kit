const routes = (fastify, { handler, meta }) => [
    {
        method: 'GET',
        url: '/user/show/:id',
        preHandler: [fastify.auth([fastify.jwtAuthStrategy])],
        handler: async (request, reply) => handler.showHandler(request, reply),
    },
    {
        method: 'GET',
        url: '/user/list',
        handler: async (request, reply) => handler.listHandler(request, reply),
    },
    {
        method: 'POST',
        url: '/user/create',
        preHandler: [
            fastify.upload.any(),
        ],
        handler: async (request, reply) => handler.createHandler(request, reply),
    },
    {
        method: 'PUT',
        url: '/user/update',
        preHandler: [
            fastify.auth([fastify.jwtAuthStrategy]),
            fastify.upload.any(),
        ],
        handler: async (request, reply) => handler.updateHandler(request, reply),
    },
    {
        method: 'DELETE',
        url: '/user/delete',
        preHandler: [fastify.auth([fastify.jwtAuthStrategy])],
        handler: async (request, reply) => handler.deleteHandler(request, reply),
    },
];

module.exports = routes;