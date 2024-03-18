const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const mysql = require("mysql2");
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.MODEL_PASSWORD,
});

con.connect(function (err) {
  if (err) {
    console.log("Error in the con");
    console.log(err);
  } else {
    console.log(`Database Connected`);
    con.query("USE `nodelogin`;", function (err, result) {
      if (err) console.log(`Error executing the query - ${err}`);
      else console.log("Using nodelogin");
    });
  }
});

module.exports = con;
