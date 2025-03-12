const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) =>{
    const token = req.header('Authorization');
    if(!token){
        return res.status(401).json({ error : 'You are not logged in..' });
    }
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({ error : 'Invalid token' })
    }
};
module.exports = verifyToken;