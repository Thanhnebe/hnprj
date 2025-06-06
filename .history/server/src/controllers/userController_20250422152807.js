/** @format */

const asyncHandle = require('express-async-handler');
const UserModel = require('../models/userModel');
const EventModel = require('../models/eventModel');
const { JWT } = require('google-auth-library');
const cloudinary = require('../configs/cloudinaryConfig');
const multer = require('multer');

const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com',
	port: 587,
	auth: {
		user: process.env.USERNAME_EMAIL,
		pass: process.env.PASSWORD_EMAIL,
	},
});

const handleSendMail = async (val) => {
	try {
		await transporter.sendMail(val);

		return 'OK';
	} catch (error) {
		return error;
	}
};

const getAllUsers = asyncHandle(async (req, res) => {
	const users = await UserModel.find({});

	const data = [];
	users.forEach((item) =>
		data.push({
			email: item.email ?? '',
			name: item.name ?? '',
			id: item.id,
		})
	);

	res.status(200).json({
		message: 'Get users successfully!!!',
		data,
	});
});

const getEventsFollowed = asyncHandle(async (req, res) => {
	const { uid } = req.query;

	if (uid) {
		const events = await EventModel.find({ followers: { $all: uid } });

		const ids = [];

		events.forEach((event) => ids.push(event.id));

		res.status(200).json({
			message: 'fafa',
			data: ids,
		});
	} else {
		res.sendStatus(401);
		throw new Error('Missing uid');
	}
});
const getProfile = asyncHandle(async (req, res) => {
	const { uid } = req.query;

	// const accesstoken = await getAccessToken();
	// console.log(accesstoken);

	if (uid) {
		const profile = await UserModel.findOne({ _id: uid });

		res.status(200).json({
			message: 'fafa',
			data: {
				uid: profile._id,
				createdAt: profile.createdAt,
				updatedAt: profile.updatedAt,
				name: profile.name ?? '',
				givenName: profile.givenName ?? '',
				familyName: profile.familyName ?? '',
				email: profile.email ?? '',
				photoUrl: profile.photoUrl ?? '',
				bio: profile.bio ?? '',
				following: profile.following ?? [],
				interests: profile.interests ?? [],
			},
		});
	} else {
		res.sendStatus(401);
		throw new Error('Missing uid');
	}
});

const updateFcmToken = asyncHandle(async (req, res) => {
	const { uid, fcmTokens } = req.body;

	await UserModel.findByIdAndUpdate(uid, {
		fcmTokens,
	});

	res.status(200).json({
		message: 'Fcmtoken updated',
		data: [],
	});
});

const getAccessToken = () => {
	return new Promise(function (resolve, reject) {
		const key = require('../evenhub-accesstoken-file.json');
		const jwtClient = new JWT(
			key.client_email,
			null,
			key.private_key,
			['https://www.googleapis.com/auth/cloud-platform'],
			null
		);
		jwtClient.authorize(function (err, tokens) {
			if (err) {
				reject(err);
				return;
			}
			resolve(tokens.access_token);
		});
	});
};

const handleSendNotification = async ({
	token,
	title,
	subtitle,
	body,
	data,
}) => {
	var request = require('request');
	var options = {
		method: 'POST',
		url: 'https://fcm.googleapis.com/v1/projects/evenhub-f8c6e/messages:send',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${await getAccessToken()}`,
		},
		body: JSON.stringify({
			message: {
				token,
				notification: {
					title,
					body,
					subtitle,
				},
				data,
			},
		}),
	};
	request(options, function (error, response) {
		if (error) throw new Error(error);
		console.log(error);

		console.log(response);
	});
};

const getFollowes = asyncHandle(async (req, res) => {
	const { uid } = req.query;

	if (uid) {
		const users = await UserModel.find({ following: { $all: uid } });

		const ids = [];

		if (users.length > 0) {
			users.forEach((user) => ids.push(user._id));
		}

		res.status(200).json({
			message: '',
			data: ids,
		});
	} else {
		res.sendStatus(404);
		throw new Error('can not find uid');
	}
});
const getFollowings = asyncHandle(async (req, res) => {
	const { uid } = req.query;

	if (uid) {
		const user = await UserModel.findById(uid);

		res.status(200).json({
			message: '',
			data: user.following,
		});
	} else {
		res.sendStatus(404);
		throw new Error('can not find uid');
	}
});

const updateProfile = asyncHandle(async (req, res) => {
	const body = req.body;
	const uid = req.user.id; // Lấy uid từ req.user.id sau khi đã xác thực token
	
		const salt = await bcryp.genSalt(10);
	const bcryptPass = await bcrypt.hash(body.password, salt);
	if (uid && body) {
		const data = await UserModel.findByIdAndUpdate(uid, {
			name: body.name,
			password: bcryptPass,
			email: body.email,
			phone: body.phone,
		});
		
		res.status(200).json({
			message: 'Update profile successfully',
			data: data,
		});
	} else {
		res.sendStatus(401);
		throw new Error('Missing uid');	
	}
});
const uploadImage = async (req, res) => {
	try {
		const file = req.file; // Ảnh từ multer
		console.log(file);

		if (!file) {
			return res.status(400).json({ message: 'Vui lòng chọn ảnh!' });
		}

		const result = await cloudinary.uploader.upload(file.path, {
			folder: 'profile_pictures',
		});

		// Cập nhật ảnh mới vào user
		const user = await UserModel.findByIdAndUpdate(
			req.body.userId,  // Dữ liệu userId cần phải gửi từ client
			{ photoUrl: result.secure_url },
			{ new: true }
		);

		res.status(200).json({
			message: 'Cập nhật ảnh thành công!',
			data: user,
		});
	} catch (error) {
		console.error('Lỗi upload ảnh:', error);
		res.status(500).json({ message: 'Lỗi upload ảnh' });
	}
};


const storage = multer.diskStorage({});
const upload = multer({ storage });
const updateInterests = asyncHandle(async (req, res) => {
	const body = req.body;
	const { uid } = req.query;

	if (uid && body) {
		await UserModel.findByIdAndUpdate(uid, {
			interests: body,
		});

		res.status(200).json({
			message: 'Update interested successfully',
			data: body,
		});
	} else {
		res.sendStatus(404);
		throw new Error('Missing data');
	}
});

const toggleFollowing = asyncHandle(async (req, res) => {
	const { uid, authorId } = req.body;

	if (uid && authorId) {
		const user = await UserModel.findById(uid);

		if (user) {
			const { following } = user;

			const items = following ?? [];
			const index = items.findIndex((element) => element === authorId);
			if (index !== -1) {
				items.splice(index, 1);
			} else {
				items.push(`${authorId}`);
			}

			await UserModel.findByIdAndUpdate(uid, {
				following: items,
			});

			res.status(200).json({
				message: 'update following successfully!!!',
				data: items,
			});
		} else {
			res.sendStatus(404);
			throw new Error('user or author not found!!!');
		}
	} else {
		res.sendStatus(404);
		throw new Error('Missing data!!');
	}
});

const pushInviteNotifications = asyncHandle(async (req, res) => {
	const { ids, eventId } = req.body;

	ids.forEach(async (id) => {
		const user = await UserModel.findById(id);

		const fcmTokens = user.fcmTokens;

		if (fcmTokens > 0) {
			fcmTokens.forEach(
				async (token) =>
					await handleSendNotification({
						fcmTokens: token,
						title: 'fasfasf',
						subtitle: '',
						body: 'Bạn đã được mời tham gia vào sự kiện nào đó',
						data: {
							eventId,
						},
					})
			);
		} else {
			// Send mail
			const data = {
				from: `"Support EventHub Appplication" <${process.env.USERNAME_EMAIL}>`,
				to: email,
				subject: 'Verification email code',
				text: 'Your code to verification email',
				html: `<h1>${eventId}</h1>`,
			};

			await handleSendMail(data);
		}
	});

	res.status(200).json({
		message: 'fafaf',
		data: [],
	});
});

const pushTestNoti = asyncHandle(async (req, res) => {
	const { title, body, data } = req.body;

	console.log(title);

	// await handleSendNotification({
	// 	data,
	// 	title,
	// 	body,
	// });

	res.status(200).json({
		message: 'fafa',
		data: [],
	});
});
module.exports = {
	getAllUsers,
	getEventsFollowed,
	updateFcmToken,
	getProfile,
	getFollowes,
	updateProfile,
	updateInterests,
	toggleFollowing,
	getFollowings,
	pushInviteNotifications,
	pushTestNoti,
	uploadImage,
	uploadMiddleware: upload.single('image'),
};
