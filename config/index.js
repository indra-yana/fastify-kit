/* eslint-disable no-prototype-builtins */
/* eslint-disable no-restricted-syntax */
/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
const path = require('path');
const { isFileExists, objectGet } = require('../src/utils/utils');

const config = (key, defaultValue = undefined) => {
    const keys = key.split('.');
    let cfg = {};
    if (isFileExists(path.resolve(__dirname, `${keys[0]}.js`))) {
        cfg = require(`./${keys[0]}`);
    }

    const resultConfig = objectGet(cfg, key);

    return resultConfig !== undefined 
                        ? resultConfig 
                        : (defaultValue !== undefined ? defaultValue : {});

    /* OLD Logic
    let resultConfig = {};
    let tempConfig = cfg;

    // Find the config object with given key
    for (const index of keys) {
        if (tempConfig.hasOwnProperty(index)) {
            tempConfig = tempConfig[index];
            resultConfig = tempConfig;
        } else {
            resultConfig = {};
        }
    }

    return Object.keys(resultConfig).length 
                ? resultConfig 
                : (defaultValue !== undefined ? defaultValue : {});
    */
};

module.exports = config;