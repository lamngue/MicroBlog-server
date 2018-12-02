const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const PostSchema = new mongoose.Schema({
	username:{
		type: String,
		trim: true,
		required: true
	},
	title:{
		type: String,
		trim: true,
		required: true
	},
	categories:{
		type: String,
		trim: true,
		required: true
	},
	content:{
		type: String,
		trim: true,
		required: true
	},
	createdAt:{
		type: String,
		required: true
	}
});
const Posts = mongoose.model('Posts',PostSchema);
module.exports = Posts;