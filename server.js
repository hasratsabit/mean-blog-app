const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('./config/database');
const mainRoute = require('./routes/index');

// ES6 Promise
mongoose.Promise = global.Promise;
mongoose.connect(config.uri, { useMongoClient: true }, (err) => {
	if(err){
		console.log('Database cannot be connected', err);
	}else {
		console.log('Connected to database: ' + config.db);
	}
})


// Static Files
app.use(express.static(__dirname + '/client/dist/'));
// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// API Routes
app.use('/', mainRoute);

// All routes to client index
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname + '/client/dest/index.html'));
})


// Port
const port = process.env.port || 3000
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
})
