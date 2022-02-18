const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dbfile = require('./conn');
const preEvent = require('./models/preEvent')
const postEvent = require('./models/postEvent')
const User = require('./models/user')
const requireLogin = require('./middleware/requireLogin')


const { json } = require('body-parser');

const port = process.env.PORT || 5000;

// express app
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(require('./routes/getCount'))
app.use(require('./routes/auth'))
app.use(require("./routes/preEvent"))
app.use(require("./routes/postEvent"))
app.use(require("./routes/updateDelete"))


app.get('/myEvents', requireLogin, (req, res) => {
    //console.log(req.user);
    preEvent.find({createdBy: req.user._id})
    .populate("createdBy", "_id userName email")
    .then( mypost => {
        res.json({evnts: mypost})
    })
    .catch( err => {
        console.log(err)
    })
})

app.get('/allEvents', requireLogin, (req, res) => {
    preEvent.find()
    .populate("createdBy", "_id userName email")
    .then( evnts => {
        res.json({evnts})
    })
    .catch( err => {
        console.log(err)
    })
})

app.get('/myPostEvent', requireLogin, (req, res) => {
    postEvent.findOne({eventId: req.params})
    .populate("eventId")
    .then( post => {
        let x = post
        User.findById(x[0].eventId.createdBy)
        .then((data) => {
            res.json({postDetails: post, user: data})
        })
        .catch( err => {
            console.log(err);
        })
    })
    .catch( err => {
        console.log(err)
    })
})
app.get('/postEventDetails', (req, res) => {
    postEvent.find()
    .populate("eventId")
    .then( post => {
        let x = post
        User.findById(x[0].eventId.createdBy)
        .then((data) => {
            res.json({postDetails: post, user: data})
        })
        .catch( err => {
            console.log(err);
        })
    })
    .catch( err => {
        console.log(err)
    })
})


// if(process.env.NODE_ENV == "production"){
//     app.use(express.static('client/build'))
//     const path = require('path')
//     app.get("*", (req, res) => {
//         res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
//     })
// }

app.get("/" ,  (req , res) => {
    res.json({status : "Server Started"})
});
// listen for request
app.listen(port, () =>{
    console.log("Server Started Successfully")
});

