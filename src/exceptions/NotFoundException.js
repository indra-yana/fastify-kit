const ClientException = require('./ClientException');

class NotFoundException extends ClientException {
    
    constructor({ message = 'The data or resource can\'t be found', error = [], tags = [] }) {
        super(message, 404);
        this.name = 'Notfound Exception';
        this.error = error;
        this.tags = tags;

        this.saveLog();
    }

}

module.exports = NotFoundException;