const catchAsync = require("../utils/catchAsync");
const Post = require("../models/postModel");
const AppError = require("../utils/appError");
const socket = require("../socket");

exports.createPost = catchAsync(async (req, res, next) => {
  const io = socket.getIO();
  const content = req.body.content;
  const author = req.user._id;
  let imagePath = "";

  if (req.file) {
    imagePath = `/public/images/${req.file.filename}`;
  }
  const post = await Post.create({ content, author, imageUrl: imagePath });

  io.emit("newPost", {
    post,
    message: "New post created",
  });

  res.status(201).json({
    status: true,
    message: "Post created Successfully",
    data: {
      post,
    },
  });
});

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const posts = await Post.find({})
    .populate("author", "name profileImage")
    .populate("likes", "name profileImage")
    .populate("comments", "text author")
    .sort({ createdAt: -1 });
  if (!posts) return next(new AppError("No post found", 404));
  res.status(200).json({
    status: true,
    data: {
      posts,
    },
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const post = await Post.findByIdAndDelete(req.params.id);
  if (!post) return next(new AppError("Post to be deleted , not found!", 404));

  if (!post.author.equals(req.user._id))
    return next(new AppError("Not Authorized", 403));

  res.json({
    status: true,
    message: "Post deleted Successfully",
  });
});

exports.likeAndUnlinkPost = catchAsync(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new AppError("Post not found", 404));

  if (post.likes.includes(req.user._id)) {
    post.likes.pull(req.user._id);
  } else {
    post.likes.push(req.user._id);
  }

  await post.save();
  await post.populate("likes", "name profileImage");

  res.json({
    status: true,
    data: {
      post,
    },
  });
});
