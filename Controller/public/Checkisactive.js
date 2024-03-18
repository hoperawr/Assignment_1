const con = require("../models/model");
/*
Function: Checkisactive
*/
exports.Checkisactive = async (userid) => {
  try {
    const [result] = await con
      .promise()
      .query(`SELECT isActive from accounts where username = "${userid}"`);

    return result[0].isActive;
  } catch (e) {
    console.log(e);
  }
};
