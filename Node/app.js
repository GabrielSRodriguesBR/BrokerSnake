const express = require('express');
const routes = require('./routes');
const path = require('path');
const app = express();
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/view');
app.use(express.urlencoded({ extended: true}))
app.use(routes);
app.listen(2077);