const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../secrets/index');

module.exports = function buildToken(user) {
    const payload = {
        subject: user.id,
        username: user.username,
    }
    const options = {
        expiresIn: '1d',
    }
    return jwt.sign(payload, JWT_SECRET, options)
}
