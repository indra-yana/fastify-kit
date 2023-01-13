const BaseService = require('../BaseService');
const InvariantException = require('../../exceptions/InvariantException');
const fs = require('fs');
const path = require('path');
const { nanoid } = require('nanoid');
const { pipeline } = require('stream');

class StorageService extends BaseService {

    constructor(rootFolder, { fastify }) {
        super(fastify);
        this._rootFolder = rootFolder;
        this.createFolder(rootFolder);
    }

    /**
     * Write a file into destination folder
     * 
     * @param {*} data 
     * @param {string} destination
     * @returns {object}
     */
    writeFile(data, destination = '') {
        const { path: file, originalname: name } = data;
        const fileName = this.createFileName(name);
        const folder = `${this._rootFolder}/${destination}`;
        if (destination) {
            this.createFolder(folder);
        }

        const readFileStream = fs.createReadStream(`${file}`);
        const writeFileStream = fs.createWriteStream(`${folder}/${fileName}`);
        pipeline(readFileStream, writeFileStream, (err) => {
            // Delete temporary file
            this.rmFile(`${file}`);
            
            if (err) {
                throw new InvariantException({ message: `${this._t('message.uploaded_fail')}: ${err.message}`, tags: ['StorageService', '@writeFile'] });
            }
        });

        return fileName;
    }

    /**
     * Create a folder to saving file
     * 
     * @param {*} folder 
     * @returns {void}
     */
    createFolder(folder) {
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
    }

    /**
     * Create a unique file name
     * 
     * @param {string} fileName 
     * @returns {string}
     */
    createFileName(fileName) {
        return `${+new Date()}-${nanoid(16)}${this.getFileExtension(fileName)}`;
    }

    /**
     * Get extension from a file
     * 
     * @param {string} fileName 
     * @returns {string} 
     */
    getFileExtension(fileName) {
        return path.extname(fileName);
    }

    /**
     * Get extension from a file
     * 
     * @param {string} fileName 
     * @returns {string} 
     */
    rmFile(fileName) {
        fs.rmSync(fileName, {
            force: true,
        });
    }

}

module.exports = StorageService;