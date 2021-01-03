const express = require('express');
const app = express(); 
const port = 3000;
const bodyParser = require('body-parser');

const routes = require('./src/routes');

app.use('/', routes);
app.use('/assets', express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.listen(port,() =>{
  console.log(`Escuchando en el puerto ${port}`);
});
