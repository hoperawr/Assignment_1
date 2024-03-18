const con = require("../models/model");
const { Checkgroup } = require("../public/Checkgroup");
const { Checkisactive } = require("../public/Checkisactive");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const jwt = require("jsonwebtoken");

exports.protect = async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      res
        .status(400)
        .json({ header: "Token missing", body: { active: false } });
      return;
    }
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    req.decode = decoded;

    if (await Checkisactive(req.decode.username)) {
      next();
    } else {
      res
        .status(400)
        .json({ header: "Authentication Error", body: { active: false } });
      return;
    }
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .json({ header: "Authentication Error", body: { active: true } });
    return;
  }
};

exports.authorize = (role) => async (req, res, next) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) {
      console.log("Token is empty");
      return res
        .status(400)
        .json({ header: "Token is empty", body: { active: false } });
    }
    if (await Checkisactive(req.decode.username)) {
      if (await Checkgroup(req.decode.username, role)) {
        next();
      } else {
        res
          .status(401)
          .json({ header: "Not authorized", body: { active: true } });
      }
    } else {
      res
        .status(401)
        .json({ header: "Not authorized", body: { active: false } });
    }
  } catch (error) {
    console.log(error);
    res.status(401).json({ header: "Authorization Error" });
  }
};
