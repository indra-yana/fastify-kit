/* eslint-disable no-inner-declarations */
/* eslint-disable no-use-before-define */
/* eslint-disable comma-dangle */
const { existsSync, writeSync, readSync, openSync } = require('fs')
const path = require('path');
const readline = require('readline');
const shell = require('shelljs');

const {
	generateApiModTemplate,
	generateServiceModTemplate,
	generateValidatorModTemplate,
	generateIndexModTemplate
} = require('./module-generator');

const baseDir = path.dirname(__dirname);
shell.config.silent = true;

const getDirectory = (type) => {
	let directory = '';

	switch (type) {
		case 'module':
			directory = path.join(baseDir, 'src/module');
			break;
		default:
			directory = '/'
			break;
	}

	return directory;
}

const generate = (_dir, name, type = 'module') => {
	const $dir = _dir;

	try {
		const generateDir = path.join($dir, name);
		if (existsSync(generateDir)) {
			shell.echo(`The ${type} '${name}' already exist!`);

			const rl = readline.createInterface({
				input: process.stdin,
				output: process.stdout,
			});

			let isOverwrite = false;
			rl.question('Overwrite? (Y/N): ', function (input) {
				isOverwrite = input.toLowerCase() === 'y';
				rl.close();

				if (isOverwrite) {
					generateCommand();
				} else {
					shell.echo(`The existing module is safe!`);
				}
			});
		} else {
			generateCommand();
		}

		function generateCommand() {
			shell.mkdir(generateDir);

			switch (type) {
				case 'module':
					generateIndexModTemplate($dir, name);
					generateApiModTemplate($dir, name);
					generateServiceModTemplate($dir, name);
					generateValidatorModTemplate($dir, name);
					break;
				default:
					shell.echo('Command type is invalid');
					break;
			}

			shell.echo(`The ${type} '${name}' created!`);
		}

		// create test directory
		// shell.mkdir(path.join($dir, name, '__tests__')); 
	} catch (error) {
		shell.echo(error);
		shell.exit(1);
	}
};

module.exports = (args) => {
	const cmd = {
		module: null,
	};

	if (args.module) {
		cmd.module = args.module;
	} else if (args.mod) {
		cmd.module = args.mod;
	} else if (args.m) {
		cmd.module = args.m;
	}

	if (cmd.module && typeof cmd.module === 'string') {
		generate(getDirectory('module'), cmd.module, 'module');
	} else {
		shell.echo('Package name is invalid');
	}
};