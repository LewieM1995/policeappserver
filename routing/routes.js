const express = require('express');
const router = express.Router();

//import controllers
const { ByLocation } = require('../controllers/ByLocation');

//api routes

router.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json');
    next();
  });

router.post('/location', ByLocation);


module.exports = router;