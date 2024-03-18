import React, { useContext, useEffect, useState } from "react";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import AdminManagement from "./AdminManagement";
import UserManagement from "./UserManagement";
import Axios from "axios";

function AccountManagement() {
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
        console.log(e.response.data);
        setisAdmin(false);
        if (!e.response.data.body.active) {
          dispatch({ type: "logout" });
        }
      }
    };

    checkAdmin();
  }, [state.token]);
  if (isAdmin) {
    return <AdminManagement />;
  } else {
    return <UserManagement />;
  }
}

export default AccountManagement;
