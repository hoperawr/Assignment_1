const con = require("../models/model");
const { Checkgroup } = require("../public/Checkgroup");
const { Checkisactive } = require("../public/Checkisactive");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

/*
Post : login
*/
exports.login = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const response = await con
      .promise()
      .query(`SELECT password FROM accounts where username = '${username}'`);
    if (await bcrypt.compare(password, response[0][0].password)) {
      if (await Checkisactive(username)) {
        const token = jwt.sign(
          { username: username },
          process.env.TOKEN_SECRET,
          {
            expiresIn: "86400s",
          }
        );
        res.json({
          header: "Login successful",
          body: { token: token, username: username },
        });
      } else {
        throw new Error("Account not active");
      }
    } else {
      throw new Error("Wrong Password");
    }
  } catch (e) {
    console.log(e);
    res.status(401).json({ header: "Login failed" });
  }
};
