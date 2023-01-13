const routes = (fastify, { handler, meta }) => [
    {
        method: 'GET',
        url: '/api/v1/role/show/:id',
        preHandler: [fastify.auth([fastify.jwtAuthStrategy])],
        handler: async (request, reply) => handler.showHandler(request, reply),
    },
    {
        method: 'GET',
        url: '/api/v1/role/list',
        handler: async (request, reply) => handler.listHandler(request, reply),
    },
    {
        method: 'POST',
        url: '/api/v1/role/create',
        handler: async (request, reply) => handler.createHandler(request, reply),
    },
    {
        method: 'PUT',
        url: '/api/v1/role/update',
        preHandler: [fastify.auth([fastify.jwtAuthStrategy])],
        handler: async (request, reply) => handler.updateHandler(request, reply),
    },
    {
        method: 'DELETE',
        url: '/api/v1/role/delete',
        preHandler: [fastify.auth([fastify.jwtAuthStrategy])],
        handler: async (request, reply) => handler.deleteHandler(request, reply),
    },
];

module.exports = routes;