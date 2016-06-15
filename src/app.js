'use strict';

var express = require('express');
var app = express();

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
}); // root get

app.get('/new/:url(*)?', function(req, res) {
	var urlLong = req.params.url;
	if (urlLong === undefined || urlLong.length === 0) {
		res.sendFile(__dirname + '/index.html');
	} else {
		var urlRegex = /https?:\/\/www\.\w+\.\w+/;
		if(urlRegex.test(urlLong)) {
			res.send('Its working');
		}
		
	}
	// if url is undef, serve index.html [DONE]
	// if not, check if it's a valid address using regex [DONE]
	// if it is, check if it already exists in database []
	// if it doesn't, log it and return []
}); // /new get

app.listen(3000, console.log('Server is running...'));