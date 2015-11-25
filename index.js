// global.config = process.env.NODE_ENV === 'development' ? require('./config.dev.js') : require('./config.js');

const express = require('express');
const app = express();
const router = express.Router();
const server = require('http').Server(app);

require('./router')(router)
app.use(router);

var io = require('socket.io')(server);
server.listen(3000);

app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
  	next();
});
app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
	socket.emit('news', { hello: 'world' });
	socket.on('my other event', function (data) {
    	console.log(data);
  	});
});