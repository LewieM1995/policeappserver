//import modules
const express = require('express');
const cors = require('cors');
const http = require('http');
require('dotenv').config();

//app
const app = express();
app.use(express.json());

//middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:4000'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


//routes
const Routes = require('./routing/routes');
app.use('/', Routes);

const server = http.createServer(app);

//porting
const port = process.env.PORT || 4000;
//listener
server.listen(port, () => console.log(`Server is Live ${port}`));