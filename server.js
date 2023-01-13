require('dotenv').config();

const {
	APP_PORT = 3000,
} = process.env;

const App = require('./src/App');

const startApp = async () => {
	const start = performance.now();
	const app = await App();

	app.listen({ port: APP_PORT }, (error, address) => {
		const end = performance.now();
		console.log(
			'\n',
			''.padStart(1),
			'\x1b[36m',
			'🚀🚀🚀',
			`Backend Server running at: ${address} in ${Math.round(end - start)} ms`,
			'\x1b[0m',
		);

		if (error) {
			app.log.error(error);
			process.exit(1);
		}
	});
};

startApp();