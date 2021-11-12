const User = require('../users/users-model');

const validateCreds = (req, res, next) => {
    const { username, password } = req.body;
    if (!username || !password) {
        next({
            status: 401,
            message: 'username and password required'
        })
    } else {
        next()
    }
}

async function checkUsernameFree(req, res, next) {
    const [user] = await User.findBy({ username: req.body.username })
    if (user) {
        next({ status: 422, message: 'username taken' })
    } else {
        next()
    }
}

async function checkUsernameExists(req, res, next) {
    const [user] = await User.findBy({ username: req.body.username})
    if (!user) {
        next({ status: 401, message: 'invalid credentials'})
    } else {
        next()
    }
}

module.exports = {
    validateCreds,
    checkUsernameFree,
    checkUsernameExists
}
