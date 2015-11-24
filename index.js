const express = require('express');
const app = express();

app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
  	next();
});
app.use(express.static(__dirname + '/public'));
// app.get('/', function(req, res){
//   	res.send('hello world');
// });
app.listen(3000);