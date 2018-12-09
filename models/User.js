const mongoose = require('mongoose');
let randomNum = Math.random() * Math.floor(100);
const UserSchema = new mongoose.Schema({
	username:{
		type: String,
		required: true,
		trim: true,
		default: `User ${randomNum}`
	},
	email:{
		type: String,
		required: true,
		trim: true
	},
	password:{
		type: String,
		required: true,
		trim: true,
		default: '1234567'
	},
	postCreated:{
		type: Array,
		default: []
	}
});

const User = mongoose.model('User',UserSchema);
module.exports = User;