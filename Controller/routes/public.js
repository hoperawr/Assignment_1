const express = require("express");
const {
  login,
  createTask,
  getTaskByState,
  promoteTask2Done,
} = require("../controllers/public");

const router = express.Router({ mergeParams: true });
router.route("/login").post(login);
router.route("/createTask").post(createTask);
router.route("/getTaskByState").post(getTaskByState);
router.route("/promoteTask2Done").post(promoteTask2Done);

module.exports = router;
