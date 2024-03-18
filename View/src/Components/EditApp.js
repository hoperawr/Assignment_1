import React, { useState, useContext } from "react";
import GroupListSingle from "./GroupListSingle";
import DispatchContext from "../DispatchContext";
import StateContext from "../StateContext";
import Axios from "axios";

function EditApp(props) {
  const dispatch = useContext(DispatchContext);
  const state = useContext(StateContext);
  const [description, setDescription] = useState(props.description);
  const [start, setStart] = useState(convertDateReverse(props.start));
  const [end, setEnd] = useState(convertDateReverse(props.end));
  const [create, setCreate] = useState(props.create);
  const [open, setOpen] = useState(props.open);
  const [toDo, setToDo] = useState(props.todo);
  const [doing, setDoing] = useState(props.doing);
  const [done, setDone] = useState(props.done);
  function convertDate(dateString) {
    if (dateString === "") {
      return "";
    } else {
      const [year, month, day] = dateString.split("-");
      return `${day}/${month}/${year}`;
    }
  }

  function convertDateReverse(dateString) {
    if (dateString === "") {
      return "";
    } else {
      const [day, month, year] = dateString.split("/");
      return `${year}-${month}-${day}`;
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "/user/editApp",
        headers: {
          "x-auth-token": state.token,
        },
        data: {
          acronym: props.acronym,
          description: description,
          start: convertDate(start),
          end: convertDate(end),
          create: create,
          open: open,
          toDo: toDo,
          doing: doing,
          done: done,
        },
      };
      const response = await Axios.request(config);
      props.fetchData();
      dispatch({ type: "flash", value: "Application updated" });
      props.setisEdit(false);
      props.setisEditHome(false);
    } catch (e) {
      console.log(e);
      dispatch({ type: "flash", value: e.message });
    }
  };
  return (
    <div className="centered-div">
      <form
        onSubmit={handleSubmit}
        style={{ display: "grid" }}
        autoComplete="false"
      >
        <h2 className="login-header">Edit Application</h2>
        <label htmlFor="password" className="login-username">
          Description
        </label>
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
          Start Date
        </label>
        <input
          type="date"
          pattern="\d{2}/\d{2}/\d{4}"
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
          Edit
        </button>
        <button
          type="button"
          className="um-button login-submit"
          onClick={() => {
            props.setisEdit(false);
            props.setisEditHome(false);
          }}
          style={{ marginBottom: "10px" }}
        >
          Close
        </button>
      </form>
    </div>
  );
}

export default EditApp;
