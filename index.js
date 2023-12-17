//import modules
const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
require('dotenv').config();
const { pool1, pool2 } = require('./database');

//app
const app = express();
app.use(express.json());

//middleware
app.options('*', cors());

app.use(cors({
    origin: ['https://main.d2ua1ewdznhv26.amplifyapp.com', 'https://main.d2m80lfwl4zikf.amplifyapp.com', 'http://localhost:3000', 'http://localhost:4000'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

/* POLICEAPP ROUTES AND DB CONNECTION */
app.use('/policeapp', (req, res, next) => {
    req.pool = pool1;
    next();
    console.log('Connected to policeapp database');
});
const policeAppRoutes = require('./routing/routes');
app.use('/policeapp', policeAppRoutes);
//End Connection
app.use('/policeapp', (req, res, next) => {
    req.pool.end();
    next();
});


/* Ringcon ROUTES AND DB CONNECTION */
app.use('/ringcon', (req, res, next) => {
    req.pool = pool2;
    next();
    console.log('Connected to ringcon database');
});
const ringconRoutes = require('./routing/routes');
app.use('/ringcon', ringconRoutes);
//End Connection
app.use('/ringcon', (req, res, next) => {
    req.pool.end();
    next();
});

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

