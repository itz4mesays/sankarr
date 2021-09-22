//This file would be used as a file that contains general information
require('dotenv').config()
const jwt = require('jsonwebtoken')

let token = null;
module.exports = {
    decodedToken: (req, res, next) => {
        console.log(req.params.profileapi_key)
        token = req.params.profileapi_key
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
            console.log(err)
            if (err) return res.json({ statusCode: 400, error: true, data: {message: 'Invalid or no authorization token provided.'} })    
            res.locals.user = decoded.user
            next()
        });
    }
}