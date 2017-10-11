const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database');


/******************************
	Register Route
******************************/
router.post('/register', (req, res) => {
	// Check if email was provided
	if (!req.body.email) {
		res.json({ success: false, message: 'You must provide an e-mail' }); // Return error
	} else {
		// Check if username was provided
		if (!req.body.username) {
			res.json({ success: false, message: 'You must provide a username' }); // Return error
		} else {
			// Check if password was provided
			if (!req.body.password) {
				res.json({ success: false, message: 'You must provide a password' }); // Return error
			} else {
				// Create new user object and apply user input
				let user = new User({
					email: req.body.email.toLowerCase(),
					username: req.body.username.toLowerCase(),
					password: req.body.password
				});
				// Save user to database
				user.save((err) => {
					// Check if error occured
					if (err) {
						// Check if error is an error indicating duplicate account
						if (err.code === 11000) {
							res.json({ success: false, message: 'Username or e-mail already exists' }); // Return error
						} else {
							// Check if error is a validation rror
							if (err.errors) {
								// Check if validation error is in the email field
								if (err.errors.email) {
									res.json({ success: false, message: err.errors.email.message }); // Return error
								} else {
									// Check if validation error is in the username field
									if (err.errors.username) {
										res.json({ success: false, message: err.errors.username.message }); // Return error
									} else {
										// Check if validation error is in the password field
										if (err.errors.password) {
											res.json({ success: false, message: err.errors.password.message }); // Return error
										} else {
											res.json({ success: false, message: err }); // Return any other error not already covered
										}
									}
								}
							} else {
								res.json({ success: false, message: 'Could not save user. Error: ', err }); // Return error if not related to validation
							}
						}
					} else {
						res.json({ success: true, message: 'Acount registered!' }); // Return success
					}
				});
			}
		}
	}
});

/*****************************/






/******************************
	E-Mail Availability Route
******************************/
router.get('/checkEmail/:email', (req, res) => {
	// Check if email was provided in paramaters
	if (!req.params.email) {
		res.json({ success: false, message: 'E-mail was not provided' }); // Return error
	} else {
		// Search for user's e-mail in database;
		User.findOne({ email: req.params.email }, (err, user) => {
			if (err) {
				res.json({ success: false, message: err }); // Return connection error
			} else {
				// Check if user's e-mail is taken
				if (user) {
					res.json({ success: false, message: 'E-mail is already taken' }); // Return as taken e-mail
				} else {
					res.json({ success: true, message: 'E-mail is available' }); // Return as available e-mail
				}
			}
		});
	}
});


/*****************************/




/******************************
	Username Availability Route
******************************/
router.get('/checkUsername/:username', (req, res) => {
	// Check if username was provided in paramaters
	if (!req.params.username) {
		res.json({ success: false, message: 'Username was not provided' }); // Return error
	} else {
		// Look for username in database
		User.findOne({ username: req.params.username }, (err, user) => {
			// Check if connection error was found
			if (err) {
				res.json({ success: false, message: err }); // Return connection error
			} else {
				// Check if user's username was found
				if (user) {
					res.json({ success: false, message: 'Username is already taken' }); // Return as taken username
				} else {
					res.json({ success: true, message: 'Username is available' }); // Return as vailable username
				}
			}
		});
	}
});

/*****************************/

/******************************
	Username Availability Route
******************************/
router.post('/login', (req, res) => {
	if(!req.body.username){
		// Check if the username typed. 
		res.json({ success: false, message: 'No username was provided'});
	}else {
		// Check if the password is typed.
		if(!req.body.password){
			res.json({ success: false, message: 'No password was provided'});
		}else {
			// Find the username in database.
			User.findOne({ username: req.body.username.toLowerCase()}, (err, user) => {
				// Check if there is an error.
				if(err){
					res.json({ success: false, message: err });
				}else {
					// Respond if the user doesn't exist.
					if(!user){
						res.json({ success: false, message: 'Username does not exist.'})
					}else {
						// Compare the user password and database. Compare password method is created in the model.
						const validPassword = user.comparePassword(req.body.password)
						// Respond if the password doesn't match in the database.
						if(!validPassword){
							res.json({ success: false, message: 'Password is incorrect.'});
						}else {
							// Create the token. Send the user ID from the user object.
							const token = jwt.sign({ userId: user._id}, config.secret, { expiresIn: '24h'});
							// Log in the user and pass the token and username.
							res.json({ success: true, message: 'Successfully logged in.', token: token, user: { username: user.username } })
						}
					}
				}
			})
		}
	}
})







module.exports = router;
