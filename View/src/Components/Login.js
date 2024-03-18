import React, { useContext, useState } from "react";
import Axios from "axios";
import DispatchContext from "../DispatchContext";

function LoginPage() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const dispatch = useContext(DispatchContext);

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await Axios.post("/login", {
        username: username,
        password: password,
      });

      dispatch({
        type: "login",
        token: response.data.body.token,
        username: response.data.body.username,
      });
      dispatch({ type: "flash", value: response.data.header });
    } catch (e) {
      console.log(e);
      if (e.response) {
        dispatch({ type: "flash", value: e.response.data.header });
      } else {
        dispatch({ type: "flash", value: "Server Error" });
      }
    }
  }

  return (
    <div className="login-container">
      <h2 className="login-header">Login</h2>
      <form onSubmit={handleSubmit} style={{ display: "grid" }}>
        <label htmlFor="username" className="login-username">
          Username
        </label>
        <input
          className="login-username"
          type="text"
          id="username"
          name="username"
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ marginBottom: "5px" }}
        />
        <label htmlFor="password" className="login-username">
          Password
        </label>
        <input
          className="login-username"
          type="password"
          id="password"
          name="password"
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ marginBottom: "5px" }}
        />
        <button type="submit" className="login-submit um-button">
          Login
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
