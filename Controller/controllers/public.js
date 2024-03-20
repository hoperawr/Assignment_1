const con = require("../models/model");
const { Checkgroup } = require("../public/Checkgroup");
const { Checkisactive } = require("../public/Checkisactive");
const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendEmail = require("../public/email");

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

exports.createTask = async (req, res, next) => {
  try {
    /// first check URL syntax no extra parameters
    if (Object.keys(req.query).length !== 0) {
      throw new Error("U1");
    }
    /// next check payload structure eg mandatory fields
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.task_name;
    const app = req.body.application;
    const plan = req.body.plan;
    const desc = req.body.description || "";
    const note = req.body.note || "";

    if (
      username === undefined ||
      password === undefined ||
      name === undefined ||
      app === undefined
    ) {
      throw new Error("P1");
    }

    if (name.length > 255 || desc.length > 65535 || note.length > 65535) {
      throw new Error("P2");
    }
    Object.values(req.body).forEach((x) => {
      if (typeof x !== "string") {
        throw new Error("P3");
      }
    });
    // check credentials login and is active
    const response = await con
      .promise()
      .execute("SELECT password FROM accounts WHERE username = ?", [username]);
    if (
      response[0][0] === undefined ||
      !(await bcrypt.compare(password, response[0][0].password))
    ) {
      throw new Error("C1");
    }
    if (!(await Checkisactive(username))) {
      throw new Error("C1");
    }
    // check if app exists
    const checkAppQuery = `select EXISTS (SELECT 1 FROM application where app_acronym=?)`;
    const response_last = await con.promise().execute(checkAppQuery, [app]);
    if (!Object.values(response_last[0][0])[0]) {
      throw new Error("T1");
    }

    // check access rights
    const checkGroupQuery = `SELECT EXISTS (
  SELECT 1
  FROM user_groups u
  INNER JOIN application a ON u.groupname = a.app_permit_create
  WHERE u.username = ? AND a.app_acronym = ?
)`;
    const response_1 = await con
      .promise()
      .execute(checkGroupQuery, [username, app]);
    if (!Object.values(response_1[0][0])[0]) {
      throw new Error("A1");
    }
    //transaction
    // check plan exists
    if (plan !== undefined) {
      const checkPlanQuery = `select EXISTS (SELECT 1 FROM plan where plan_MVP_name=?)`;
      const response_2 = await con.promise().execute(checkPlanQuery, [plan]);
      if (!Object.values(response_2[0][0])[0]) {
        throw new Error("T2");
      }
      // check plan part of app
      const checkPlan2Query = `select EXISTS (SELECT 1 FROM plan where plan_MVP_name=? and plan_app_acronym=?)`;
      const response_3 = await con
        .promise()
        .execute(checkPlan2Query, [plan, app]);
      if (!Object.values(response_3[0][0])[0]) {
        throw new Error("T3");
      }
    }
    // get r number
    const rquery = `select app_rnumber from application where app_acronym=?`;
    const response_4 = await con.promise().execute(rquery, [app]);
    const rnumber = response_4[0][0].app_rnumber;
    // set date
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    // add to task
    const task_id = `${app}_` + rnumber;

    let addTaskQuery;
    if (plan === undefined) {
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
VALUES (?,?,?,?,?,?,?,?,?)`;
      const response_5 = await con
        .promise()
        .execute(addTaskQuery, [
          name,
          desc,
          task_id,
          null,
          app,
          "Open",
          username,
          username,
          formattedDate,
        ]);
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
VALUES (?,?,?,?,?,?,?,?,?)`;
      const response_5 = await con
        .promise()
        .execute(addTaskQuery, [
          name,
          desc,
          task_id,
          plan,
          app,
          "Open",
          username,
          username,
          formattedDate,
        ]);
    }
    // increase r number
    const new_r = rnumber + 1;
    const rquery_2 = `update application set app_rnumber=? where app_acronym=?`;
    const response_6 = await con.promise().query(rquery_2, [new_r, app]);
    // add to notes
    let addNoteQuery;
    const formattedTime = now.toLocaleString("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    if (note !== "") {
      addNoteQuery = `INSERT INTO notes_audit (task_id, username, note, state,created_at)
VALUES (?,?,?,?,?)`;
      const response_7 = await con
        .promise()
        .execute(addNoteQuery, [task_id, username, note, "-", formattedTime]);
    } else {
      addNoteQuery = `INSERT INTO notes_audit (task_id, username, note, state,created_at)
VALUES (?,?,?,?,?)`;
      const response_7 = await con
        .promise()
        .execute(addNoteQuery, [
          task_id,
          username,
          "Task Created",
          "-",
          formattedTime,
        ]);
    }
    // return task_id
    res.json({ code: "S1", task_id: task_id });
  } catch (e) {
    if (e.code === "ER_DATA_TOO_LONG" || e.code === 1406) {
      res.json({ code: "P2" });
    } else {
      console.log(e);
      res.json({ code: e.message });
    }
  }
};

exports.getTaskByState = async (req, res, next) => {
  try {
    /// first check URL syntax no extra parameters
    if (Object.keys(req.query).length !== 0) {
      throw new Error("U1");
    }
    /// next check payload structure eg mandatory fields
    const username = req.body.username;
    const password = req.body.password;
    const pre_state = req.body.state;
    const app = req.body.application;
    const plan = req.body.plan;
    if (
      username === undefined ||
      password === undefined ||
      app === undefined ||
      pre_state === undefined
    ) {
      throw new Error("P1");
    }
    Object.values(req.body).forEach((x) => {
      if (typeof x !== "string") {
        throw new Error("P3");
      }
    });
    // check credentials login and is active
    const response = await con
      .promise()
      .execute(`SELECT password FROM accounts where username = ?`, [username]);
    if (
      response[0][0] === undefined ||
      !(await bcrypt.compare(password, response[0][0].password))
    ) {
      throw new Error("C1");
    }
    if (!(await Checkisactive(username))) {
      throw new Error("C1");
    }

    // check if app exists
    const checkAppQuery = `select EXISTS (SELECT 1 FROM application where app_acronym=?)`;
    const response_last = await con.promise().execute(checkAppQuery, [app]);
    if (!Object.values(response_last[0][0])[0]) {
      throw new Error("T1");
    }
    // check plan exists and is part of application
    if (plan !== undefined) {
      const checkPlanQuery = `select EXISTS (SELECT 1 FROM plan where plan_MVP_name=?)`;
      const response_2 = await con.promise().execute(checkPlanQuery, [plan]);
      if (!Object.values(response_2[0][0])[0]) {
        throw new Error("T2");
      }

      // check plan part of app
      const checkPlan2Query = `select EXISTS (SELECT 1 FROM plan where plan_MVP_name=? and plan_app_acronym=?)`;
      const response_3 = await con
        .promise()
        .execute(checkPlan2Query, [plan, app]);
      if (!Object.values(response_3[0][0])[0]) {
        throw new Error("T3");
      }
    }
    // check state exists
    if (!["open", "todo", "doing", "done", "close"].includes(pre_state)) {
      throw new Error("T4");
    }
    const state = convertStateForward(pre_state);

    // transaction
    let getTasksQuery;
    let response_4;
    if (plan === undefined) {
      getTasksQuery = `select * from task where Task_app_Acronym=? and task_state=?`;
      response_4 = await con.promise().execute(getTasksQuery, [app, state]);
    } else {
      getTasksQuery = `select * from task where Task_plan=? and Task_app_Acronym=? and task_state=?`;
      response_4 = await con
        .promise()
        .execute(getTasksQuery, [plan, app, state]);
    }
    response_4[0].map(
      (x) => (x.task_state = convertStateBackward(x.task_state))
    );
    res.json({ code: "S1", data: response_4[0] });
  } catch (e) {
    if (e.code === "ER_DATA_TOO_LONG" || e.code === 1406) {
      res.json({ code: "P2" });
    } else {
      console.log(e);
      res.json({ code: e.message });
    }
  }
};

exports.promoteTask2Done = async (req, res, next) => {
  try {
    /// first check URL syntax no extra parameters
    if (Object.keys(req.query).length !== 0) {
      throw new Error("U1");
    }
    /// next check payload structure eg mandatory fields
    const username = req.body.username;
    const password = req.body.password;
    const id = req.body.task_id;
    const note = req.body.note || "";
    if (username === undefined || password === undefined || id === undefined) {
      throw new Error("P1");
    }
    Object.values(req.body).forEach((x) => {
      if (typeof x !== "string") {
        throw new Error("P3");
      }
    });
    // check credentials login and is active
    const response = await con
      .promise()
      .execute(`SELECT password FROM accounts where username = ?`, [username]);
    if (
      response[0][0] === undefined ||
      !(await bcrypt.compare(password, response[0][0].password))
    ) {
      throw new Error("C1");
    }
    if (!(await Checkisactive(username))) {
      throw new Error("C1");
    }
    // get app
    // TASK ID
    const getAppQuery = `select task_app_acronym from task where task_id=?`;
    const app = await con.promise().execute(getAppQuery, [id]);
    if (app[0].length === 0) {
      throw new Error("T5");
    }
    // check access rights
    const checkGroupQuery = `SELECT EXISTS (
  SELECT 1
  FROM user_groups u
  INNER JOIN application a ON u.groupname = a.app_permit_doing
  WHERE u.username = ? AND a.app_acronym = ?
)`;
    const response_1 = await con
      .promise()
      .execute(checkGroupQuery, [username, app[0][0].task_app_acronym]);
    if (!Object.values(response_1[0][0])[0]) {
      throw new Error("A1");
    }
    // transaction
    const checkTaskQuery = `select task_state from task where task_id=?`;
    const response_2 = await con.promise().execute(checkTaskQuery, [id]);
    if (response_2[0][0].task_state !== "Doing") {
      throw new Error("T6");
    }
    const changeStateQuery = `UPDATE task set task_owner=?,task_state=? where task_id=?`;
    const response_3 = await con
      .promise()
      .execute(changeStateQuery, [username, "Done", id]);
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
VALUES (?,?,?,?,?)`;
      const response_4 = await con
        .promise()
        .execute(addNoteQuery, [id, username, note, "Doing", formattedTime]);
    } else {
      addNoteQuery = `INSERT INTO notes_audit (task_id, username, note, state,created_at)
VALUES (?,?,?,?,?)`;
      const response_4 = await con
        .promise()
        .execute(addNoteQuery, [
          id,
          username,
          "Task Updated",
          "Doing",
          formattedTime,
        ]);
    }
    //send email
    const getEmailsQuery = `select a.email from application app inner join user_groups u on app.app_acronym = "${app[0][0].task_app_acronym}" and app.app_permit_done = u.groupname inner join accounts a on a.username = u.username`;
    const response_5 = await con.promise().query(getEmailsQuery);

    const message = `A task has been promoted to "done" state.\n\nTask ID: ${id} \nApplication: ${app[0][0].task_app_acronym}\nPerformed by: ${username}\n\nThis is an auto-generated email please do not reply.`;
    for (email of response_5[0].map((x) => x.email)) {
      if (email !== "") {
        sendEmail({
          email: email,
          subject: `Task ${id} promoted to "Done" state`,
          message: message,
        });
      }
    }
    res.json({ code: "S1" });
  } catch (e) {
    if (e.code === "ER_DATA_TOO_LONG" || e.code === 1406) {
      res.json({ code: "P2" });
    } else {
      console.log(e);
      res.json({ code: e.message });
    }
  }
};

const convertStateForward = (state) => {
  if (state === "open") {
    return "Open";
  } else if (state === "todo") {
    return "ToDo";
  } else if (state === "doing") {
    return "Doing";
  } else if (state === "done") {
    return "Done";
  } else {
    return "Close";
  }
};

const convertStateBackward = (state) => {
  if (state === "Open") {
    return "open";
  } else if (state === "ToDo") {
    return "todo";
  } else if (state === "Doing") {
    return "doing";
  } else if (state === "Done") {
    return "done";
  } else {
    return "close";
  }
};
