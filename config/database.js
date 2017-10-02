// Creates Random Secret
const crypto = require('crypto').randomBytes(256).toString('hex');

module.exports = {
	uri: 'mongodb://localhost:27017/mean-blog-app',
	secret: crypto,
	db: 'mean-blog-app'
}
