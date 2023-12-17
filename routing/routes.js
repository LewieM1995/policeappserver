const express = require('express');
const router = express.Router();

// import controllers policeapp
const { ByLocation } = require('../controllers/ByLocation');
const { ByForce } = require('../controllers/ByForce');
const { GetDataById } = require('../controllers/DataById');

// import controllers ringcon
const { postData } = require('../controllers/postData');
const { getData } = require('../controllers/getData');
const { getDataTable } = require('../controllers/getDataTable');

// Routes for policeapp
const policeAppRouter = express.Router();
policeAppRouter.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

policeAppRouter.post('/location', ByLocation);
policeAppRouter.post('/byforce', ByForce);
policeAppRouter.get('/get-data/:id', GetDataById);

// Routes for ringcon
const ringconRouter = express.Router();
ringconRouter.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

ringconRouter.post('/data', postData);
ringconRouter.get('/data', getData);
ringconRouter.get('/data_table', getDataTable);

module.exports = {
    policeAppRouter,
    ringconRouter,
};
