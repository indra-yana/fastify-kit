const ClientException = require('./ClientException');

class InvariantException extends ClientException {
    
    constructor({ message = 'Invariant Exception', error = [], tags = [] }) {
        super(message);
        this.name = 'Invariant Exception';
        this.error = error;
        this.tags = tags;

        this.saveLog();
    }

}

module.exports = InvariantException;