import React, { useContext, useState, useEffect } from "react";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";
import Axios from "axios";
import UserCard from "./UserCard";
import AddUser from "./AddUser";
import CreateGroup from "./CreateGroup";

function AdminManagement() {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const placeholder = [
    {
      username: "",
    },
  ];
  const [userData, setuserData] = useState(placeholder);
  const [allGroups, setallGroups] = useState([]);
  const [isAddUser, setisAddUser] = useState(false);
  const [isCreateGroup, setisCreateGroup] = useState(false);
  const [newUser, setnewUser] = useState(false);

  const fetchData = async () => {
    try {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `/admin/getUsers`,
        headers: {
          "x-auth-token": `${state.token}`,
        },
      };
      const response = await Axios.request(config);
      setuserData(response.data.body.users);
      setallGroups(response.data.body.groups);
    } catch (e) {
      dispatch({ type: "flash", value: e.message });
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="login-container">
      <h2 className="login-header">User Management</h2>
      <ul
        style={{
          display: "grid",
          justify_content: "center",
          padding: "0",
        }}
      >
        <AddUser
          isAddUser={isAddUser}
          setisAddUser={setisAddUser}
          allGroups={allGroups}
          fetchData={fetchData}
        />
        <CreateGroup
          isCreateGroup={isCreateGroup}
          setisCreateGroup={setisCreateGroup}
          fetchData={fetchData}
          setisAddUser={setisAddUser}
          isAddUser={isAddUser}
        />
      </ul>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Password</th>
            <th>Email</th>
            <th>Groups</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userData.map((user) => (
            <UserCard
              key={user.username}
              username={user.username}
              allGroups={allGroups}
              newUser={newUser}
              setnewUser={setnewUser}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminManagement;
