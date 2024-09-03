const express = require('express');

// import controllers for policeapp
const { ByLocation } = require('../controllers/ByLocation');
const { ByForce } = require('../controllers/ByForce');
const { GetDataById } = require('../controllers/DataById');

// import controllers for ringcon
const { postData } = require('../controllers/postData');
const { getData } = require('../controllers/getData');
const { getDataTable } = require('../controllers/getDataTable');

// import controllers for Fuji Seal
const { addOrUpdatePantone } = require('../controllers/fujisealControllers/addOrUpdatePantone');
const { getUser } = require('../controllers/fujisealControllers/userControllers/getUser');
const {getChart} = require('../controllers/fujisealControllers/getChart')
const {postData} = require('../controllers/fujisealControllers/postData');
const {getPantones} = require('../controllers/fujisealControllers/getPantones');
const {postQuarantineInk} = require('../controllers/fujisealControllers/postQuarantineInk');
const {updatePantone} = require('../controllers/fujisealControllers/updatePantone');
const {deletePantone} = require('../controllers/fujisealControllers/deletePantone')


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

// Routes for fuji seal app
const fujiRouter = express.Router();
fujiRouter.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
});

fujiRouter.post('/getUser', getUser);
fujiRouter.post('/getChart', getChart);
fujiRouter.post('/postData', postData);
fujiRouter.get('/getPantones', getPantones);
fujiRouter.post('/addPantone', addOrUpdatePantone);
fujiRouter.post('/postQuarantineInk', postQuarantineInk);
fujiRouter.post('/updatePantone', updatePantone);
fujiRouter.delete('/deletePantone/:id', deletePantone)

module.exports = {
    policeAppRouter,
    ringconRouter,
    fujiRouter
};
