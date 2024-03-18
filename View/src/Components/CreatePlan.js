import React, { useContext, useState, useEffect } from "react";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import Axios from "axios";
import GroupListSingle from "./GroupListSingle";

function CreatePlan(props) {
  const [name, setName] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [app, setApp] = useState("");
  const [color, setColor] = useState("#ffffff");
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  function convertDate(dateString) {
    if (dateString === "") {
      return "";
    } else {
      const [year, month, day] = dateString.split("-");
      return `${day}/${month}/${year}`;
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (app === "") {
      dispatch({ type: "flash", value: "Application cannot be empty" });
    } else {
      try {
        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: "/user/addPlan",
          headers: {
            "x-auth-token": state.token,
          },
          data: {
            name: name,
            start: convertDate(start),
            end: convertDate(end),
            app: app,
            color: color,
          },
        };
        const response = await Axios.request(config);
        dispatch({ type: "flash", value: "Submitted" });
        props.setisCreate(false);
        props.fetchData();
      } catch (e) {
        console.log(e);
        dispatch({ type: "flash", value: e.response.data.header });
      }
    }
  };
  return (
    <div className="centered-div">
      <form onSubmit={handleSubmit} style={{ display: "grid" }}>
        <h2 className="login-header">Create Plan</h2>
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
        <label htmlFor="password" className="login-username">
          Start Date
        </label>
        <input
          type="date"
          onfocus="this.showPicker()"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          style={{ font: "unset" }}
        />
        <label htmlFor="password" className="login-username">
          End Date
        </label>
        <input
          type="date"
          onfocus="this.showPicker()"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          style={{ font: "unset" }}
        />
        <label htmlFor="password" className="login-username">
          Application
        </label>
        <GroupListSingle
          allGroups={props.allApps}
          groups={app}
          setGroups={setApp}
          label="Application"
        />
        <label className="login-username">Color</label>
        <input
          type="color"
          onfocus="this.showPicker()"
          value={color}
          onChange={(e) => setColor(e.target.value)}
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

export default CreatePlan;
