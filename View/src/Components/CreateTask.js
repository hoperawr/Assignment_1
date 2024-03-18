import React, { useContext, useState, useEffect } from "react";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import Axios from "axios";
import GroupListSingle from "./GroupListSingle";
import { useParams } from "react-router-dom";

function CreateTask(props) {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const params = useParams();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [note, setNote] = useState("");
  const [app, setApp] = useState(params.app_name);
  const [plan, setPlan] = useState(params.plan_name || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "/user/addTask",
        headers: {
          "x-auth-token": state.token,
        },
        data: {
          name: name,
          description: description,
          note: note,
          plan: plan,
          app: app,
          state: "Open",
          creator: state.username,
        },
      };
      const response = await Axios.request(config);
      props.fetchData();
      dispatch({ type: "flash", value: response.data.header });
      props.setisCreate(false);
    } catch (e) {
      dispatch({ type: "flash", value: e.response.data.header });
    }
  };
  return (
    <div className="centered-div">
      <form onSubmit={handleSubmit} style={{ display: "grid" }}>
        <h2 className="login-header">Create Task</h2>
        <label htmlFor="username" className="login-username">
          Name
        </label>
        <input
          className="login-username"
          type="text"
          id="username"
          name="username"
          onChange={(e) => setName(e.target.value)}
          required
          style={{ marginBottom: "5px", font: "unset" }}
        />
        <label className="login-username">Description</label>
        <textarea
          className="login-username"
          type="text"
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="5"
          cols="50"
          style={{ marginBottom: "5px", font: "unset" }}
        />
        <label htmlFor="password" className="login-username">
          Note
        </label>
        <textarea
          className="login-username"
          type="text"
          id="note"
          name="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows="5"
          cols="50"
          style={{ marginBottom: "15px", font: "unset" }}
        />
        <GroupListSingle
          allGroups={props.allApps}
          groups={app}
          setGroups={setApp}
          label="Application"
        />
        <GroupListSingle
          allGroups={props.allPlans
            .filter((x) => app === x[0])
            .map((x) => x[1])}
          groups={plan}
          setGroups={setPlan}
          label="Plan"
        />
        <button type="submit" className="login-submit um-button">
          Create
        </button>
        <button
          type="button"
          className="um-button login-submit"
          onClick={() => props.setisCreate(!props.isCreate)}
        >
          Close
        </button>
      </form>
    </div>
  );
}

export default CreateTask;
