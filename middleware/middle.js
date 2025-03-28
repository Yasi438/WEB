const jwt = require('jsonwebtoken');
const SECRET_KEY = 'fornow';

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send('Access Denied: No token provided');
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).send('Invalid or expired token');
    }
};

module.exports = verifyToken;
