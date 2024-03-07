const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
require('dotenv').config();
const { pool1, pool2 } = require('./database');
const { policeAppRouter, ringconRouter } = require('./routing/routes');
const emailRouter = require('./controllers/postEmail');

// App
const app = express();
app.use(express.json());

// Middleware
app.options('*', cors());
app.use(cors({
    origin: ['https://main.d2ua1ewdznhv26.amplifyapp.com', 'https://main.d2m80lfwl4zikf.amplifyapp.com', 'http://localhost:3000', 'http://localhost:4000'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

//MailtoRoute
app.use('/', emailRouter);


pool1.getConnection((err, connection1) => {
    if (err) {
        console.error('Error connecting to database pool1', err);
        return;
    }
    console.log('Connected to pool1');

    // Routes using pool1
    app.use('/policeapp', (req, res, next) => {
        req.dbConnection = connection1;
        next();
    }, policeAppRouter);
});

pool2.getConnection((err, connection2) => {
    if (err) {
        console.error('Error connecting to database pool2', err);
        return;
    }
    console.log('Connected to pool2');

    // Routes using pool2
    app.use('/ringcon', (req, res, next) => {
        req.dbConnection = connection2;
        next();
    }, ringconRouter);
});

    const options = {
        key: fs.readFileSync('/etc/letsencrypt/live/policeappserver.duckdns.org/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/policeappserver.duckdns.org/cert.pem'),
        ca: fs.readFileSync('/etc/letsencrypt/live/policeappserver.duckdns.org/chain.pem'),
    };
    
    
    const server = https.createServer( options, app);
    
    //porting
    const port = process.env.PORT || 4000;
    //listener
    server.listen(port, () => console.log(`Server is Live ${port}`));
    console.log('Server started successfully');
