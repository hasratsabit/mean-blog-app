const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Blog = require('../models/blog');
const jwt = require('jsonwebtoken');
const config = require('../config/database');


/******************************
				Post New Blogs
******************************/
router.post('/newBlog', (req, res) => {
	// Check if title exists.
	if(!req.body.title) {
		res.json({ success: false, message: 'Title is required.'})
	}else {
		// Check if body exists
		if(!req.body.body) {
			res.json({ success: false, message: 'Body is required.'});
		}else {
			// Check if the auther exists.
			if(!req.body.createdBy){
				res.json({ success: false, message: 'Blog creator is required.'});
			}else {
				// Creat the schema and blog object.
				const blog = new Blog({
					title: req.body.title,
					body: req.body.body,
					createdBy: req.body.createdBy
				});
				// Save the blog.
				blog.save((err) => {
					// Check if there is any validation error.
					if(err){
						// Check for title validation errors
						if(err.errors.title){
							res.json({ success: false, message: err.errors.title.message });
						}else {
							// Check for body validation errors
							if(err.errors.body){
								res.json({ success: false, message: err.errors.body.message });
							}else {
								// Return any other errors
								res.json({ success: false, message: err.errmsg });
							}
						}
					}else {
						// Return a success message for the blog posted.
						res.json({ success: true, message: 'Blog successfully posted'});
					}
				})
			}
		}
	}

});
/*****************************/



/******************************
	Get Blogs
******************************/

	router.get('/allBlogs', (req, res) => {
		Blog.find({}, (err, blogs) => {
			if(err){
				res.json({ success: false, message: err});
			}else {
				if(!blogs){
					res.json({ success: false, message: 'No blog was found.'});
				}else {
					res.json({ success: true, blogs: blogs });
				}
			}
		}).sort({ '_id': -1}); // Sort it from newest to the oldest.
	})

/*****************************/


module.exports = router;
