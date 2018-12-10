const errors = require('restify-errors');
const Posts = require('../models/Posts.js');
const User = require('../models/User.js');
module.exports = (server) => {
	server.get('/posts',(req,res,next) => {
		Posts.find().then((posts)=>{
			res.send(posts);
			next();
		})
		.catch((e) => {
			return next(new errors.InternalError(e.message));
		});
	});
	server.post('/posts',(req,res,next) => {
		const {username,title,categories,content,location} = req.body;
		//make a new post 
		const post = new Posts({
			username,
			title,
			categories,
			content,
			createdAt: `${new Date().toDateString()}  ${new Date().toLocaleTimeString('en-US')}`,
			location
		});
		return post.save()
		    .then((doc) => User.findOneAndUpdate({username}, {$push: {'postCreated': doc}})
		    .then(() => {
		    	console.log(doc.userID);
		    	res.send(doc);
		    }))
		    .catch((e) => {
		        return next(new errors.BadRequestError(e.message));
		    });
	});
	server.get('/posts/:id',(req,res,next) => {
		const {id} = req.params;
		Posts.findById(id).then((post) => {
			if(!post){
				return next(new errors.NotFoundError(error.message));
			}
			res.send(post);
		})
		.catch((e) => {
			return next(new errors.BadRequestError(e.message));
		});
	});
	server.del('/posts',(req,res,next)=>{
		const {id,username} = req.body;
		User.findOne({username}).then(user => {
		    user.postCreated = user.postCreated.filter(post => post._id != id);
		    user.save();
		});
		Posts.findOneAndRemove({_id: id}).then((post) => {
			if(!post){
				return next(new errors.NotFoundError('Post not found'));
			}
			res.send(post);
		})
		.catch((e) => {
			return next(new errors.BadRequestError(e.message));
		});
	});
}