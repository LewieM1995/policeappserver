const express = require('express');
const cors = require('cors');
const http = require('http');
const fs = require('fs');
require('dotenv').config();
const { pool1, pool2 } = require('./database');
const { policeAppRouter, ringconRouter } = require('./routing/routes');

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

pool.getConnection((err, connection) => {
    if (err){
        console.error('Error conneting to database', err);
        return;
    }
    console.log('Connected to policedata');
    
    
    //routes
    const Routes = require('./routing/routes');
    app.use('/', Routes);

    const options = {
        key: fs.readFileSync('/etc/letsencrypt/live/policeappserver.duckdns.org/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/policeappserver.duckdns.org/cert.pem'),
        ca: fs.readFileSync('/etc/letsencrypt/live/policeappserver.duckdns.org/chain.pem'),
    };
    
    
    const server = https.createServer(options, app);
    
    //porting
    const port = process.env.PORT || 4000;
    //listener
    server.listen(port, () => console.log(`Server is Live ${port}`));
    console.log('Server started successfully');
});

