const express = require('express');
const app = express();

//Simple request time logger for a specific route
app.use('/', (req, res, next) => {    
  console.log('A new request received at ' + Date.now());
  next();
});

app.get('/home', (req, res) => {
  console.log('1');
  res.send('Home Page');
});

app.get('/about', (req, res) => {
  console.log('2');
  res.send('About Page');
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));