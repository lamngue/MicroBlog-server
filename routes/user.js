const errors = require('restify-errors');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const async = require("async");
const nodemailer = require("nodemailer");
module.exports = (server) => {
    server.post('/loginWithFaceBook', (req, res, next) => {
        const { username, email } = req.body;
        User.findOne({ email })
            .then((user) => {
                if (user) {
                    return res.send(user);
                } else {
                    new User({
                        username,
                        email
                    }).save().then(() => {
                        res.send(user);
                        next();
                    }).catch((e) => {
                        return next(new errors.InternalError(e.message));
                    })
                }
            })
            .catch((err) => {
                return next(new errors.NotFoundError(err));
            });
    });
    server.post('/register', (req, res, next) => {
        const { username, email, password } = req.body;
        if (!email || !password) {
            return next(new errors.BadRequestError('Please type email and password'));
        }
        User.findOne({ email }).then((userFound) => {
            if (userFound.email === email || userFound.username === username) {
                return next(new errors.BadRequestError('Email or username already taken'));
            }
        });
        const user = new User({
            username,
            email,
            password
        });
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                //hash password
                user.password = hash;
                user.save().then(() => {
                    res.send(user);
                    next();
                }).catch((e) => {
                    return next(new errors.InternalError(e.message));
                })
            });
        });
    });
    //login user
    server.post('/login', (req, res, next) => {
        const { email, password } = req.body;
        User.findOne({ email })
            .then((user) => {
                bcrypt.compare(password, user.password, (err, isMatch) => {
                    if (isMatch) {
                        return res.send(user);
                    } else {
                        return next(new errors.NotFoundError('User Not Found'));
                    }
                });
            })
            .catch((err) => {
                return next(new errors.NotFoundError(err));
            });
    });
    server.get('/user/:username', (req, res, next) => {
        const username = req.params.username;
        User.findOne({ username })
            .then((user) => {
                if (!user) {
                    return next(new errors.NotFoundError('Can\'t find any user with that username'));
                }
                res.send(user);
            })
            .catch((e) => {
                return next(new erros.BadRequestError(e.message));
            })
    });
    server.post('/forgot', (req, res, next) => {
        const { email } = req.body;

        function makePassword() {
            let pass = '';
            const chars = "abcdefghiklmnopqrstuvwxyzABCDEFGHIKLMNOPQRSTUVWXYZ0123456789";
            for (let i = 0; i < 8; i++) {
                pass += chars[Math.floor(Math.random() * chars.length + 1)];
            }
            return pass;
        }
        User.findOne({ email }).then((user) => {
            const pass = makePassword();
            if (user) {
                const output = `
					<p> You have requested to reset password</p>
					<h3> Your email is: ${email} </h3>
					<h4> And your new password is ${pass} </h4>
				`
                let transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 587,
                    secure: false,
                    requireTLS: true,
                    auth: {
                        user: 'lnguye16@gustavus.edu',
                        pass: process.env.gmailPassword
                    }
                });

                // setup email data with unicode symbols
                let mailOptions = {
                    from: '"Lam 👻" <lnguye16@gustavus.edu>', // sender address
                    to: `${email}`, // list of receivers
                    subject: 'Password Reset request', // Subject line
                    text: 'Reset Pasword?', // plain text body
                    html: `${output}` // html body
                };

                // send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                });
            }
            User.findOneAndUpdate({ email }, { password: pass }, { new: true }).then((user) => {
                    if (user) {
                        bcrypt.genSalt(10, (err, salt) => {
                            bcrypt.hash(user.password, salt, (err, hash) => {
                                //hash password
                                user.password = hash;
                                user.save().then(() => {
                                    res.send(user);
                                    next();
                                }).catch((e) => {
                                    return next(new errors.InternalError(e.message));
                                })
                            });
                        });
                    }
                })
                .catch((e) => {
                    return next(new errors.BadRequestError(e.message));
                });
        });
    });
}