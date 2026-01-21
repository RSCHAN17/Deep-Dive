const jwt = require('jsonwebtoken')

function authenticator(req, res, next) {
    const token = req.headers['authorization'];

    if (token) {
        jwt.verify(token, process.env.SECRET_TOKEN, (err, data) => {
            if (err) {
                 res.status(401).json({ err : 'invalid token' });
            } else {
                req.user = data;
                next();
            }
        })
    } else {
        res.status(403).json({ err: 'missing token'})
    }
}

module.exports = authenticator;