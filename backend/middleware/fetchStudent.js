var jwt = require('jsonwebtoken');

const JWT_SECRET = 'elephantismyfavoritanimal';

const fetchuser = (req, res, next) => {
    const token = req.header('auth-token')
    if(!token){
        res.status(401).send({error: 'please authenticate using a valid token'});
    }
    try {
        const data = jwt.verify(token, JWT_SECRET)
        req.user = data.user;
        next();
    } catch (error) {
        console.error(error.message);
        // 401 is HTTP bad request
        res.status(401).send({error: "please authenticate using a valid token"})
    }
}

module.exports = fetchuser;