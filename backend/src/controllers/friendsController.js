const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const socket = require("../socket");

exports.sendFriendRequest = catchAsync(async (req, res, next) => {
  const io = socket.getIO();
  const targetUser = await User.findById(req.params.userId);
  if (!targetUser) {
    return next(new AppError("User not found", 404));
  }
  if (targetUser.friends.includes(req.user._id)) {
    return next(new AppError("You are already friends", 400));
  }
  if (targetUser.friendRequests.includes(req.user._id)) {
    return next(new AppError("Friend request already sent", 400));
  }
  targetUser.friendRequests.push(req.user._id);
  await targetUser.save();
  await targetUser.populate("friendRequests", "name profileImage");

  const currentUser = await User.findById(req.user._id);
  if (!currentUser) {
    return next(new AppError("Current user not found", 404));
  }
  currentUser.friendRequests.push(targetUser._id);
  await currentUser.save();

  io.emit(`friendRequest:${targetUser._id}`, {
    from: req.user._id,
    message: "You received a new friend request!",
  });

  res.status(201).json({
    status: true,
    message: "Friend request sent successfully",
    data: {
      user: targetUser,
    },
  });
});

exports.acceptFriendRequest = catchAsync(async (req, res, next) => {
  const targetUser = await User.findById(req.params.userId);
  if (!targetUser) {
    return next(new AppError("User not found", 404));
  }
  if (!targetUser.friendRequests.includes(req.user._id)) {
    return next(new AppError("No friend request from this user", 400));
  }

  targetUser.friends.push(req.user._id);
  targetUser.friendRequests.pull(req.user._id);
  await targetUser.save();
  await targetUser.populate("friends", "name profileImage");

  const currentUSer = await User.findById(req.user._id);
  if (!currentUSer) {
    return next(new AppError("Current user not found", 404));
  }

  currentUSer.friends.push(targetUser._id);
  currentUSer.friendRequests.pull(targetUser._id);
  await currentUSer.save();

  // console.log(currentUSer.friends);

  res.status(200).json({
    status: true,
    message: "Friend request accepted successfully",
    data: {
      user: targetUser,
    },
  });
});

exports.removeFriend = catchAsync(async (req, res, next) => {
  const targetUser = await User.findById(req.params.userId);
  if (!targetUser) {
    return next(new AppError("User not found", 404));
  }
  if (!targetUser.friends.includes(req.user._id)) {
    return next(new AppError("You are not friends with this user", 400));
  }

  targetUser.friends.pull(req.user._id);
  await targetUser.save();
  await targetUser.populate("friends", "name profileImage");

  const currentUser = await User.findById(req.user._id);
  if (!currentUser) {
    return next(new AppError("Current user not found", 404));
  }

  currentUser.friends.pull(targetUser._id);
  await currentUser.save();

  res.status(200).json({
    status: true,
    message: "Friend removed successfully",
    data: {
      user: targetUser,
    },
  });
});

exports.rejectRequest = catchAsync(async (req, res, next) => {
  const targetUser = await User.findById(req.params.userId);
  if (!targetUser) {
    return next(new AppError("User not found", 404));
  }
  if (!targetUser.friendRequests.includes(req.user._id)) {
    return next(new AppError("No friend request from this user", 400));
  }

  targetUser.friendRequests.pull(req.user._id);
  await targetUser.save();

  const currentUser = await User.findById(req.user._id);
  if (!currentUser) {
    return next(new AppError("Current user not found", 404));
  }

  currentUser.friendRequests.pull(targetUser._id);
  await currentUser.save();

  res.status(200).json({
    status: true,
    message: "Friend request rejected successfully",
    data: {
      user: targetUser,
    },
  });
});
