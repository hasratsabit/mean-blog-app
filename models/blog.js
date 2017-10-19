const mongoose = require('mongoose');
const Schema = mongoose.Schema;



/********************
	Title Validation
********************/

// Title Length
let titleLengthChecker = (title) => {
	if(!title){
		return false;
	}else {
		if(title.length < 5 || title.length > 50){
			return false;
		}else {
			return true;
		}
	}
}

// Valid Title
const alphaNumericChecker = (title) => {
	if(!title){ // If no title return false
		return false;
	}else {
		const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);
		return regExp.test(title); // Test if it is a regular expression
	}
}


// Title Validator Object.
const titleValidators = [
	{
		validator: titleLengthChecker,
		message: 'Title must be at least 5 characters but no more than 50'
	},{
		validator: alphaNumericChecker,
		message: 'It must be a valid Title'
	}

];
/**************************/


/********************
	Body Validation
********************/

// Title Length
let bodyLengthChecker = (body) => {
	if(!body){
		return false;
	}else {
		if(body.length < 5 || body.length > 500){
			return false;
		}else {
			return true;
		}
	}
}


// Body Validator Object.
const bodyValidators = [
	{
		validator: bodyLengthChecker,
		message: 'Body must be at least 5 characters but no more than 500'
	}

];
/**************************/



/********************
	comment Validation
********************/

let commentLengthChecker = (comment) => {
	if(!comment[0]){
		return false;
	}else {
		if(comment[0].length < 1 || comment.length > 200){
			return false;
		}else {
			return true;
		}
	}
}


// Comment Validator Object.
const commentValidators = [
	{
		validator: commentLengthChecker,
		message: 'Comment must be at least 1 characters but no more than 200'
	}

];

/**************************/



/********************
	Blog Schema
********************/
const BlogSchema = new Schema({
	title: { type: String, required: true, validate: titleValidators },
	body: { type: String, required: true, validate: bodyValidators },
	createdBy: { type: String },
	createdAt: { type: Date, default: Date.now() },
	likes: { type: Number, default: 0 },
	likedBy: { Type: Array },
	dislikes: { type: Number, default: 0 },
	disliedBy: { type: Array },
	comments: [
		{
			comment: { type: String, validate: commentValidators },
			commentator: { type: String }
		}
	]
})

/**************************/

module.exports = mongoose.model('Blog', BlogSchema);
