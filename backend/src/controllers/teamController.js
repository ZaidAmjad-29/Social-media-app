const Team = require("../models/teamModel");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

//create a new team
exports.createTeam = catchAsync(async (req, res, next) => {
  const team = await Team.create({
    name: req.body.name,
    members: [req.user._id],
    creator: req.user._id,
  });

  res.status(201).json({
    status: true,
    message: "Team created successfully",
    data: {
      team,
    },
  });
});

//get all teams

exports.getAllTeams = catchAsync(async (req, res, next) => {
  const teams = await Team.find()
    .populate("members", "name email")
    .populate("creator", "name email");

  res.status(200).json({
    status: true,
    data: {
      teams,
    },
  });
});

//get a team by id
exports.getTeamById = catchAsync(async (req, res, next) => {
  const team = await Team.findById(req.params.id)
    .populate("members", "name email")
    .populate("creator", "name email");

  if (!team) {
    return res.status(404).json({
      status: false,
      message: "Team not found",
    });
  }

  res.status(200).json({
    status: true,
    data: {
      team,
    },
  });
});

//delete teams
exports.deleteTeam = catchAsync(async (req, res, next) => {
  const team = await Team.findByIdAndDelete(req.params.id);
  if (!team) {
    return next(new AppError("Team not found", 404));
  }
  if (!team.creator.equals(req.user._id)) {
    return res
      .status(403)
      .json({ error: "Only the creator can delete this team" });
  }
  res.status(200).json({
    status: true,
    message: "Team deleted successfully",
  });
  //   console.log(team);
});

//add a member to a team
exports.addMemberToTeam = catchAsync(async (req, res, next) => {
  const team = await Team.findById(req.params.id);
  if (!team) {
    return res.status(404).json({
      status: false,
      message: "Team not found",
    });
  }

  if (!team.creator.equals(req.user._id)) {
    return res
      .status(403)
      .json({ error: "Only the creator can add members to this team" });
  }

  const user = await User.findById(req.body.id);
  console.log(user);
  if (!user) {
    return res.status(404).json({
      status: false,
      message: "User not found",
    });
  }

  team.members.push(user._id);
  await team.save();

  res.status(200).json({
    status: true,
    message: "Member added successfully",
    data: {
      team,
    },
  });
});

//update a team
exports.updateTeam = catchAsync(async (req, res, next) => {
  const team = await Team.findById(req.params.id);

  if (!team) {
    return res.status(404).json({
      status: false,
      message: "Team not found",
    });
  }

  if (!team.creator.equals(req.user._id)) {
    return res
      .status(403)
      .json({ error: "Only the creator can update this team" });
  }

  // Update the team with new data
  const updatedTeam = await Team.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
  });

  res.status(200).json({
    status: true,
    message: "Team updated successfully",
    data: {
      team: updatedTeam,
    },
  });
});
