//import modules
const express = require('express');
const cors = require('cors');
const https = require('http');
const fs = require('fs');
require('dotenv').config();
const pool = require('./database');

//app
const app = express();
app.use(express.json());

//middleware
app.options('*', cors());

app.use(cors({
    origin: ['https://main.d2ua1ewdznhv26.amplifyapp.com', 'http://localhost:3000', 'http://localhost:4000'],
    methods: ['GET', 'POST'],
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
        key: fs.readFileSync('/etc/letsencrypt/live/policeappsever.duckdns.org/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/policeappsever.duckdns.org/cert.pem'),
        ca: fs.readFileSync('/etc/letsencrypt/live/policeappsever.duckdns.org/chain.pem'),
    };
    
    
    const server = https.createServer(options, app);
    
    //porting
    const port = process.env.PORT || 4000;
    //listener
    server.listen(port, () => console.log(`Server is Live ${port}`));
});

