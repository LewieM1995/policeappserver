const express = require('express');
const router = express.Router();

//import controllers
const { ByLocation } = require('../controllers/ByLocation');
const { ByForce } = require('../controllers/ByForce');
const { GetDataById } = require('../controllers/DataById');
//api routes

router.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
  });

router.post('/location', ByLocation);
router.post('/byforce', ByForce);
router.get('/get-data/:id', GetDataById);


module.exports = router;