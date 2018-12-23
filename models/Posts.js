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
	},
	location: {
		type: String,
		trim: true,
		required: true
	},
	likedBy: {
		type: Array,
		default: []
	}
});
const Posts = mongoose.model('Posts',PostSchema);
module.exports = Posts;