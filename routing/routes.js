const express = require('express');
const router = express.Router();

//import controllers policeapp
const { ByLocation } = require('../controllers/ByLocation');
const { ByForce } = require('../controllers/ByForce');
const { GetDataById } = require('../controllers/DataById');

//import controllers ringcon
const { postData } = require('../controllers/postData');
const { getData } = require('../controllers/getData');
const { getDataTable } = require('../controllers/getDataTable');
//api routes

router.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
  });

/* ROUTES for policeapp */
router.post('/location', ByLocation);
router.post('/byforce', ByForce);
router.get('/get-data/:id', GetDataById);

/* ROUTES for ringcon */
router.post('/data', postData);
router.get('/data', getData);
router.get('/data_table', getDataTable);

module.exports = router;