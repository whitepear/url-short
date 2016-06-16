'use strict';

var express = require('express');
var app = express();

var mongodb = require('mongodb');
// declare variables for database connection via mongo driver
var mongoClient = mongodb.MongoClient;
var urlMongo = 'mongodb://localhost:27017/urls';	
var urlCollection = db.collection('urls');

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
}); // root get

app.get('/new/:url(*)?', function(req, res) {
	// if url is undef, serve index.html [DONE]
	// if not, check if it's a valid address using regex [DONE]
	// if it is, check if it already exists in database []
	// if it doesn't, log it and return []	
	
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
					
					if (urlCollection.find({"original_url" : urlLong})) {
						// return the document already in the database
						console.log('Document already exists within database');
						res.send(urlCollection.find({"original_url": urlLong}));
					} else {
						// create a short url
						// check to see that the newly generated short url does not already exist in database already
						// log long and short to database, return database entry
					}
				}
			});

		} else {
			res.send({ "original_url": null, "short_url": null });
		}		
	}
	
}); // /new get


function generateShort () {
	// alphanumeric array for generating short urls	
	alphaNumeric = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","0","1","2","3","4","5","6","7","8","9"];

	var shortParam = '';
	for (var i = 0; i < 5; i++) {
		shortParam += alphaNumeric[getRandomIntInclusive(0, alphaNumeric.length-1)];
	}

	var shortUrl = 'https://little-url.herokuapp.com/' + shortParam;

	mongoClient.connect(urlMongo, function(err, db) {

		if (err) {
			console.log('Unable to establish database connection', err);
		} else {
			if (urlCollection.find({"short_url": shortUrl})) {
				generateShort();
			} else {				
				return shortUrl;
			}
		}
	}

	function getRandomIntInclusive(min, max) {
    	return Math.floor(Math.random() * (max - min + 1)) + min;
	}
}

app.listen(3000, console.log('Server is running...'));