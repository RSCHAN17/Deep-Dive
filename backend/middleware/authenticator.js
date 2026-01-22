// const jwt = require('jsonwebtoken')

// function authenticator(req, res, next) {
//     const token = req.headers['authorization'];

//     if (token) {
//         jwt.verify(token, process.env.SECRET_TOKEN, (err, data) => {
//             if (err) {
//                  res.status(401).json({ err : 'invalid token' });
//             } else {
//                 req.user = data;
//                 next();
//             }
//         })
//     } else {
//         res.status(403).json({ err: 'missing token'})
//     }
// }

// module.exports = authenticator;

const jwt = require('jsonwebtoken')

function authenticator(req, res, next) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(403).json({ err: 'missing token' });
    }

    // "Bearer <token>"
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ err: 'invalid token format' });
    }

    jwt.verify(token, process.env.SECRET_TOKEN, (err, data) => {
        if (err) {
            return res.status(401).json({ err: 'invalid token' });
        }

        req.user = data; // { user_id, username }
        next();
    });
}

module.exports = authenticator;