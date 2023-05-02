
const { v5: uuidv5 } = require('uuid');
const crypto = require('crypto');

const generateUUID = (inputString) => {
    const uuidNamespace = uuidv5.URL;
    const hash = crypto.createHash('sha1').update(inputString).digest('hex');
    const uuid = uuidv5(hash, uuidNamespace);
    return uuid;
};

module.exports = {
    generateUUID
}