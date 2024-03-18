import React, { useContext, useState, useEffect } from "react";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import Axios from "axios";
import GroupListSingle from "./GroupListSingle";

function CreateApp(props) {
  const [acronym, setAcronym] = useState("");
  const [description, setDescription] = useState("");
  const [rnumber, setRnumber] = useState(0);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [create, setCreate] = useState("");
  const [open, setOpen] = useState("");
  const [toDo, setToDo] = useState("");
  const [doing, setDoing] = useState("");
  const [done, setDone] = useState("");

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
    try {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "/user/addApp",
        headers: {
          "x-auth-token": state.token,
        },
        data: {
          acronym: acronym,
          description: description,
          rnumber: rnumber,
          start: convertDate(start),
          end: convertDate(end),
          create: create,
          open: open,
          toDo: toDo,
          doing: doing,
          done: done,
        },
      };
      console.log(convertDate(start));
      const response = await Axios.request(config);
      dispatch({ type: "flash", value: "Submitted" });
      props.setisCreate(false);
      props.fetchData();
    } catch (e) {
      console.log(e);
      dispatch({ type: "flash", value: e.response.data.header });
    }
  };

  const handleIncrement = () => {
    setRnumber(rnumber + 1);
  };

  const handleDecrement = () => {
    if (rnumber > 0) {
      setRnumber(rnumber - 1);
    }
  };

  return (
    <div className="centered-div">
      <form
        onSubmit={handleSubmit}
        style={{ display: "grid" }}
        autoComplete="false"
      >
        <h2 className="login-header">Create Application</h2>
        <label htmlFor="username" className="login-username">
          Acronym
        </label>
        <input
          className="login-username"
          type="text"
          id="username"
          name="username"
          onChange={(e) => setAcronym(e.target.value)}
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
        <div>
          <label className="login-username">R Number</label>
          <button
            type="button"
            style={{
              padding: "5px 10px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginRight: "5px",
            }}
            onClick={handleDecrement}
          >
            -
          </button>
          <span>{rnumber}</span>
          <button
            type="button"
            style={{
              padding: "5px 10px",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginLeft: "5px",
            }}
            onClick={handleIncrement}
          >
            +
          </button>
        </div>
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
          Create
        </label>
        <GroupListSingle
          allGroups={props.allGroups}
          groups={create}
          setGroups={setCreate}
          label="Create"
        />
        <label className="login-username">Open</label>
        <GroupListSingle
          allGroups={props.allGroups}
          groups={open}
          setGroups={setOpen}
          label="Open"
        />
        <label className="login-username">ToDo</label>
        <GroupListSingle
          allGroups={props.allGroups}
          groups={toDo}
          setGroups={setToDo}
          label="ToDo"
        />
        <label className="login-username">Doing</label>
        <GroupListSingle
          allGroups={props.allGroups}
          groups={doing}
          setGroups={setDoing}
          label="Doing"
        />
        <label className="login-username">Done</label>
        <GroupListSingle
          allGroups={props.allGroups}
          groups={done}
          setGroups={setDone}
          label="Done"
        />
        <button type="submit" className="login-submit um-button">
          Create
        </button>
        <button
          type="button"
          className="um-button login-submit"
          onClick={() => props.setisCreate(!props.isCreate)}
          style={{ marginBottom: "10px" }}
        >
          Close
        </button>
      </form>
    </div>
  );
}

export default CreateApp;
