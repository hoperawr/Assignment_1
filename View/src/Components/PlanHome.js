import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";
import Axios from "axios";
import PlanCard from "./PlanCard";
import CreatePlan from "./CreatePlan";

function PlanHome() {
  const navigate = useNavigate();
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const params = useParams();
  const placeholder = [
    {
      plan_mvp_name: "placeholder",
      plan_startDate: "placeholder",
      plan_endDate: "placeholder",
      plan_app_acronym: "placeholder",
    },
  ];
  const [planData, setplanData] = useState(placeholder);
  const [isCreate, setisCreate] = useState(false);
  const [allApps, setallApps] = useState([]);
  const [userGroups, setuserGroups] = useState([]);
  const [isEditHome, setisEditHome] = useState(false);
  const fetchData = async () => {
    try {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: "/user/getPlans",
        headers: {
          "x-auth-token": state.token,
        },
        params: {
          plan: params.app_name,
        },
      };
      const response = await Axios.request(config);
      setplanData(response.data.body);

      let config_2 = {
        method: "get",
        maxBodyLength: Infinity,
        url: "/user/getAppsNames",
        headers: {
          "x-auth-token": state.token,
        },
      };
      const response_2 = await Axios.request(config_2);
      setallApps(response_2.data.body.map((x) => x.app_acronym));

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
      console.log(e.response.data.header);
      dispatch({ type: "flash", value: e.response.data.header });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="login-container">
      <h2 className="login-header">Plan</h2>
      {isCreate ? (
        <CreatePlan
          allApps={allApps}
          isCreate={isCreate}
          setisCreate={setisCreate}
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
        {userGroups.includes("Project Manager") ? (
          <button
            onClick={() => setisCreate(true)}
            className="um-button"
            style={{ marginRight: "10px" }}
          >
            Create Plan
          </button>
        ) : (
          <></>
        )}

        <button onClick={() => navigate(`/app`)} className="um-button">
          Back
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Start</th>
            <th>End</th>
            <th>Application</th>
            <th>Color</th>
            {userGroups.includes("Project Manager") ? <th></th> : <></>}
          </tr>
        </thead>
        <tbody>
          {planData.map((x) => (
            <PlanCard
              key={x.plan_mvp_name}
              plan={x}
              isEditHome={isEditHome}
              setisEditHome={setisEditHome}
              fetchData={fetchData}
              userGroups={userGroups}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default PlanHome;
