const con = require("../models/model");
const { Checkgroup } = require("../public/Checkgroup");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const sendEmail = require("../public/email");

/*
Post : updateUser
*/
exports.updateUser = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  try {
    if (username === "admin") {
      throw new Error("Cannot modify admin");
    } else if (email !== "" && password !== "") {
      const hashed = await bcrypt.hash(
        `${password}`,
        parseInt(process.env.SALT_ROUNDS)
      );
      con.query(
        `update accounts set password = '${hashed}', email='${email}' where username='${username}'`,
        async function (err, result) {
          if (err) {
            res.json({ header: "Error updating email and password" });
          } else {
            res.json({ header: "Password and Email updated" });
          }
        }
      );
    } else if (email !== "") {
      // only email
      con.query(
        `update accounts set email='${email}' where username='${username}'`,
        async function (err, result) {
          if (err) {
            res.json({ header: "Error updating email" });
          } else {
            res.json({ header: "Email updated" });
          }
        }
      );
    } else if (password !== "") {
      // only password
      const hashed = await bcrypt.hash(
        `${password}`,
        parseInt(process.env.SALT_ROUNDS)
      );
      con.query(
        `update accounts set password = '${hashed}' where username='${username}'`,
        async function (err, result) {
          if (err) {
            res.json({ header: "Error updating email" });
          } else {
            res.json({ header: "Password updated" });
          }
        }
      );
    } else {
      res.status(400).json({ header: "Fields are empty" });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({ header: e.message });
  }
};

exports.checkLogin = async (req, res, next) => {
  res.json({
    header: "Success",
    body: {
      username: req.decode.username,
    },
  });
};

exports.getApps = async (req, res, next) => {
  try {
    const getAppsQuery = `select * from application`;
    const response = await con.promise().query(getAppsQuery);
    res.json({ header: "Success", body: response[0] });
  } catch (e) {}
};

exports.getAppsNames = async (req, res, next) => {
  try {
    const getAppsQuery = `select app_acronym,app_permit_create,app_permit_open,app_permit_toDoList,app_permit_doing,app_permit_done from application`;
    const response = await con.promise().query(getAppsQuery);
    res.json({ header: "Success", body: response[0] });
  } catch (e) {
    console.log(e);
  }
};

exports.getPlansNames = async (req, res, next) => {
  try {
    const getPlansQuery = `select plan_mvp_name, plan_app_acronym, color from plan`;
    const response = await con.promise().query(getPlansQuery);
    res.json({ header: "Success", body: response[0] });
  } catch (e) {
    console.log(e);
  }
};

exports.getPlans = async (req, res, next) => {
  try {
    const getPlansQuery = `select * from plan where plan_app_acronym="${req.query.plan}"`;
    const response = await con.promise().query(getPlansQuery);

    res.json({ header: "Success", body: response[0] });
  } catch (e) {
    console.log(e.message);
  }
};

exports.addPlan = async (req, res, next) => {
  try {
    const checkGroupQuery = `SELECT EXISTS (
  SELECT 1
  FROM user_groups
  WHERE username = '${req.decode.username}' AND groupname = "Project Manager"
)`;
    const response = await con.promise().query(checkGroupQuery);

    if (Object.values(response[0][0])[0]) {
      const addPlansQuery = `insert into plan (plan_mvp_name,plan_startDate,plan_endDate,plan_app_acronym,color) VALUES ("${req.body.name}","${req.body.start}","${req.body.end}","${req.body.app}","${req.body.color}")`;
      const response_2 = await con.promise().query(addPlansQuery);
      res.json({ header: "Success" });
    } else {
      res.status(401).json({ header: "Not Authorized" });
    }
  } catch (e) {
    console.log(e.message);
    res.status(404).json({ header: e.message });
  }
};

exports.editPlan = async (req, res, next) => {
  try {
    const checkGroupQuery = `SELECT EXISTS (
  SELECT 1
  FROM user_groups
  WHERE username = '${req.decode.username}' AND groupname = "Project Manager"
)`;
    const response = await con.promise().query(checkGroupQuery);
    if (Object.values(response[0][0])[0]) {
      const editPlanQuery = `UPDATE plan set plan_startDate="${req.body.start}", plan_endDate="${req.body.end}", color="${req.body.color}" where plan_mvp_name="${req.body.plan}"`;
      const response_2 = await con.promise().query(editPlanQuery);
      res.json({ header: "Plan Edited" });
    } else {
      res.status(401).json({ header: "Not Authorized" });
    }
  } catch (e) {
    console.log(e);
    res.status(404).json({ header: e.message });
  }
};

exports.getGroups = async (req, res, next) => {
  try {
    const getPlansQuery = `select * from tm_groups`;
    const response = await con.promise().query(getPlansQuery);
    res.json({ header: "Success", body: response[0] });
  } catch (e) {
    console.log(e);
  }
};

exports.getUserGroups = async (req, res, next) => {
  try {
    const getUserGroupsQuery = `select groupname from user_groups where username="${req.decode.username}"`;
    const response = await con.promise().query(getUserGroupsQuery);
    res.json({ header: "Success", body: response[0] });
  } catch (e) {
    console.log(e);
  }
};

exports.addApp = async (req, res, next) => {
  try {
    const checkGroupQuery = `SELECT EXISTS (
  SELECT 1
  FROM user_groups
  WHERE username = '${req.decode.username}' AND groupname = "Project Lead"
)`;
    const response = await con.promise().query(checkGroupQuery);

    if (Object.values(response[0][0])[0]) {
      const addAppQuery = `insert into application (app_acronym, app_description, app_rnumber, app_startDate, app_endDate, app_permit_create,app_permit_open, app_permit_toDoList, app_permit_doing, app_permit_done) 
    VALUES ("${req.body.acronym}","${req.body.description}",${req.body.rnumber},"${req.body.start}","${req.body.end}","${req.body.create}","${req.body.open}","${req.body.toDo}","${req.body.doing}","${req.body.done}");`;
      const response_2 = await con.promise().query(addAppQuery);
      res.json({ header: "Application added" });
    } else {
      res.status(401).json({ header: "Not Authorized" });
    }
  } catch (e) {
    console.log(e);
    res.status(404).json({ header: e.message });
  }
};

exports.editApp = async (req, res, next) => {
  try {
    const checkGroupQuery = `SELECT EXISTS (
  SELECT 1
  FROM user_groups
  WHERE username = '${req.decode.username}' AND groupname = "Project Lead"
)`;
    const response = await con.promise().query(checkGroupQuery);

    if (Object.values(response[0][0])[0]) {
      const editAppQuery = `UPDATE application set app_description="${req.body.description}",app_startDate="${req.body.start}",app_endDate="${req.body.end}",app_permit_create="${req.body.create}",app_permit_open="${req.body.open}", app_permit_toDoList="${req.body.toDo}", app_permit_doing="${req.body.doing}", app_permit_done="${req.body.done}" where app_acronym="${req.body.acronym}"`;
      const response_2 = await con.promise().query(editAppQuery);
      res.json({ header: "Application Edited" });
    } else {
      res.status(401).json({ header: "Not Authorized" });
    }
  } catch (e) {
    console.log(e);
    res.status(404).json({ header: e.message });
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    let getTasksQuery;
    if (req.query.plan === undefined) {
      getTasksQuery = `select * from task where Task_app_Acronym="${req.query.app}"`;
    } else {
      getTasksQuery = `select * from task where Task_plan="${req.query.plan}" and Task_app_Acronym="${req.query.app}"`;
    }
    const response = await con.promise().query(getTasksQuery);
    res.json({ header: "Success", body: response[0] });
  } catch (e) {}
};

exports.addTask = async (req, res, next) => {
  try {
    const rquery = `select app_rnumber from application where app_acronym="${req.body.app}"`;
    const response_1 = await con.promise().query(rquery);
    const rnumber = response_1[0][0].app_rnumber;
    const task_id = `${req.body.app}_` + rnumber;
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    let addTaskQuery;
    if (req.body.plan === "") {
      addTaskQuery = `INSERT INTO task (
  task_name,
  task_description,
  task_id,
  task_plan,
  task_app_acronym,
  task_state,
  task_creator,
  task_owner,
  task_createDate
)
VALUES ("${req.body.name}","${req.body.description}","${task_id}",NULL,"${req.body.app}","${req.body.state}","${req.body.creator}","${req.decode.username}","${formattedDate}")`;
    } else {
      addTaskQuery = `INSERT INTO task (
  task_name,
  task_description,
  task_id,
  task_plan,
  task_app_acronym,
  task_state,
  task_creator,
  task_owner,
  task_createDate
)
VALUES ("${req.body.name}","${req.body.description}","${task_id}","${req.body.plan}","${req.body.app}","${req.body.state}","${req.body.creator}","${req.decode.username}","${formattedDate}")`;
    }

    const response_3 = await con.promise().query(addTaskQuery);
    //update rnumber
    const new_r = rnumber + 1;
    const rquery_2 = `update application set app_rnumber=${new_r} where app_acronym="${req.body.app}"`;
    const response_2 = await con.promise().query(rquery_2);
    // add to note audit trails
    let addNoteQuery;
    const formattedTime = now.toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    if (req.body.note !== "") {
      addNoteQuery = `INSERT INTO notes_audit (task_id, username, note, state,created_at)
VALUES ("${task_id}","${req.decode.username}", "${req.body.note}", "-","${formattedTime}")`;
    } else {
      addNoteQuery = `INSERT INTO notes_audit (task_id, username, note, state,created_at)
VALUES ("${task_id}","${req.decode.username}", "Task Created", "-","${formattedTime}")`;
    }

    const response_4 = await con.promise().query(addNoteQuery);
    res.json({ header: "Task Created" });
  } catch (e) {
    console.log(e.message);
    res.status(404).json({ header: e.message });
  }
};

exports.handleOpenRelease = async (req, res, next) => {
  try {
    const checkGroupQuery = `SELECT EXISTS (
  SELECT 1
  FROM user_groups u
  INNER JOIN application a ON u.groupname = a.app_permit_open
  WHERE u.username = '${req.decode.username}' AND a.app_acronym = '${req.body.app_acronym}'
)`;
    const response = await con.promise().query(checkGroupQuery);

    if (Object.values(response[0][0])[0]) {
      const changeStateQuery = `UPDATE task set task_state="ToDo",task_owner="${req.decode.username}" where task_id="${req.body.task_id}"`;
      const response_2 = await con.promise().query(changeStateQuery);
    } else {
      throw new Error("Not authorized");
    }

    let addNoteQuery;
    const now = new Date();
    const formattedTime = now.toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    if (req.body.note !== "") {
      addNoteQuery = `INSERT INTO notes_audit (task_id, username, note, state,created_at)
VALUES ("${req.body.task_id}","${req.decode.username}", "${req.body.note}", "${req.body.state}","${formattedTime}")`;
    } else {
      addNoteQuery = `INSERT INTO notes_audit (task_id, username, note, state,created_at)
VALUES ("${req.body.task_id}","${req.decode.username}", "Task Released", "${req.body.state}","${formattedTime}")`;
    }

    const response_4 = await con.promise().query(addNoteQuery);
    res.json({ header: "Task Released" });
  } catch (e) {
    console.log(e);
    res.status(401).json({ header: e.message });
  }
};

exports.handleOpenUpdate = async (req, res, next) => {
  try {
    const checkGroupQuery = `SELECT EXISTS (
  SELECT 1
  FROM user_groups u
  INNER JOIN application a ON u.groupname = a.app_permit_open
  WHERE u.username = '${req.decode.username}' AND a.app_acronym = '${req.body.app_acronym}'
)`;
    const response = await con.promise().query(checkGroupQuery);
    if (Object.values(response[0][0])[0]) {
      let changeStateQuery;
      if (req.body.plan === "") {
        changeStateQuery = `UPDATE task set task_description="${req.body.description}",task_owner="${req.decode.username}" where task_id="${req.body.task_id}"`;
      } else {
        changeStateQuery = `UPDATE task set task_description="${req.body.description}",task_plan="${req.body.plan}",task_owner="${req.decode.username}" where task_id="${req.body.task_id}"`;
      }
      const response_2 = await con.promise().query(changeStateQuery);

      let addNoteQuery;
      const now = new Date();
      const formattedTime = now.toLocaleString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      if (req.body.note !== "") {
        addNoteQuery = `INSERT INTO notes_audit (task_id, username, note, state,created_at)
VALUES ("${req.body.task_id}","${req.decode.username}", "${req.body.note}", "${req.body.state}","${formattedTime}")`;
      } else {
        addNoteQuery = `INSERT INTO notes_audit (task_id, username, note, state,created_at)
VALUES ("${req.body.task_id}","${req.decode.username}", "Task Updated", "${req.body.state}","${formattedTime}")`;
      }

      const response_4 = await con.promise().query(addNoteQuery);
      res.json({ header: "Task Updated" });
    } else {
      throw new Error("Not authorized");
    }
  } catch (e) {
    console.log(e);
    res.status(401).json({ header: e.message });
  }
};
exports.handleToDoUpdate = async (req, res, next) => {
  try {
    const checkGroupQuery = `SELECT EXISTS (
  SELECT 1
  FROM user_groups u
  INNER JOIN application a ON u.groupname = a.app_permit_todolist
  WHERE u.username = '${req.decode.username}' AND a.app_acronym = '${req.body.app_acronym}'
)`;
    const response = await con.promise().query(checkGroupQuery);
    if (Object.values(response[0][0])[0]) {
      const changeStateQuery = `UPDATE task set task_description="${req.body.description}",task_owner="${req.decode.username}" where task_id="${req.body.task_id}"`;
      const response_2 = await con.promise().query(changeStateQuery);
      let addNoteQuery;
      const now = new Date();
      const formattedTime = now.toLocaleString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      if (req.body.note !== "") {
        addNoteQuery = `INSERT INTO notes_audit (task_id, username, note, state,created_at)
VALUES ("${req.body.task_id}","${req.decode.username}", "${req.body.note}", "${req.body.state}","${formattedTime}")`;
      } else {
        addNoteQuery = `INSERT INTO notes_audit (task_id, username, note, state,created_at)
VALUES ("${req.body.task_id}","${req.decode.username}", "Task Updated", "${req.body.state}","${formattedTime}")`;
      }

      const response_4 = await con.promise().query(addNoteQuery);

      res.json({ header: "Task Updated" });
    } else {
      throw new Error("Not authorized");
    }
  } catch (e) {
    console.log(e);
    res.status(401).json({ header: e.message });
  }
};

exports.handleToDoAccept = async (req, res, next) => {
  try {
    const checkGroupQuery = `SELECT EXISTS (
  SELECT 1
  FROM user_groups u
  INNER JOIN application a ON u.groupname = a.app_permit_todolist
  WHERE u.username = '${req.decode.username}' AND a.app_acronym = '${req.body.app_acronym}'
)`;
    const response = await con.promise().query(checkGroupQuery);
    if (Object.values(response[0][0])[0]) {
      const changeStateQuery = `UPDATE task set task_state="Doing",task_owner="${req.decode.username}" where task_id="${req.body.task_id}"`;
      const response_2 = await con.promise().query(changeStateQuery);
      res.json({ header: "Task Accepted" });
      let addNoteQuery;
      const now = new Date();
      const formattedTime = now.toLocaleString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      if (req.body.note !== "") {
        addNoteQuery = `INSERT INTO notes_audit (task_id, username, note, state,created_at)
VALUES ("${req.body.task_id}","${req.decode.username}", "${req.body.note}", "${req.body.state}","${formattedTime}")`;
      } else {
        addNoteQuery = `INSERT INTO notes_audit (task_id, username, note, state,created_at)
VALUES ("${req.body.task_id}","${req.decode.username}", "Task Accepted", "${req.body.state}","${formattedTime}")`;
      }

      const response_4 = await con.promise().query(addNoteQuery);
    } else {
      throw new Error("Not authorized");
    }
  } catch (e) {
    console.log(e);
    res.status(401).json({ header: e.message });
  }
};
exports.handleDoingApproval = async (req, res, next) => {
  try {
    const checkGroupQuery = `SELECT EXISTS (
  SELECT 1
  FROM user_groups u
  INNER JOIN application a ON u.groupname = a.app_permit_doing
  WHERE u.username = '${req.decode.username}' AND a.app_acronym = '${req.body.app_acronym}'
)`;
    const response = await con.promise().query(checkGroupQuery);
    if (Object.values(response[0][0])[0]) {
      const changeStateQuery = `UPDATE task set task_state="Done",task_owner="${req.decode.username}" where task_id="${req.body.task_id}"`;
      const response_2 = await con.promise().query(changeStateQuery);
      // SEND EMAIL
      const getEmailsQuery = `select a.email from application app inner join user_groups u on app.app_acronym = "${req.body.app_acronym}" and app.app_permit_done = u.groupname inner join accounts a on a.username = u.username`;
      const response_3 = await con.promise().query(getEmailsQuery);

      const message = `A task has been promoted to "Done" state.\n\nTask Name: ${req.body.task_name}\nTask ID: ${req.body.task_id} \nApplication: ${req.body.app_acronym}\nPlan: ${req.body.plan}\nPerformed by: ${req.decode.username}\n\nThis is an auto-generated email please do not reply.`;
      for (email of response_3[0].map((x) => x.email)) {
        if (email !== "") {
          sendEmail({
            email: email,
            subject: `Task ${req.body.task_id} promoted to "Done" state`,
            message: message,
          });
        }
      }
      let addNoteQuery;
      const now = new Date();
      const formattedTime = now.toLocaleString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      if (req.body.note !== "") {
        addNoteQuery = `INSERT INTO notes_audit (task_id, username, note, state,created_at)
VALUES ("${req.body.task_id}","${req.decode.username}", "${req.body.note}", "${req.body.state}","${formattedTime}")`;
      } else {
        addNoteQuery = `INSERT INTO notes_audit (task_id, username, note, state,created_at)
VALUES ("${req.body.task_id}","${req.decode.username}", "Task seeking closure approval", "${req.body.state}","${formattedTime}")`;
      }

      const response_4 = await con.promise().query(addNoteQuery);
      res.json({ header: "Task seeking closure approval" });
    } else {
      throw new Error("Not authorized");
    }
  } catch (e) {
    console.log(e);
    res.status(401).json({ header: e.message });
  }
};
exports.handleDoingExtension = async (req, res, next) => {
  try {
    const checkGroupQuery = `SELECT EXISTS (
  SELECT 1
  FROM user_groups u
  INNER JOIN application a ON u.groupname = a.app_permit_doing
  WHERE u.username = '${req.decode.username}' AND a.app_acronym = '${req.body.app_acronym}'
)`;
    const response = await con.promise().query(checkGroupQuery);
    if (Object.values(response[0][0])[0]) {
      const changeStateQuery = `UPDATE task set task_state="Done",task_owner="${req.decode.username}" where task_id="${req.body.task_id}"`;
      const response_2 = await con.promise().query(changeStateQuery);
      // SEND EMAIL
      const getEmailsQuery = `select a.email from application app inner join user_groups u on app.app_acronym = "${req.body.app_acronym}" and app.app_permit_done = u.groupname inner join accounts a on a.username = u.username`;
      const response_3 = await con.promise().query(getEmailsQuery);

      const message = `A task is requesting extension and has been promoted to "Done" state.\n\nTask Name: ${req.body.task_name}\nTask ID: ${req.body.task_id} \nApplication: ${req.body.app_acronym}\nPlan: ${req.body.plan}\nPerformed by: ${req.decode.username}\n\nThis is an auto-generated email please do not reply.`;
      for (email of response_3[0].map((x) => x.email)) {
        await sendEmail({
          email: email,
          subject: `Task ${req.body.task_id} is requesting extension and promoted to "Done" state`,
          message: message,
        });
      }
      let addNoteQuery;
      const now = new Date();
      const formattedTime = now.toLocaleString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      if (req.body.note !== "") {
        addNoteQuery = `INSERT INTO notes_audit (task_id, username, note, state,created_at)
VALUES ("${req.body.task_id}","${req.decode.username}", "${req.body.note}", "${req.body.state}","${formattedTime}")`;
      } else {
        addNoteQuery = `INSERT INTO notes_audit (task_id, username, note, state,created_at)
VALUES ("${req.body.task_id}","${req.decode.username}", "Task requesting extension", "${req.body.state}","${formattedTime}")`;
      }

      const response_4 = await con.promise().query(addNoteQuery);
      res.json({ header: "Task Requesting Extension" });
    } else {
      throw new Error("Not authorized");
    }
  } catch (e) {
    console.log(e);
    res.status(401).json({ header: e.message });
  }
};
exports.handleDoingReturn = async (req, res, next) => {
  try {
    const checkGroupQuery = `SELECT EXISTS (
  SELECT 1
  FROM user_groups u
  INNER JOIN application a ON u.groupname = a.app_permit_doing
  WHERE u.username = '${req.decode.username}' AND a.app_acronym = '${req.body.app_acronym}'
)`;
    const response = await con.promise().query(checkGroupQuery);
    if (Object.values(response[0][0])[0]) {
      const changeStateQuery = `UPDATE task set task_state="ToDo",task_owner="${req.decode.username}" where task_id="${req.body.task_id}"`;
      const response_2 = await con.promise().query(changeStateQuery);
      let addNoteQuery;
      const now = new Date();
      const formattedTime = now.toLocaleString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      if (req.body.note !== "") {
        addNoteQuery = `INSERT INTO notes_audit (task_id, username, note, state,created_at)
VALUES ("${req.body.task_id}","${req.decode.username}", "${req.body.note}", "${req.body.state}","${formattedTime}")`;
      } else {
        addNoteQuery = `INSERT INTO notes_audit (task_id, username, note, state,created_at)
VALUES ("${req.body.task_id}","${req.decode.username}", "Task Returned", "${req.body.state}","${formattedTime}")`;
      }

      const response_4 = await con.promise().query(addNoteQuery);
      res.json({ header: "Task Returned" });
    } else {
      throw new Error("Not authorized");
    }
  } catch (e) {
    console.log(e);
    res.status(401).json({ header: e.message });
  }
};
exports.handleDoingUpdate = async (req, res, next) => {
  try {
    const checkGroupQuery = `SELECT EXISTS (
  SELECT 1
  FROM user_groups u
  INNER JOIN application a ON u.groupname = a.app_permit_doing
  WHERE u.username = '${req.decode.username}' AND a.app_acronym = '${req.body.app_acronym}'
)`;
    const response = await con.promise().query(checkGroupQuery);
    if (Object.values(response[0][0])[0]) {
      const changeStateQuery = `UPDATE task set task_description="${req.body.description}",task_owner="${req.decode.username}" where task_id="${req.body.task_id}"`;
      const response_2 = await con.promise().query(changeStateQuery);
      let addNoteQuery;
      const now = new Date();
      const formattedTime = now.toLocaleString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      if (req.body.note !== "") {
        addNoteQuery = `INSERT INTO notes_audit (task_id, username, note, state,created_at)
VALUES ("${req.body.task_id}","${req.decode.username}", "${req.body.note}", "${req.body.state}","${formattedTime}")`;
      } else {
        addNoteQuery = `INSERT INTO notes_audit (task_id, username, note, state,created_at)
VALUES ("${req.body.task_id}","${req.decode.username}", "Task Updated", "${req.body.state}","${formattedTime}")`;
      }

      const response_4 = await con.promise().query(addNoteQuery);

      res.json({ header: "Success" });
    } else {
      throw new Error("Not authorized");
    }
  } catch (e) {
    console.log(e);
    res.status(401).json({ header: e.message });
  }
};
exports.handleDoneApprove = async (req, res, next) => {
  try {
    const checkGroupQuery = `SELECT EXISTS (
  SELECT 1
  FROM user_groups u
  INNER JOIN application a ON u.groupname = a.app_permit_done
  WHERE u.username = '${req.decode.username}' AND a.app_acronym = '${req.body.app_acronym}'
)`;
    const response = await con.promise().query(checkGroupQuery);
    if (Object.values(response[0][0])[0]) {
      const changeStateQuery = `UPDATE task set task_state="Close",task_owner="${req.decode.username}" where task_id="${req.body.task_id}"`;
      const response_2 = await con.promise().query(changeStateQuery);
      let addNoteQuery;
      const now = new Date();
      const formattedTime = now.toLocaleString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      if (req.body.note !== "") {
        addNoteQuery = `INSERT INTO notes_audit (task_id, username, note, state,created_at)
VALUES ("${req.body.task_id}","${req.decode.username}", "${req.body.note}", "${req.body.state}","${formattedTime}")`;
      } else {
        addNoteQuery = `INSERT INTO notes_audit (task_id, username, note, state,created_at)
VALUES ("${req.body.task_id}","${req.decode.username}", "Task Approved", "${req.body.state}","${formattedTime}")`;
      }

      const response_4 = await con.promise().query(addNoteQuery);
      res.json({ header: "Success" });
    } else {
      throw new Error("Not authorized");
    }
  } catch (e) {
    console.log(e);
    res.status(401).json({ header: e.message });
  }
};
exports.handleDoneReassign = async (req, res, next) => {
  try {
    const checkGroupQuery = `SELECT EXISTS (
  SELECT 1
  FROM user_groups u
  INNER JOIN application a ON u.groupname = a.app_permit_done
  WHERE u.username = '${req.decode.username}' AND a.app_acronym = '${req.body.app_acronym}'
)`;
    const response = await con.promise().query(checkGroupQuery);
    if (Object.values(response[0][0])[0]) {
      let changeStateQuery;
      if (req.body.plan === "") {
        changeStateQuery = `UPDATE task set task_state="Doing",task_owner="${req.decode.username}",task_plan=NULL where task_id="${req.body.task_id}"`;
      } else {
        changeStateQuery = `UPDATE task set task_state="Doing",task_owner="${req.decode.username}",task_plan="${req.body.plan}" where task_id="${req.body.task_id}"`;
      }

      const response_2 = await con.promise().query(changeStateQuery);
      let addNoteQuery;
      const now = new Date();
      const formattedTime = now.toLocaleString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      if (req.body.note !== "") {
        addNoteQuery = `INSERT INTO notes_audit (task_id, username, note, state,created_at)
VALUES ("${req.body.task_id}","${req.decode.username}", "${req.body.note}", "${req.body.state}","${formattedTime}")`;
      } else {
        if (req.body.plan === "") {
          addNoteQuery = `INSERT INTO notes_audit (task_id, username, note, state,created_at)
VALUES ("${req.body.task_id}","${req.decode.username}", "Task Reassigned", "${req.body.state}","${formattedTime}")`;
        } else {
          addNoteQuery = `INSERT INTO notes_audit (task_id, username, note, state,created_at)
VALUES ("${req.body.task_id}","${req.decode.username}", "Task Reassigned to ${req.body.plan}", "${req.body.state}","${formattedTime}")`;
        }
      }

      const response_4 = await con.promise().query(addNoteQuery);
      res.json({ header: "Success" });
    } else {
      throw new Error("Not authorized");
    }
  } catch (e) {
    console.log(e);
    res.status(401).json({ header: e.message });
  }
};
exports.handleDoneReject = async (req, res, next) => {
  try {
    const checkGroupQuery = `SELECT EXISTS (
  SELECT 1
  FROM user_groups u
  INNER JOIN application a ON u.groupname = a.app_permit_done
  WHERE u.username = '${req.decode.username}' AND a.app_acronym = '${req.body.app_acronym}'
)`;
    const response = await con.promise().query(checkGroupQuery);
    if (Object.values(response[0][0])[0]) {
      const changeStateQuery = `UPDATE task set task_state="Doing",task_owner="${req.decode.username}" where task_id="${req.body.task_id}"`;
      const response_2 = await con.promise().query(changeStateQuery);
      let addNoteQuery;
      const now = new Date();
      const formattedTime = now.toLocaleString("en-GB", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      if (req.body.note !== "") {
        addNoteQuery = `INSERT INTO notes_audit (task_id, username, note, state,created_at)
VALUES ("${req.body.task_id}","${req.decode.username}", "${req.body.note}", "${req.body.state}","${formattedTime}")`;
      } else {
        addNoteQuery = `INSERT INTO notes_audit (task_id, username, note, state,created_at)
VALUES ("${req.body.task_id}","${req.decode.username}", "Task Rejected", "${req.body.state}","${formattedTime}")`;
      }

      const response_4 = await con.promise().query(addNoteQuery);
      res.json({ header: "Success" });
    } else {
      throw new Error("Not authorized");
    }
  } catch (e) {
    console.log(e);
    res.status(401).json({ header: e.message });
  }
};

exports.handleNewNote = async (req, res, next) => {
  try {
    const now = new Date();
    const formattedTime = now.toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const sql = `INSERT INTO notes_audit (task_id, username, note, state, created_at)
                 VALUES (?, ?, ?, ?, ?)`;
    const values = [
      req.body.task_id,
      req.decode.username,
      req.body.note,
      req.body.state,
      formattedTime,
    ];
    const [response_4] = await con.promise().execute(sql, values);

    res.json({ header: "Success" });
  } catch (e) {
    console.error(e);
    res.status(404).json({ header: e.message });
  }
};

exports.viewNotes = async (req, res, next) => {
  try {
    const getNotesQuery = `SELECT * from notes_audit where task_id="${req.query.task_id}";`;
    const response = await con.promise().query(getNotesQuery);
    res.json({ header: "Success", body: response[0] });
  } catch (e) {
    console.log(e);
    res.status(404).json({ header: e.message });
  }
};
