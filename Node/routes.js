const express = require('express');
const routes = express.Router();

const HomeController = require('./controller/HomeController');

routes.get('/', HomeController.index);
routes.get('/gamePartial', HomeController.gamePartial);


module.exports = routes; 