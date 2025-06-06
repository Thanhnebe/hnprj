/** @format */

const jwt = require('jsonwebtoken');
const asyncHandle = require('express-async-handler');

const verifyToken = asyncHandle((req, res, next) => {
	const accessToken = req.headers.authorization;
	console.log('accessToken', accessToken);
	const token = accessToken && accessToken.split(' ')[1];

	if (!token) {
		res.status(401);
		console.log('Un authorization!!');
		throw new Error('Un authorization!!');
	} else {
		try {
			// console.log(token);
			const verify = jwt.verify(token, process.env.SECRET_KEY);
	console.log('verify', verify);

			req.user = verify;
			if (verify) {
				next();
			}
		} catch (error) {
			res.status(403);
			throw new Error('Access token is not valid!!!');
		}
	}
});

module.exports = verifyToken;
