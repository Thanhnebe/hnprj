/** @format */

const Router = require('express');
const {
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
	uploadImage, uploadMiddleware
} = require('../controllers/userController');
const verifyToken = require('../middlewares/verifyMiddleware');

const userRouter = Router();

userRouter.get('/get-all', getAllUsers);
userRouter.get('/get-followed-events', getEventsFollowed);
userRouter.post('/update-fcmtoken', updateFcmToken);
userRouter.get('/get-profile', getProfile);
userRouter.get('/get-followers', getFollowes);
userRouter.get('/get-follwings', getFollowings);
userRouter.put('/update-profile',verifyToken, updateProfile);
userRouter.put('/update-interests', updateInterests);
userRouter.put('/update-following', toggleFollowing);
userRouter.post('/send-invite', pushInviteNotifications);
userRouter.post('/push-notification', pushTestNoti);
userRouter.post('/upload-photo', uploadMiddleware, uploadImage);

module.exports = userRouter;
