const express = require("express");
const jwtFilter = require("../middlewares/requestFilter");
const teamController = require("../controllers/teamController");

const router = express.Router();
//READ
router.get("/teams", jwtFilter.checkRequest, teamController.getAllTeams);
router.get("/team/:id", jwtFilter.checkRequest, teamController.getTeamById);

//CREATE
router.post(
  "/team/create-team",
  jwtFilter.checkRequest,
  teamController.createTeam
);
router.post(
  "/team/add-member/:id",
  jwtFilter.checkRequest,
  teamController.addMemberToTeam
);

//UPDATE
router.patch(
  "/team/update-team/:id",
  jwtFilter.checkRequest,
  teamController.updateTeam
);

//DELETE
router.delete(
  "/team/delete-team/:id",
  jwtFilter.checkRequest,
  teamController.deleteTeam
);
module.exports = router;
