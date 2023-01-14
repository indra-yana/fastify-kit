const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const joiValidationFormatOld = (errors) => {
    const errorKey = [];
    errors.map((error) => {
        return errorKey.push({
            // key: `error.${error.path.join('_')}.${error.type}`,
            field: error.path.join('_'),
            message: error.message,
        });
    });

    return errorKey;
}; 

const joiValidationFormat = (errors) => {
    const errorKey = {};
    errors.map((error) => {
        // const field = error.path.join('_');
        const field = [error.path[0]].join('_');

        if (!errorKey.hasOwnProperty(field)) {
            errorKey[field] = [error.message];
        } else {
            errorKey[field].push(error.message);
        }

        return errorKey;
    });
    
    return errorKey;
};

const ajvValidationFormat = (errors) => {
    const errorKey = [];
    errors.map((error) => {
        return errorKey.push({
            field: error.instancePath.replaceAll('/', '_').slice(1),
            message: error.message,
        });
    });

    return errorKey;
};

const filePathFormat = (fileName, folder) => {
    return fileName ? process.env.APP_UPLOAD_PREVIEW.replace(':filename', fileName).replace(':folder', folder) : null;
};

const mapUserFormat = ({
    id,
    name,
    username,
    email,
    created_at: createdAt,
    updated_at: updatedAt,
    email_verified_at: emailVerifiedAt = null,
    avatar = null,
}) => ({
    id,
    name,
    username,
    email,
    emailVerifiedAt,
    createdAt,
    updatedAt,
    avatar: filePathFormat(avatar, 'avatar'),
});

const mapFileFormat = ({
    id,
    name,
    type,
    created_at: createdAt,
    updated_at: updatedAt,
}) => ({
    id,
    name,
    type,
    createdAt,
    updatedAt,
});

const mapRoleFormat = ({
    id,
    name,
    created_at: createdAt,
    updated_at: updatedAt,
}) => ({
    id,
    name,
    createdAt,
    updatedAt,
});

const isFileExists = (filePath) => {
    try {
      fs.statSync(filePath);
    } catch (err) {
      if (err.code === 'ENOENT') return false;
    }

    return true;
};

const isFile = (filePath) => {
    let filestat;
    try {
      filestat = fs.statSync(filePath);
    } catch (err) {
      if (err.code === 'ENOENT') return false;
    }
    if (!filestat) return false;

    return filestat.isFile();
};

const isFunction = function (fn) {
    return typeof fn === 'function';
};
  
const isAsyncFunction = function (fn) {
    if (!fn) return false;
    return fn[Symbol.toStringTag] === 'AsyncFunction';
};

const isObject = (item) => {
    return item && typeof item === 'object' && !Array.isArray(item);
};

const isEmpty = (data) => {
    return Array.isArray(data) ? data.length === 0 : Object.keys(data || {}).length === 0;
}

const chunkArray = (arr, chunk) => {
    let i;
    let j;
    const tmp = [];
    for (i = 0, j = arr.length; i < j; i += chunk) {
      tmp.push(arr.slice(i, i + chunk));
    }
    return tmp;
};

const toCamelCase = (name) => {
    if (typeof name !== 'string') {
      return name;
    }
    return name.replace(/-(\w)/gi, (word, letter) => {
      return letter.toUpperCase();
    });
};

const ucfirst = (str) => {
    return str.charAt(0).toUpperCase() + str.substr(1);
};
  
const lcfirst = (str) => {
    return str.charAt(0).toLowerCase() + str.substr(1);
};

const deleteDir = (dirPath) => {
    if (fs.existsSync(dirPath)) {
        fs.readdirSync(dirPath).forEach(function (entry) {
            const entryPath = path.join(dirPath, entry);
            if (fs.lstatSync(entryPath).isDirectory()) {
                this.deleteDir(entryPath);
            } else {
                fs.unlinkSync(entryPath);
            }
        });
        
        fs.rmdirSync(dirPath);
    }
};

const objectGet = (object, pathObj) => {
    return pathObj.replace(/\[|\]\.?/g, '.')
                .split('.')
                .filter((s) => s)
                .reduce((acc, val) => acc && acc[val], object);
};

const tryOrDefault = (fn, defaultValue) => {
    try {
      return fn();
    } catch (_) {
      return defaultValue;
    }
};

const createToken = (...data) => {
    const delimiter = ':';
    return crypto
            .createHash('sha256')
            .update(process.env.ACCESS_TOKEN_KEY + delimiter + data.join(delimiter))
            .digest('hex');
};

const toTitleCase = (str) => {
	return str.replace(
		/\w\S*/g,
		function (txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		},
	);
}

module.exports = {
    joiValidationFormat,
    ajvValidationFormat,
    filePathFormat,
    mapUserFormat,
    mapFileFormat,
    mapRoleFormat,
    isFileExists,
    isFile,
    isFunction,
    isAsyncFunction,
    isObject,
    isEmpty,
    toCamelCase,
    ucfirst,
    lcfirst,
    chunkArray,
    deleteDir,
    objectGet,
    tryOrDefault,
    createToken,
    toTitleCase,
};