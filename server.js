const restify = require('restify');
const mongoose = require('mongoose');
const rjwt = require('restify-jwt-community');
const corsMiddleware = require('restify-cors-middleware');
const server = restify.createServer();
require('dotenv').config()
//Middleware
const cors = corsMiddleware({
  origins: ['http://localhost:3000','https://miniblog123.herokuapp.com'],
  allowHeaders: ['*'],
  exposeHeaders: ['API-Token-Expiry']
});
server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.bodyParser());
server.listen(process.env.PORT, () => {
	mongoose.connect(`${process.env.MONGODB_URI}`,
		{useNewUrlParser: true}
	);
});

const db = mongoose.connection;
db.on('error',(err) => console.log(err));

db.once('open',() => {
	require('./routes/user')(server);
	require('./routes/posts')(server);
	console.log(`Server started on port ${process.env.PORT}`);
});