const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const cookieParser = require('cookie-parser');
const router = require("./src/routes");
const jobs = require('./jobs.json');
const PORT = process.env.PORT || 8080;

var msg = 'Welcome to RYpro api';
console.log(msg);

const app = express();

app.use(express.json())
app.use(cookieParser())

//enables cors
app.use(cors({
    'allowedHeaders': ['sessionId', 'Content-Type', 'Authorization'],
    'exposedHeaders': ['sessionId'],
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
    'preflightContinue': false
  }));
  

app.use(bodyParser.json());

app.use(router);

app.get('/', (req, res) => {
    res.send(msg);
});

app.post('/login', (req, res) => {
    const user = req.body;
    let msg = {
        isSuccess: false,
        message: '',
        hasError: false,
        key: ''
    };
    if(user.emailAddress === 'adminrypro@ryprotechnologies.com') {
        if(user.password === '123456789'){
            msg.message = 'Login successful';
            msg.isSuccess = true;
            msg.key = makeKey(128);
            res.status(200).send(msg);
        }
        else{
            msg.message = 'Password is incorrect';
            msg.hasError = true;
            res.status(401).send(msg);
        }
    } else{
        msg.message = 'Invalid User Details';
        msg.hasError = true;
        res.status(401).send(msg);
    }
});

app.listen(3010, () => {
    console.log('Server started on port 3010');
});

function makeKey(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}