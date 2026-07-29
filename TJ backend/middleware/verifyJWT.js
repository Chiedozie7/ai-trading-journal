const jwt = require('jsonwebtoken');


const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
   
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);
    const token = authHeader.split(' ')[1]; //extracts token from the header
    
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                const decoded = jwt.decode(token);
                return res.sendStatus(403);
            } //invalid token/forbidden
            req.user = decoded.UserInfo.email;
            req.id = decoded.UserInfo.id;
            next();
        }
    );
}


module.exports = verifyJWT;