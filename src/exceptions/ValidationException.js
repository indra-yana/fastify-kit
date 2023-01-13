const ClientException = require('./ClientException');

class ValidationException extends ClientException {

    constructor({ message = 'Validation Failed', error = [], tags = [] }) {
        super(message, 422);
        this.name = 'Validation Exception';
        this.error = error;
        this.tags = tags;

        this.saveLog();
    }

}

module.exports = ValidationException;