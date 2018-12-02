const errors = require('restify-errors');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const config = require('../config.js');
module.exports = (server) => {
	server.post('/register',(req,res,next) => {
		const {username,email,password} = req.body;
		if(!email||!password){
			return next(new errors.BadRequestError('Please type email and password'));
		}
		User.findOne({email}).then((userFound) => {
			if(userFound.email === email || userFound.username === username){
				return next(new errors.BadRequestError('Email or username already taken'));
			}
		});
		const user = new User({
			username,
			email,
			password
		});
		bcrypt.genSalt(10,(err,salt)=>{
			bcrypt.hash(user.password,salt,(err,hash) => {
				//hash password
				user.password = hash;
				user.save().then(()=>{
					res.send(user);
					next();
				}).catch((e) => {
					return next(new errors.InternalError(e.message));
				})
			});
		});
	});
	//login user
	server.post('/login',(req,res,next) => {
		const {email,password} = req.body;
		User.findOne({email})
		.then((user) => {
			bcrypt.compare(password,user.password,(err,isMatch)=>{
				if(isMatch){
					return res.send(user);
				}
				else{
					return next(new errors.NotFoundError('User Not Found'));
				}
			});
		})
		.catch((err) => {
			return next(new errors.NotFoundError(err));
		});
	});
	server.get('/user/:username',(req,res,next) => {
		const username = req.params.username;
		User.findOne({username})
		.then((user) => {
			if(!user){
				return next(new errors.NotFoundError('Can\'t find any user with that username'));
			}
			res.send(user);
		})
		.catch((e) => {
			return next(new erros.BadRequestError(e.message));
		})
	});
}