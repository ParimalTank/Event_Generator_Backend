const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = mongoose.model("User")
require('dotenv').config()

module.exports = (req, res, next) => {
    const { authorization } = req.headers
    //console.log(authorization);
    if(!authorization){
        return res.status(401).json({error: "you must be loged in"})
    }
    const token = authorization.replace("Bearer ", "")
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if(err){
            return res.status(401).json({error: "you must be logged in"})
        }
        const { id } = payload
        User.findById(id).then(userdata => {
            req.user = userdata
            // console.log(payload)
            next()
        })
    })
}