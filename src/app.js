'use strict';

var express = require('express');
var app = express();

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
}); // index route

app.listen(3000, console.log('Server is running...'));