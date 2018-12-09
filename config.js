module.exports ={
	ENV: process.env.NODE_ENV || 'development',
	PORT: process.env.PORT || 3001,
	URL: process.env.BASE_URL || 'http://localhost:3000',
	MONGODB_URI: process.env.MONGODB_URI || 'mongodb://lambchop:abc123!@ds249123.mlab.com:49123/microblog-users',
	JWT_SECRET: process.env.JWT_SECRET || 'secret3',
	googleClientID: '632086836071-vhfhl60mroj5mvtfbfd5t4klf4ibrgqe.apps.googleusercontent.com',
	googleClientSecret: 'Ri_PLcYAEF3uU1ko_BqLHhuh'
}