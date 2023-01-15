const {
    generateApiModTemplate,
    generateServiceModTemplate,
    generateValidatorModTemplate,
    generateIndexModTemplate,
} = require('./template');

function generateModule(dir, name) {
    generateIndexModTemplate(dir, name);
    generateApiModTemplate(dir, name);
    generateServiceModTemplate(dir, name);
    generateValidatorModTemplate(dir, name);
}

module.exports = generateModule