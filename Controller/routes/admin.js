const express = require("express");
const {
  updateUserAdmin,
  addUser,
  getUsers,
  getUser,
  addGroup,
  checkAdmin,
} = require("../controllers/admin");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router({ mergeParams: true });
router.use(protect);
router.use(authorize("admin"));

router.route("/getUsers").get(getUsers);
router.route("/getUser").get(getUser);
router.route("/updateUser").post(updateUserAdmin);
router.route("/addUser").post(addUser);
router.route("/addGroup").post(addGroup);
router.route("/checkAdmin").get(checkAdmin);

module.exports = router;
