import React, { useState, useContext } from "react";
import GroupListSingle from "./GroupListSingle";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";
import Axios from "axios";

function EditPlan(props) {
  const dispatch = useContext(DispatchContext);
  const state = useContext(StateContext);

  const [start, setStart] = useState(convertDateReverse(props.start));
  const [end, setEnd] = useState(convertDateReverse(props.end));
  const [color, setColor] = useState(props.color);
  function convertDateReverse(dateString) {
    if (dateString === "") {
      return "";
    } else {
      const [day, month, year] = dateString.split("/");
      return `${year}-${month}-${day}`;
    }
  }
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
    try {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "/user/editPlan",
        headers: {
          "x-auth-token": state.token,
        },
        data: {
          plan: props.plan_mvp_name,
          start: convertDate(start),
          end: convertDate(end),
          color: color,
        },
      };
      const response = await Axios.request(config);

      dispatch({ type: "flash", value: "Plan updated" });
      props.fetchData();
      props.setisEdit(false);
      props.setisEditHome(false);
    } catch (e) {
      console.log(e);
      dispatch({ type: "flash", value: e.response.data.header });
    }
  };
  return (
    <div className="centered-div">
      <form
        onSubmit={handleSubmit}
        style={{ display: "grid" }}
        autoComplete="false"
      >
        <h2 className="login-header">Edit Plan</h2>
        <label
          htmlFor="password"
          className="login-username"
          style={{ font: "unset" }}
        >
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
        <label className="login-username">Color</label>
        <input
          type="color"
          onfocus="this.showPicker()"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />
        <button type="submit" className="login-submit um-button">
          Update
        </button>
        <button
          type="button"
          className="um-button login-submit"
          onClick={() => {
            props.setisEdit(false);
            props.setisEditHome(false);
          }}
        >
          Close
        </button>
      </form>
    </div>
  );
}

export default EditPlan;
