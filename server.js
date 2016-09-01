const express = require('express');
const port = process.env.PORT || 3232;
const app = express();

app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res)=>{
  res.sendFile(__dirname + '/index.html');
});

app.get('*', (req, res)=>{
  res.redirect('/');
});

app.listen(port, (err)=>{
  if(err) console.log(err);
  console.log('Listening to port: ', port);
});
