import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY;

export function authentification(req, res, next) {

    const token = req.cookies.token;

    if(!token) {
        return res.status(403).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, SECRET_KEY, function (err, user) {
        if(err) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        req.user = user;
        next();
    });

    
}