const express = require("express");
const { login } = require("../controllers/public");

const router = express.Router({ mergeParams: true });

router.route("/login").post(login);
module.exports = router;
