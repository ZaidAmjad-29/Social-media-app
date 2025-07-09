const Comment = require("../models/commentsModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Post = require("../models/postModel");
const socket = require("../socket");

exports.addComment = catchAsync(async (req, res, next) => {
  const io = socket.getIO();
  const postId = req.params.postId;
  const text = req.body.text;
  const author = req.user._id;
  if (!text) return next(new AppError("Comment text is required", 400));

  const newComment = await Comment.create({
    postId,
    text,
    author,
  });
  const post = await Post.findById(postId);
  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  post.comments.push(newComment._id);
  console.log(post);
  await post.save();

  io.emit("newComment", {
    comment: newComment,
    message: "Got a new comment on your post",
  });

  res.status(201).json({
    status: true,
    message: "comment added to post successfully",
    data: {
      newComment,
    },
  });
});

exports.getComments = catchAsync(async (req, res, next) => {
  const postId = req.params.postId;

  const comments = await Comment.find({ postId })
    .populate("author", "name profileImage")
    .populate("likes", "name profileImage")
    .sort({ createdAt: -1 });

  if (!comments || comments.length === 0) {
    return next(new AppError("No comments found for this post", 404));
  }

  res.status(200).json({
    status: true,
    message: "Comments retrieved successfully",
    data: {
      comments,
    },
  });
});

exports.likeComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findById(req.params.commentId);
  if (!comment) {
    return next(new AppError("Comment not found", 404));
  }

  if (comment.likes.includes(req.user._id)) {
    comment.likes.pull(req.user._id);
  } else {
    comment.likes.push(req.user._id);
  }
  await comment.save();
  await comment.populate("likes", "name profileImage");
  res.json({
    status: true,
    data: {
      comment,
    },
  });
});

exports.deleteComment = catchAsync(async (req, res, next) => {
  const comment = await Comment.findByIdAndDelete(req.params.commentId);
  if (!comment) return next(new AppError("Comment not found", 404));

  res.json({
    status: true,
    message: "Comment deleted successfully",
  });
});
