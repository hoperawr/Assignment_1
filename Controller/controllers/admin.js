const con = require("../models/model");
const { Checkgroup } = require("../public/Checkgroup");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });

/*
Post : updateUserAdmin
*/
exports.updateUserAdmin = async (req, res, next) => {
  try {
    if (req.body.username === "admin") {
      throw new Error("Cannot modify admin");
    }
    let updateAccountResult;
    if (req.body.password === "") {
      const updateEmailQuery = `update accounts set email="${req.body.email}", isActive=${req.body.isActive} where username="${req.body.username}"`;
      updateAccountResult = await con.promise().query(updateEmailQuery);
    } else {
      const hashed = await bcrypt.hash(
        `${req.body.password}`,
        parseInt(process.env.SALT_ROUNDS)
      );
      const updateAccountQuery = `update accounts set password="${hashed}", email="${req.body.email}", isActive=${req.body.isActive} where username="${req.body.username}"`;
      updateAccountResult = await con.promise().query(updateAccountQuery);
    }

    // Delete existing user groups
    if (!updateAccountResult.error) {
      const deleteGroupsQuery = `delete from user_groups where username="${req.body.username}"`;
      const deleteGroupsResult = await con.promise().query(deleteGroupsQuery);
      if (deleteGroupsResult.error) {
        // Handle group deletion error
        throw new Error("Error removing groups");
      }
    } else {
      throw new Error("Error updating account");
    }

    // Insert user into new groups
    await Promise.all(
      req.body.groups.map(async (group) => {
        const insertGroupQuery = `insert into user_groups (username, groupname) values ("${req.body.username}", "${group}")`;
        await con.promise().query(insertGroupQuery);
      })
    );
    res.json({
      header: `${req.body.username} details updated by ${req.decode.username}`,
    });
  } catch (error) {
    console.error(error);

    res.status(400).json({ header: error.message });
  }
};

/*
Get : getUsers
*/
exports.getUsers = async (req, res, next) => {
  const response = await con.promise().query("select username from accounts");
  const response_all_groups = await con
    .promise()
    .query("select groupname from tm_groups");
  const all_groups = response_all_groups[0].map((item) => item.groupname);
  res.json({
    header: "Success",
    body: { users: response[0], groups: all_groups },
  });
};

/*
Get : getUser
*/
exports.getUser = async (req, res, next) => {
  const username = req.query.username;
  const response = await con
    .promise()
    .query(`select * from accounts where username="${username}"`);
  const groups = await con
    .promise()
    .query(`select groupname from user_groups where username="${username}";`);
  const user_groups = groups[0].map((item) => item.groupname);
  res.json({
    header: "Success",
    body: { user: response[0][0], groups: user_groups },
  });
};

/*
Post: addUser
*/
exports.addUser = async (req, res, next) => {
  try {
    const hashed = await bcrypt.hash(
      `${req.body.password}`,
      parseInt(process.env.SALT_ROUNDS)
    );
    const userQuery = `
      INSERT INTO accounts (username, password, email, isActive)
      VALUES ("${req.body.username}", "${hashed}", "${req.body.email}", ${req.body.isActive});
    `;

    await Promise.all([
      con.promise().query(userQuery),
      Promise.all(
        req.body.groups.map((groupname) =>
          con
            .promise()
            .query(
              `INSERT INTO user_groups (username, groupname) VALUES ("${req.body.username}", "${groupname}")`
            )
        )
      ),
    ]);

    res.json({ header: "User added" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ header: "User already exists" });
  }
};

/*
Post : addGroup
*/
exports.addGroup = async (req, res, next) => {
  try {
    const addGroupQuery = `insert into tm_groups (groupname) values ("${req.body.group}")`;
    await con.promise().query(addGroupQuery);
    res.json({ header: "Group created" });
  } catch (error) {
    console.error(error);
    res.status(400).json({ header: "Group already exists" });
  }
};

/*
Get : checkAdmin
*/
exports.checkAdmin = async (req, res, next) => {
  res.json({ header: "Success" });
};
