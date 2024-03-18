import React, { useEffect } from "react";
import { useImmerReducer } from "use-immer";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./index.css";
import Axios from "axios";
import Cookies from "js-cookie";
import Login from "./Components/Login";
import Error from "./Components/Error";
import HeaderLoggedOut from "./Components/HeaderLoggedOut";
import Header from "./Components/Header";
import UserManagement from "./Components/UserManagement";
import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";
import Home from "./Components/Home";
import FlashMessage from "./Components/FlashMessage";
import AdminManagement from "./Components/AdminManagement";
import AppHome from "./Components/AppHome";
import TaskHome from "./Components/TaskHome";
import PlanHome from "./Components/PlanHome";

Axios.defaults.baseURL = "http://localhost:3001";

// REMOVE UNUSED DEPENDANCIES!!!!!

export default function App() {
  const initialState = {
    loggedIn: true,
    token: Cookies.get("token") ? Cookies.get("token") : "",
    username: Cookies.get("username") ? Cookies.get("username") : "",
    flashMessages: [],
  };

  function ourReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true;
        draft.username = action.username;
        draft.token = action.token;
        Cookies.set("token", action.token);
        return;
      case "logout":
        draft.loggedIn = false;
        draft.username = "";
        draft.token = "";
        Cookies.remove("token");
        return;
      case "flash":
        draft.flashMessages.push(action.value);
        return;
      default:
        console.log("Error in dispatch ", action.type);
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, initialState);

  async function checkState() {
    const token = Cookies.get("token");
    try {
      if (token) {
        let config = {
          method: "get",
          maxBodyLength: Infinity,
          url: `/user/checkLogin`,
          headers: {
            "x-auth-token": `${token}`,
          },
        };
        const response = await Axios.request(config);

        dispatch({
          type: "login",
          username: response.data.body.username,
          loggedIn: true,
          token: token,
        });
      } else {
        dispatch({ type: "logout" });
      }
    } catch (e) {
      dispatch({ type: "logout" });
    }
  }
  useEffect(() => checkState(), []);
  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessage messages={state.flashMessages} />
          {state.loggedIn ? <Header /> : <HeaderLoggedOut />}
          {state.loggedIn ? <></> : <Navigate to="/" />}
          <Routes>
            <Route
              exact
              path="/"
              element={state.loggedIn ? <AppHome /> : <Login />}
            />
            <Route path="/user_management" element={<UserManagement />} />
            <Route path="/admin_management" element={<AdminManagement />} />
            <Route path="/app" element={<AppHome />} />
            <Route path="/app/:app_name/plan" element={<PlanHome />} />
            <Route
              path="/app/:app_name/plan/:plan_name/task"
              element={<TaskHome />}
            />
            <Route path="/app/:app_name/task" element={<TaskHome />} />
            <Route
              path="/app/:app_name/task/:task_name/task"
              element={<TaskHome />}
            />
            <Route path="/task" element={<TaskHome />} />
            <Route path="/home" element={<Home />} />
            <Route path="*" element={<Error />} />
          </Routes>
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
