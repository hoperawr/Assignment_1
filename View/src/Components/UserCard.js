import React, { useState, useEffect, useContext } from "react";
import GroupList from "./GroupList";
import Axios from "axios";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";

function UserCard(props) {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const allGroups = props.allGroups;
  const [isEdit, setisEdit] = useState(false);
  const [isActive, setisActive] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [groups, setGroups] = useState([]);

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

  const getUser = async () => {
    try {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `/admin/getUser?username=${props.username}`,
        headers: {
          "x-auth-token": `${state.token}`,
        },
      };

      const response = await Axios.request(config);
      setEmail(response.data.body.user.email);
      setisActive(response.data.body.user.isActive === 1 ? true : false);
      setGroups(response.data.body.groups);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (props.username) {
      getUser();
    }
  }, []);
  async function handleSubmit(e) {
    e.preventDefault();
    if (isEdit) {
      const pass = checkPassword(password);
      if (!pass[0] && password !== "") {
        dispatch({ type: "flash", value: pass[1] });
      } else {
        try {
          let data = {
            username: props.username,
            password: password,
            email: email,
            isActive: isActive,
            groups: groups,
          };
          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `/admin/updateUser`,
            headers: {
              "x-auth-token": `${state.token}`,
            },
            data: data,
          };
          const response = await Axios.request(config);
          setisEdit(!isEdit);
          getUser();
          dispatch({ type: "flash", value: response.data.header });
        } catch (e) {
          getUser();
          setisEdit(!isEdit);
          dispatch({ type: "flash", value: e.response.data.header });
        }
      }
    } else {
      setisEdit(!isEdit);
    }
  }

  async function handleDisable(e) {
    e.preventDefault();
    try {
      let data = {
        username: props.username,
        password: "",
        email: email,
        isActive: !isActive,
        groups: groups,
      };

      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `/admin/updateUser`,
        headers: {
          "x-auth-token": `${state.token}`,
        },
        data: data,
      };
      const response = await Axios.request(config);
      if (!isActive) {
        dispatch({ type: "flash", value: "Account active" });
      } else {
        dispatch({ type: "flash", value: "Account disabled" });
      }

      setisActive(!isActive);
    } catch (e) {
      dispatch({ type: "flash", value: e.response.data.header });
    }
  }
  return (
    <tr key={props.username}>
      <td>{props.username}</td>
      <td>
        {isEdit ? (
          <input
            type="text"
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "150px" }}
          />
        ) : (
          ""
        )}
      </td>
      <td>
        {isEdit ? (
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "150px" }}
          />
        ) : (
          email
        )}
      </td>
      <td>
        {isEdit ? (
          <GroupList
            allGroups={allGroups}
            groups={groups}
            setGroups={setGroups}
          />
        ) : (
          groups.join(", ")
        )}
      </td>
      <td>
        {isEdit ? (
          <button
            onClick={() => {
              setisActive(!isActive);
            }}
            className={isActive ? "green-light" : "red-light"}
          >
            {isActive ? "Active" : "Disabled"}
          </button>
        ) : isActive ? (
          "Active"
        ) : (
          "Disabled"
        )}
      </td>
      <td>
        {isEdit ? (
          <></>
        ) : (
          <button
            type="button"
            className={isActive ? "green-light" : "red-light"}
            onClick={handleDisable}
          >
            {isActive ? "Disable" : "Enable"}
          </button>
        )}
        <button className="um-button add_user_elements" onClick={handleSubmit}>
          {isEdit ? "Submit" : "Edit"}
        </button>
        {isEdit ? (
          <button
            className="um-button add_user_elements"
            onClick={() => {
              setisEdit(false);
              getUser();
            }}
          >
            Cancel
          </button>
        ) : (
          <></>
        )}
      </td>
    </tr>
  );
}

export default UserCard;
