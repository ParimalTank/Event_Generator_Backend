const mongoose = require('mongoose')
require('dotenv').config()

const client = mongoose.connect(process.env.MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true});

const dbObj = mongoose.connection

dbObj.on('connected', () => {
    console.log('MongoDB Connection Successfull');
})
dbObj.on('error', () => {
    console.log('MongoDB Connection Failed');
})

module.exports = mongoose