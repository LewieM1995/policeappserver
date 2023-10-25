const express = require('express');
const router = express.Router();

//import controllers
const { ByLocation } = require('../controllers/ByLocation');
const { ByCoordinate} = require('../controllers/ByCoordinate');

//api routes

router.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
  });

router.post('/coordinate', ByCoordinate);
router.post('/location', ByLocation);


module.exports = router;