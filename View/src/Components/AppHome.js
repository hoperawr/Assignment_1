import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import DispatchContext from "../DispatchContext";
import AppCard from "../Components/AppCard";
import StateContext from "../StateContext";
import CreateApp from "../Components/CreateApp";
import EditApp from "./EditApp";
import Axios from "axios";
const placeholder = [
  {
    app_acronym: "placeholder",
    app_description: "placeholder",
    app_endDate: "placeholder",
    app_permit_doing: "placeholder",
    app_permit_done: "placeholder",
    app_permit_open: "placeholder",
    app_permit_toDoList: "placeholder",
    app_rnumber: "placeholder",
    app_startDate: "placeholder",
  },
];
function AppHome() {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const [appData, setappData] = useState(placeholder);
  const [isPlans, setisPlans] = useState(false);
  const [isCreate, setisCreate] = useState(false);
  const [allGroups, setallGroups] = useState(false);
  const [userGroups, setuserGroups] = useState([]);
  const [isEditHome, setisEditHome] = useState(false);

  const fetchData = async () => {
    try {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: "/user/getApps",
        headers: {
          "x-auth-token": state.token,
        },
      };
      const response = await Axios.request(config);
      setappData(response.data.body);
      let config_2 = {
        method: "get",
        maxBodyLength: Infinity,
        url: "/user/getGroups",
        headers: {
          "x-auth-token": state.token,
        },
      };
      const response_2 = await Axios.request(config_2);
      setallGroups(response_2.data.body.map((x) => x.groupname));
      let config_3 = {
        method: "get",
        maxBodyLength: Infinity,
        url: "/user/getUserGroups",
        headers: {
          "x-auth-token": state.token,
        },
      };
      const response_3 = await Axios.request(config_3);
      setuserGroups(response_3.data.body.map((x) => x.groupname));
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <h2 className="login-header">Application</h2>
      {isCreate ? (
        <CreateApp
          isCreate={isCreate}
          setisCreate={setisCreate}
          allGroups={allGroups}
          fetchData={fetchData}
        />
      ) : (
        <></>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        {userGroups.includes("Project Lead") ? (
          <button
            onClick={() => setisCreate(!isCreate)}
            className="um-button"
            style={{ marginRight: "10px" }}
          >
            Create Application
          </button>
        ) : (
          <></>
        )}
        <div style={{ display: "grid", marginLeft: "10px" }}>
          <div style={{ fontWeight: "bold" }}>View Plans</div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button
              onClick={() => setisPlans(!isPlans)}
              className={isPlans ? "green-light-button" : "red-light-button"}
            />
          </div>
        </div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Acronym</th>
            <th>Description</th>
            <th>Start</th>
            <th>End</th>
            <th>Create</th>
            <th>Open</th>
            <th>ToDo</th>
            <th>Doing</th>
            <th>Done</th>
            {userGroups.includes("Project Lead") ? <th></th> : <></>}
          </tr>
        </thead>
        <tbody>
          {appData.map((x) => (
            <AppCard
              key={x.app_acronym}
              app={x}
              isPlans={isPlans}
              isEditHome={isEditHome}
              setisEditHome={setisEditHome}
              allGroups={allGroups}
              fetchData={fetchData}
              userGroups={userGroups}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AppHome;
