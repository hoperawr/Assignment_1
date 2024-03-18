import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import Axios from "axios";

function Header() {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const [isAdmin, setisAdmin] = useState(false);
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `/admin/checkAdmin`,
          headers: {
            "x-auth-token": `${state.token}`,
          },
        };
        const response = await Axios.request(config);
        setisAdmin(true);
      } catch (e) {
        setisAdmin(false);
      }
    };

    checkAdmin();
  }, [state.token]);
  function handleLogout() {
    dispatch({ type: "flash", value: "Logout Successful" });
    dispatch({ type: "logout" });
  }
  return (
    <div className="header-container">
      <Link
        style={{ all: "unset", height: "100%", alignSelf: "center" }}
        to="/app"
      >
        <h1
          className="header-title wobble"
          style={{
            cursor: "pointer",
          }}
        >
          T M S
        </h1>
      </Link>
      <ul className="header-ul">
        <Link className="header-links" to="/user_management">
          {state.username}
        </Link>

        <Link className="header-links" to="/app">
          dashboard
        </Link>

        {isAdmin ? (
          <Link className="header-links" to="/admin_management">
            user management
          </Link>
        ) : (
          <></>
        )}
        <Link className="header-links" onClick={() => handleLogout()} to="/">
          logout
        </Link>
      </ul>
    </div>
  );
}

export default Header;
