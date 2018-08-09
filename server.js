const path = require('path');
const http = require('http');
const express = require('express');
const routes = require('./routes');

const app = express();
const server = http.createServer(app);
const io = require('socket.io').listen(server);
io.sockets.on('connection', routes);

app.set('port', process.env.PORT || 3001);

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'));
}

app.get('*', (request, response) => {
	response.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

server.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
