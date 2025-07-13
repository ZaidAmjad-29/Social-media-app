const User = require("../models/userModel");

exports.sendRequest = async (req, res) => {
  const userFrom = req.user._id;
  const { userIdTo } = req.body;

  const targetUser = await User.findById(userIdTo);
  if (!targetUser) return res.status(404).json({ error: "User not found" });

  if (
    targetUser.friendRequests.includes(userFrom) ||
    targetUser.friends.includes(userFrom)
  ) {
    return res
      .status(400)
      .json({ error: "Already requested or already friends" });
  }

  targetUser.friendRequests.push(userFrom);
  await targetUser.save();

  res.status(200).json({ message: "Friend request sent!" });
};

exports.acceptRequest = async (req, res) => {
  const userTo = req.user._id;
  const { userIdFrom } = req.body;

  const currentUser = await User.findById(userTo);
  const fromUser = await User.findById(userIdFrom);

  if (!currentUser.friendRequests.includes(userIdFrom)) {
    return res.status(400).json({ error: "No such request" });
  }

  currentUser.friends.push(userIdFrom);
  fromUser.friends.push(userTo);

  currentUser.friendRequests = currentUser.friendRequests.filter(
    (id) => id.toString() !== userIdFrom
  );

  await currentUser.save();
  await fromUser.save();

  res.status(200).json({ message: "Friend request accepted!" });
};

exports.rejectRequest = async (req, res) => {
  const userTo = req.user._id;
  const { userIdFrom } = req.body;

  const currentUser = await User.findById(userTo);

  if (!currentUser.friendRequests.includes(userIdFrom)) {
    return res.status(400).json({ error: "No such request" });
  }

  currentUser.friendRequests = currentUser.friendRequests.filter(
    (id) => id.toString() !== userIdFrom
  );

  await currentUser.save();

  res.status(200).json({ message: "Friend request rejected!" });
};

exports.removeFriend = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const friendId = req.params.friendId;

    const currentUser = await User.findById(currentUserId);
    const friendUser = await User.findById(friendId);

    if (!currentUser || !friendUser) {
      return res.status(404).json({ message: "User not found" });
    }

    
    currentUser.friends = currentUser.friends.filter(
      (id) => id.toString() !== friendId
    );
    friendUser.friends = friendUser.friends.filter(
      (id) => id.toString() !== currentUserId.toString()
    );

    await currentUser.save();
    await friendUser.save();

    res.status(200).json({ message: "Friend removed successfully" });
  } catch (error) {
    console.error("Error removing friend:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getMe = async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate("friendRequests", "name bio")
    .populate("friends", "name bio");

  res.status(200).json({ user });
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find().select("name bio");
  res.status(200).json({ users });
};
