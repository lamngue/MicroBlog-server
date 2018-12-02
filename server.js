const restify = require('restify');
const mongoose = require('mongoose');
const config = require('./config');
const rjwt = require('restify-jwt-community');
const corsMiddleware = require('restify-cors-middleware');
const server = restify.createServer();

//Middleware
const cors = corsMiddleware({
  preflightMaxAge: 15, //Optional
  origins: ['*'],
  allowHeaders: ['*'],
  exposeHeaders: ['API-Token-Expiry']
});
server.pre(cors.preflight);
server.use(cors.actual);
server.use(restify.plugins.bodyParser());
server.listen(config.PORT, () => {
	mongoose.connect(config.MONGODB_URI,
		{useNewUrlParser: true}
	);
});

const db = mongoose.connection;
db.on('error',(err) => console.log(err));

db.once('open',() => {
	require('./routes/user')(server);
	require('./routes/posts')(server);
	console.log(`Server started on port ${config.PORT}`);
});