import React, { useContext, useState } from "react";
import StateContext from "../StateContext";
import Axios from "axios";
import DispatchContext from "../DispatchContext";
import GroupList from "./GroupList";

function AddUser(props) {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [groups, setGroups] = useState([]);
  const [isActive, setisActive] = useState(true);

  function checkPassword(str) {
    if (str.length < 8 || str.length > 10) {
      return [false, "Password must be between 8-10 characters"];
    }
    const hasAlphabet = /[a-zA-Z]/g.test(str);
    const hasNumber = /\d/g.test(str);
    const hasSpecialChar = /[!@#$%^&*()]/g.test(str);
    if (!hasAlphabet || !hasNumber || !hasSpecialChar) {
      let missingRequirements = "";
      if (!hasAlphabet) {
        missingRequirements += "Alphabet, ";
      }
      if (!hasNumber) {
        missingRequirements += "Number, ";
      }
      if (!hasSpecialChar) {
        missingRequirements += "Special character";
      }
      missingRequirements = missingRequirements.slice(0, -2);
      return [
        false,
        `Password requirement not met (Missing: ${missingRequirements})`,
      ];
    }
    return [true];
  }

  function checkUsername(str) {
    const alphaNumericRegex = /^[a-zA-Z0-9]+$/;
    return alphaNumericRegex.test(str);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const pass = checkPassword(password);
    const user = checkUsername(username);
    if (!pass[0]) {
      dispatch({ type: "flash", value: pass[1] });
    } else if (!user) {
      dispatch({
        type: "flash",
        value: "Username can only have alphanumeric characters",
      });
    } else {
      try {
        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: `/admin/addUser`,
          headers: {
            "x-auth-token": `${state.token}`,
          },
          data: {
            username: username,
            password: password,
            email: email,
            groups: groups,
            isActive: isActive,
          },
        };
        const response = await Axios.request(config);
        dispatch({ type: "flash", value: response.data.header });
        props.setisAddUser(!props.isAddUser);
        props.fetchData();
        setGroups([]);
        setUsername("");
        setPassword("");
        setEmail("");
      } catch (e) {
        dispatch({ type: "flash", value: e.response.data.header });
      }
    }
  }
  return (
    <ul className="add_create_ul">
      {!props.isAddUser ? (
        <button
          className="um-button"
          onClick={() => props.setisAddUser(!props.isAddUser)}
        >
          Add User
        </button>
      ) : (
        <></>
      )}
      {props.isAddUser ? (
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
          }}
        >
          <label htmlFor="username" className="add_user_elements">
            Username{" "}
          </label>
          <input
            type="text"
            id="username"
            name="username"
            onChange={(e) => setUsername(e.target.value)}
            required
            className="add_user_elements"
          />
          <label htmlFor="password" className="add_user_elements">
            Password{" "}
          </label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            required
            className="add_user_elements"
          />
          <label className="add_user_elements">Email </label>
          <input
            id="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            className="add_user_elements"
          />

          <GroupList
            allGroups={props.allGroups}
            groups={groups}
            setGroups={setGroups}
          />
          <label className="add_user_elements">Status</label>
          <button
            type="button"
            onClick={() => setisActive(!isActive)}
            className={
              isActive
                ? "green-light add_user_elements"
                : "red-light add_user_elements"
            }
          >
            {isActive ? "Enable" : "Disabled"}
          </button>

          <button type="submit" className="um-button add_user_elements">
            Add
          </button>
          <button
            className="um-button add_user_elements"
            onClick={() => {
              props.setisAddUser(!props.isAddUser);
              setGroups([]);
            }}
          >
            Cancel
          </button>
        </form>
      ) : (
        <></>
      )}
    </ul>
  );
}

export default AddUser;
