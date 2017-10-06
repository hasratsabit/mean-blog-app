const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

/********************
	Email Validation
********************/

// Email Length
let emailLenghtChecker = (email) => {
	if(!email){
		return false;
	}else {
		if(email.length < 5 || email.length > 30){
			return false;
		}else {
			return true;
		}
	}
}

// Valid Email
let validEmailChecker = (email) => {
	if(!email){
		return false;
	}else {
		const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
		return regExp.test(email); // Test if it is a valid email format
	}
}

// Email Validator Object.
const emailValidators = [
	{
		validator: emailLenghtChecker,
		message: 'E-mail must be at least 5 characters but no more than 30'
	},{
		validator: validEmailChecker,
		message: 'It must be a valid Email'
	}

];
/**************************/



/********************
	Username Validation
********************/

// Username Length Checker
const usernameLengthChecker = (username) => {
	if(!username){
		return false;
	}else {
		if(username.length < 3 || username.length > 15){
			return false;
		}else {
			return true;
		}
	}
}


// Valid Username
const validUsernameChecker = (username) => {
	if(!username){ // If no username return false
		return false;
	}else {
		const regExp = new RegExp(/^[a-zA-Z0-9]+$/);
		return regExp.test(username); // Test if it is a regular expression
	}
}

// Username validator array
const usernameValidators = [
	{
		validator: usernameLengthChecker,
		message: 'Username must be greater than 3 and no more than 15'
	},{
		validator: validUsernameChecker,
		message: 'Username can be only letters and numbers'
	}
];
/**************************/



/*********************
	Password Encryptian
**********************/

// Password Length Checker
let passwordLengthChecker = (password) => {
	if(!password){
		return false;
	}else {
		if(password.length < 8 || password.length > 30){
			return false;
		}else {
			return true;
		}
	}
}

let validPassword = (password) => {
	if(!password){
		return false
	}else {
		// Password validation expression
		const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
		return regExp.test(password) // Test password with expression
	}
}

const passwordValidators = [
	{
		validator: passwordLengthChecker,
		message: 'Password must be longer than 8 and no longer than 30'
	},{
		validator: validPassword,
		message: 'Must have at least one uppercase, lowercase, special character, and number'
	}
]
/**************************/




/****************
	User Schema
*****************/
const UserSchema = new Schema({
	email: { type: String, required: true, unique: true, lowercase: true, validate: emailValidators },
	username: { type: String, required: true, unique: true, lowercase: true, validate: usernameValidators },
	password: { type: String, required: true, validate: passwordValidators }
});
/**************************/



/*********************
	Password Encryptian
**********************/

// Schema Middleware to Encrypt Password
UserSchema.pre('save', function(next) {
  // Ensure password is new or modified before applying encryption
  if (!this.isModified('password'))
    return next();

  // Apply encryption
  bcrypt.hash(this.password, null, null, (err, hash) => {
    if (err) return next(err); // Ensure no errors
    this.password = hash; // Apply encryption to password
    next(); // Exit middleware
  });
});
/**************************/



/**********************
	Password Dycription
**********************/
UserSchema.methods.comparePassword = function(password) {
	return bcrypt.compareSync(password, this.password);
}
/**************************/

const User = mongoose.model('User', UserSchema);
module.exports = User;
