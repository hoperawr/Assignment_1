const express = require("express");
const {
  updateUser,
  checkLogin,
  getApps,
  getPlans,
  addApp,
  editApp,
  getGroups,
  getTasks,
  addTask,
  getAppsNames,
  addPlan,
  editPlan,
  getPlansNames,
  getUserGroups,
  handleOpenRelease,
  handleOpenUpdate,
  handleToDoUpdate,
  handleToDoAccept,
  handleDoingApproval,
  handleDoingExtension,
  handleDoingReturn,
  handleDoingUpdate,
  handleDoneApprove,
  handleDoneReassign,
  handleDoneReject,
  handleNewNote,
  viewNotes,
} = require("../controllers/user");
const { protect } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });
router.use(protect);

router.route("/update").post(updateUser);
router.route("/checkLogin").get(checkLogin);
router.route("/getApps").get(getApps);
router.route("/getAppsNames").get(getAppsNames);
router.route("/getPlans").get(getPlans);
router.route("/addApp").post(addApp);
router.route("/editApp").post(editApp);
router.route("/editPlan").post(editPlan);
router.route("/getGroups").get(getGroups);
router.route("/getTasks").get(getTasks);
router.route("/addTask").post(addTask);
router.route("/addPlan").post(addPlan);
router.route("/getPlansNames").get(getPlansNames);
router.route("/getUserGroups").get(getUserGroups);

router.route("/handleOpenRelease").post(handleOpenRelease);
router.route("/handleOpenUpdate").post(handleOpenUpdate);
router.route("/handleToDoUpdate").post(handleToDoUpdate);
router.route("/handleToDoAccept").post(handleToDoAccept);
router.route("/handleDoingApproval").post(handleDoingApproval);
router.route("/handleDoingExtension").post(handleDoingExtension);
router.route("/handleDoingReturn").post(handleDoingReturn);
router.route("/handleDoingUpdate").post(handleDoingUpdate);
router.route("/handleDoneApprove").post(handleDoneApprove);
router.route("/handleDoneReassign").post(handleDoneReassign);
router.route("/handleDoneReject").post(handleDoneReject);
router.route("/handleNewNote").post(handleNewNote);
router.route("/viewNotes").get(viewNotes);

module.exports = router;
