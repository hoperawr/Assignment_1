import React, { useContext, useState } from "react";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";
import Axios from "axios";

function UserProfile() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const dispatch = useContext(DispatchContext);
  const state = useContext(StateContext);

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

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      if (password !== password2) {
        dispatch({ type: "flash", value: "Passwords are not the same" });
      } else {
        const pass = checkPassword(password2);
        if (!pass[0] && password2 !== "") {
          dispatch({ type: "flash", value: pass[1] });
        } else {
          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: `/user/update`,
            headers: {
              "x-auth-token": `${state.token}`,
            },
            data: {
              username: state.username,
              password: password2,
              email: email,
            },
          };
          const response = await Axios.request(config);
          dispatch({ type: "flash", value: response.data.header });
          setEmail("");
          setPassword("");
          setPassword2("");
        }
      }
    } catch (e) {
      dispatch({ type: "flash", value: e.response.data.header });
    }
  }
  return (
    <div className="login-container">
      <h2 className="login-header">User Profile</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: "grid" }}
        autoComplete="off"
      >
        <label className="login-username">Email </label>
        <input
          className="login-username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: "5px" }}
          autoComplete="off"
        />
        <label htmlFor="password" className="login-username">
          Password{" "}
        </label>
        <input
          className="login-username"
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: "5px" }}
          autocomplete="off"
        />
        <label htmlFor="password" className="login-username">
          Confirm Password{" "}
        </label>
        <input
          className="login-username"
          type="password"
          id="password2"
          value={password2}
          name="password2"
          onChange={(e) => setPassword2(e.target.value)}
          style={{ marginBottom: "5px" }}
        />
        <button type="submit" className="login-submit um-button">
          Confirm
        </button>
      </form>
    </div>
  );
}

export default UserProfile;
