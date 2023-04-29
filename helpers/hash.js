const crypto = require('crypto');

function hashPassword(plainPassword) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto.pbkdf2Sync(plainPassword, salt, 100, 64, 'sha512').toString('hex');
    return { hashedPassword, salt };
}

function comparePassword(hashedPassword, salt, plainPassword) {
    const hashedRawPassword = crypto.pbkdf2Sync(plainPassword, salt, 100, 64, `sha512`).toString(`hex`);
    return hashedPassword===hashedRawPassword;
}

module.exports = {
    hashPassword,
    comparePassword,
};
