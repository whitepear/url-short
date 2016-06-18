'use strict';
// IN FUTURE PROJECTS, UTILISE CONNECTION POOLING
var express = require('express');
var app = express();

var mongodb = require('mongodb');
// declare variables for database connection via mongo driver
var mongoClient = mongodb.MongoClient;
var urlMongo = 'mongodb://localhost:27017/urls';


// app.get('/new/:url(*)?', function(req, res) {
// 	// if url is undef, serve index.html
// 	// if not undef, check if it's a valid address using regex -- return null json if not valid
// 	// if it is valid, check if it already exists in database -- return valid document if it already exists
// 	// if it doesn't exist, add it to db and return valid document
	
// 	// store passed url in urlLong
// 	var urlLong = req.params.url;

// 	if (urlLong === undefined || urlLong.length === 0) {
// 		res.sendFile(__dirname + '/index.html');
// 	} else {
// 		var urlMongo = 'mongodb://localhost:27017/urls';		
// 		var urlRegex = /https?:\/\/www\.\w+\.\w+/;
// 		var mongoQuery = { original_url : urlLong };

// 		if(urlRegex.test(urlLong)) {
			
// 			mongoClient.connect(urlMongo, function (err, db) {
// 				var urlCollection = db.collection('urls');
// 				if (err) {
// 					console.log('Unable to connect to database', err);
// 					db.close();
// 				} else {
// 					console.log('Connection established to database');
// 					urlCollection.findOne(mongoQuery, function (err, document) {
// 						if (err) {
// 							console.log('findOne error occurred.');
// 							db.close();
// 						} else {
// 							if (document) {
// 								// return the document already in the database
// 								console.log('Document already exists within database.');
// 								res.send(document);
// 								db.close();
// 							} else {
// 								// generate a new document and return it
// 								generateShort();																			
// 							}
// 						}

// 					}); // end findOne
// 				} 
				


// 				function generateShort () {
// 					// alphanumeric array for generating short urls	
// 					var alphaNumeric = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","0","1","2","3","4","5","6","7","8","9"];

// 					var shortParam = '';
// 					for (var i = 0; i < 5; i++) {
// 						shortParam += alphaNumeric[getRandomIntInclusive(0, alphaNumeric.length-1)];
// 					}
// 					var urlShort = 'http://localhost:3000/' + shortParam;
// 					var genQuery = { short_url: urlShort };
					
// 					urlCollection.findOne(genQuery, function (err, document) {
// 						if (err) {
// 							console.log('generateShort error occurred.');
// 							db.close();
// 						} else {
// 							if (document) {
// 								console.log('urlShort already exists within database. Generating another...');				
// 								generateShort();
// 							} else {
// 								console.log('Unique urlShort successfully generated.');	
										
// 								var urlObj = { 
// 									original_url: urlLong,
// 									short_url: urlShort
// 								};
								
// 								urlCollection.insertOne(urlObj, function (err, result) {
// 									if (err) {
// 										console.log('Insert error occurred.');
// 									} else {
// 										console.log('Document successfully inserted.');										
// 										res.send(result.ops);
// 									}	
// 									db.close();									
// 								});		
// 							}
// 						}
// 					}); // end .findOne				
				

// 					function getRandomIntInclusive(min, max) {
// 				    	return Math.floor(Math.random() * (max - min + 1)) + min;
// 					}

// 				} // end generateShort
// 			}); // end db connection

// 		} else {
// 			res.send({ "original_url": null, "short_url": null });
// 		}		
// 	}	
// }); // /new get


app.get('/:address?', function(req, res) {
	
	if (req.params.address !== undefined) {
		
		var shortAddress = 'http://localhost:3000/' + req.params.address;
		var addressQuery = { short_url: shortAddress };
		
		mongoClient.connect(urlMongo, function (err, db) {
			var urlCollection = db.collection('urls');
			if (err) {
				console.log('Unable to connect to database: ', err);
				db.close();
			} else {
				console.log('Connection established to database.');
				urlCollection.findOne(addressQuery, function (err, document) {
					if (err) {
						console.log('An addressQuery error has occurred: ', err);
						db.close();
					} else {
						if (document) {
							console.log('Document found! Redirecting...');
							var redirectLink = document;
							console.log(redirectLink);
							db.close();
							res.redirect(redirectLink.original_url);							
						} else {
							console.log('That address does not exist within the database. Please generate it first.');
							db.close();
							res.sendFile(__dirname + '/index.html');
						}
					}
				}); // end .findOne
			}
		}); // end db connection
	} else if (req.query.new) {
		// if url is undef, serve index.html
		// if not undef, check if it's a valid address using regex -- return null json if not valid
		// if it is valid, check if it already exists in database -- return valid document if it already exists
		// if it doesn't exist, add it to db and return valid document
		
		// store passed url in urlLong
		var urlLong = req.query.new;		
				
		var urlRegex = /https?:\/\/www\.\w+\.\w+/;
		var mongoQuery = { original_url : urlLong };

		if(urlRegex.test(urlLong)) {
			
			mongoClient.connect(urlMongo, function (err, db) {
				var urlCollection = db.collection('urls');
				if (err) {
					console.log('Unable to connect to database', err);
					db.close();
				} else {
					console.log('Connection established to database');
					urlCollection.findOne(mongoQuery, function (err, document) {
						if (err) {
							console.log('findOne error occurred.');
							db.close();
						} else {
							if (document) {
								// return the document already in the database
								console.log('Document already exists within database.');
								res.send(document);
								db.close();
							} else {
								// generate a new document and return it
								generateShort();																			
							}
						}

					}); // end .findOne
				} 				


				function generateShort () {
					// alphanumeric array for generating short urls	
					var alphaNumeric = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","0","1","2","3","4","5","6","7","8","9"];

					var shortParam = '';
					for (var i = 0; i < 5; i++) {
						shortParam += alphaNumeric[getRandomIntInclusive(0, alphaNumeric.length-1)];
					}
					var urlShort = 'http://localhost:3000/' + shortParam;
					var genQuery = { short_url: urlShort };
					
					urlCollection.findOne(genQuery, function (err, document) {
						if (err) {
							console.log('generateShort error occurred.');
							db.close();
						} else {
							if (document) {
								console.log('urlShort already exists within database. Generating another...');				
								generateShort();
							} else {
								console.log('Unique urlShort successfully generated.');	
										
								var urlObj = { 
									original_url: urlLong,
									short_url: urlShort
								};
								
								urlCollection.insertOne(urlObj, function (err, result) {
									if (err) {
										console.log('Insert error occurred.');
									} else {
										console.log('Document successfully inserted.');										
										res.send(result.ops);
									}	
									db.close();									
								});		
							}
						}
					}); // end .findOne				
				

					function getRandomIntInclusive(min, max) {
				    	return Math.floor(Math.random() * (max - min + 1)) + min;
					}

				} // end generateShort
			}); // end db connection

		} else {
			res.send({ "original_url": null, "short_url": null });
		}		
			
	} else {
		res.sendFile(__dirname + '/index.html');
	}
	
	
}); // root get

app.listen(3000, console.log('Server is running...'));