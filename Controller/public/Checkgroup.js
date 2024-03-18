const con = require("../models/model");

/*
Function: Checkgroup
*/
exports.Checkgroup = async (userid, groupname) => {
  try {
    const [result] = await con.promise().query(
      `SELECT CASE WHEN COUNT(*) > 0 THEN 1 ELSE 0 END AS check_group
FROM user_groups
WHERE username="${userid}" AND groupname="${groupname}";`
    );
    return result[0].check_group;
  } catch (e) {
    console.log(e);
  }
};
