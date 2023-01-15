const routes = (fastify, { handler }) => [
	{
		method: 'POST',
		url: '/file/upload',
		preHandler: [fastify.auth([fastify.jwtAuthStrategy]), fastify.upload.any()],
		handler: async (request, reply) => handler.uploadHandler(request, reply),
	},
	{
		method: 'GET',
		url: '/file/download/:fileName/:type?',
		// preHandler: [fastify.auth([fastify.jwtAuthStrategy])],
		handler: async (request, reply) => handler.downloadHandler(request, reply),
	},
	{
		method: 'GET',
		url: '/file/preview/:fileName/:type?',
		// preHandler: [fastify.auth([fastify.jwtAuthStrategy])],
		handler: async (request, reply) => handler.previewHandler(request, reply),
	},
	{
		method: 'GET',
		url: '/file/user-files/:type?',
		preHandler: [fastify.auth([fastify.jwtAuthStrategy])],
		handler: async (request, reply) => handler.userFilesHandler(request, reply),
	},
];

module.exports = routes;