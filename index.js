const express = require('express');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
require('dotenv').config();
const { pool1, pool2 } = require('./database');

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

/* POLICEAPP ROUTES AND DB CONNECTION */
const policeAppRouter = require('./routing/routes');
app.use('/policeapp', (req, res, next) => {
    req.pool = pool1;
    console.log('Connected to policeapp database');
    next();
});
app.use('/policeapp', policeAppRouter);

/* Ringcon ROUTES AND DB CONNECTION */
const ringconRouter = require('./routing/routes');
app.use('/ringcon', (req, res, next) => {
    req.pool = pool2;
    console.log('Connected to ringcon database');
    next();
});
app.use('/ringcon', ringconRouter);

// HTTPS Server
const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/policeappserver.duckdns.org/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/policeappserver.duckdns.org/cert.pem'),
    ca: fs.readFileSync('/etc/letsencrypt/live/policeappserver.duckdns.org/chain.pem'),
};
const server = https.createServer(options, app);

// Porting
const port = process.env.PORT || 4000;

// Listener
server.listen(port, () => console.log(`Server is Live ${port}`));
