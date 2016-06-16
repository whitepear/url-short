'use strict';

var express = require('express');
var app = express();

var mongodb = require('mongodb');

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
}); // root get

app.get('/new/:url(*)?', function(req, res) {
	// if url is undef, serve index.html [DONE]
	// if not, check if it's a valid address using regex [DONE]
	// if it is, check if it already exists in database []
	// if it doesn't, log it and return []

	// alphanumeric array for generating short urls
	var alphaNumericStr = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	var alphaNumeric = alphaNumericStr.split('');
	// declare variables for database connection via mongo driver
	var mongoClient = mongodb.MongoClient;
	var urlMongo = 'mongodb://localhost:27017/urls';	
	// store passed url in urlLong
	var urlLong = req.params.url;

	if (urlLong === undefined || urlLong.length === 0) {
		res.sendFile(__dirname + '/index.html');
	} else {
		var urlRegex = /https?:\/\/www\.\w+\.\w+/;
		if(urlRegex.test(urlLong)) {
			mongoClient.connect(urlMongo, function(err, db) {
				if (err) {
					console.log('Unable to connect to database', err);
				} else {
					console.log('Connection established to database');
					var urlCollection = db.collection('urls');
					if (urlCollection.find({"original_url" : urlLong})) {
						// return the document already in the database
					} else {
						// create a short url, log long and short to database, return database entry
					}
				}
			});

		} else {
			res.send({ "original_url": null, "short_url": null });
		}		
	}
	
}); // /new get

app.listen(3000, console.log('Server is running...'));