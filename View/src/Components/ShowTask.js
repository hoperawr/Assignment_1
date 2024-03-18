import React, { useContext, useState } from "react";
import GroupListSingle from "./GroupListSingle";
import Axios from "axios";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import ViewNotes from "./ViewNotes";

function ShowTask(props) {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const [des, setDes] = useState(props.task.task_description);
  const [plan, setPlan] = useState(props.task.task_plan || "");
  const [note, setNote] = useState("");
  const [isEdit, setisEdit] = useState(false);
  const [newNote, setnewNote] = useState(false);

  const handleClose = (e) => {
    e.preventDefault();

    props.setisShow(false);

    props.setisShowOpen(false);
  };
  const handleOpenRelease = async (e) => {
    e.preventDefault();
    try {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "/user/handleOpenRelease",
        headers: {
          "x-auth-token": state.token,
        },
        data: {
          app_acronym: props.task.task_app_acronym,
          task_id: props.task.task_id,
          note: note,
          state: props.task.task_state,
        },
      };
      const response = await Axios.request(config);
      props.fetchData();
      dispatch({ type: "flash", value: "Task Released" });
      props.setisShow(false);
      props.setisShowOpen(false);
    } catch (e) {
      dispatch({ type: "flash", value: e.response.data.header });
    }
  };
  const handleOpenUpdate = async (e) => {
    e.preventDefault();
    if (isEdit) {
      try {
        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: "/user/handleOpenUpdate",
          headers: {
            "x-auth-token": state.token,
          },
          data: {
            app_acronym: props.task.task_app_acronym,
            task_id: props.task.task_id,
            description: des,
            note: note,
            plan: plan,

            state: props.task.task_state,
          },
        };
        const response = await Axios.request(config);
        props.fetchData();
        setisEdit(false);
        dispatch({ type: "flash", value: "Task Updated" });
        props.setisShow(false);
        props.setisShowOpen(false);
      } catch (e) {
        dispatch({ type: "flash", value: e.response.data.header });
        setisEdit(false);
      }
    } else {
      setisEdit(true);
    }
  };
  const handleToDoUpdate = async (e) => {
    e.preventDefault();
    if (isEdit) {
      try {
        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: "/user/handleToDoUpdate",
          headers: {
            "x-auth-token": state.token,
          },
          data: {
            app_acronym: props.task.task_app_acronym,
            task_id: props.task.task_id,
            description: des,
            note: note,

            state: props.task.task_state,
          },
        };
        const response = await Axios.request(config);
        props.fetchData();
        setisEdit(false);
        dispatch({ type: "flash", value: "Task Updated" });
        props.setisShow(false);
        props.setisShowOpen(false);
      } catch (e) {
        dispatch({ type: "flash", value: e.response.data.header });
        setisEdit(false);
      }
    } else {
      setisEdit(true);
    }
  };
  const handleToDoAccept = async (e) => {
    e.preventDefault();
    try {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "/user/handleToDoAccept",
        headers: {
          "x-auth-token": state.token,
        },
        data: {
          app_acronym: props.task.task_app_acronym,
          task_id: props.task.task_id,
          note: note,
          state: props.task.task_state,
        },
      };
      const response = await Axios.request(config);
      props.fetchData();
      dispatch({ type: "flash", value: "Task Accepted" });
      props.setisShow(false);
      props.setisShowOpen(false);
    } catch (e) {
      dispatch({ type: "flash", value: e.response.data.header });
    }
  };
  const handleDoingApproval = async (e) => {
    e.preventDefault();
    try {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "/user/handleDoingApproval",
        headers: {
          "x-auth-token": state.token,
        },
        data: {
          app_acronym: props.task.task_app_acronym,
          task_id: props.task.task_id,
          task_name: props.task.task_name,
          plan: props.task.task_plan,
          note: note,
          state: props.task.task_state,
        },
      };
      const response = await Axios.request(config);
      props.fetchData();
      dispatch({ type: "flash", value: "Seeking Closure Approval" });
      props.setisShow(false);
      props.setisShowOpen(false);
    } catch (e) {
      dispatch({ type: "flash", value: e.response.data.header });
    }
  };
  const handleDoingExtension = async (e) => {
    e.preventDefault();
    try {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "/user/handleDoingExtension",
        headers: {
          "x-auth-token": state.token,
        },
        data: {
          app_acronym: props.task.task_app_acronym,
          task_id: props.task.task_id,
          note: note,
          state: props.task.task_state,
          task_name: props.task.task_name,
          plan: props.task.task_plan,
        },
      };
      const response = await Axios.request(config);
      props.fetchData();
      dispatch({ type: "flash", value: "Requesting extension" });
      props.setisShow(false);
      props.setisShowOpen(false);
    } catch (e) {
      dispatch({ type: "flash", value: e.response.data.header });
    }
  };
  const handleDoingReturn = async (e) => {
    e.preventDefault();
    try {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "/user/handleDoingReturn",
        headers: {
          "x-auth-token": state.token,
        },
        data: {
          app_acronym: props.task.task_app_acronym,
          task_id: props.task.task_id,
          note: note,
          state: props.task.task_state,
        },
      };
      const response = await Axios.request(config);
      props.fetchData();
      dispatch({ type: "flash", value: "Task Returned" });
      props.setisShow(false);
      props.setisShowOpen(false);
    } catch (e) {
      dispatch({ type: "flash", value: e.response.data.header });
    }
  };

  const handleDoingUpdate = async (e) => {
    e.preventDefault();
    if (isEdit) {
      try {
        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: "/user/handleDoingUpdate",
          headers: {
            "x-auth-token": state.token,
          },
          data: {
            app_acronym: props.task.task_app_acronym,
            task_id: props.task.task_id,
            description: des,
            note: note,

            state: props.task.task_state,
          },
        };
        const response = await Axios.request(config);
        props.fetchData();
        setisEdit(false);
        dispatch({ type: "flash", value: "Task Updated" });
        props.setisShow(false);
        props.setisShowOpen(false);
      } catch (e) {
        dispatch({ type: "flash", value: e.response.data.header });
        setisEdit(false);
      }
    } else {
      setisEdit(true);
    }
  };
  const handleDoneApprove = async (e) => {
    e.preventDefault();
    try {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "/user/handleDoneApprove",
        headers: {
          "x-auth-token": state.token,
        },
        data: {
          app_acronym: props.task.task_app_acronym,
          task_id: props.task.task_id,
          note: note,
          state: props.task.task_state,
        },
      };
      const response = await Axios.request(config);
      props.fetchData();
      dispatch({ type: "flash", value: "Task Approved" });
      props.setisShow(false);
      props.setisShowOpen(false);
    } catch (e) {
      dispatch({ type: "flash", value: e.response.data.header });
    }
  };
  const handleDoneReassign = async (e) => {
    e.preventDefault();
    if (isEdit) {
      try {
        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: "/user/handleDoneReassign",
          headers: {
            "x-auth-token": state.token,
          },
          data: {
            app_acronym: props.task.task_app_acronym,
            task_id: props.task.task_id,
            plan: plan,
            note: note,

            state: props.task.task_state,
          },
        };
        const response = await Axios.request(config);
        props.fetchData();
        dispatch({ type: "flash", value: "Task Deadline Reassigned" });
        props.setisShow(false);
        props.setisShowOpen(false);
        setisEdit(false);
      } catch (e) {
        dispatch({ type: "flash", value: e.response.data.header });
        setisEdit(false);
      }
    } else {
      setisEdit(true);
    }
  };
  const handleDoneReject = async (e) => {
    e.preventDefault();
    try {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "/user/handleDoneReject",
        headers: {
          "x-auth-token": state.token,
        },
        data: {
          app_acronym: props.task.task_app_acronym,
          task_id: props.task.task_id,
          note: note,
          state: props.task.task_state,
        },
      };
      const response = await Axios.request(config);
      props.fetchData();
      dispatch({ type: "flash", value: "Task Rejected" });
      props.setisShow(false);
      props.setisShowOpen(false);
    } catch (e) {
      dispatch({ type: "flash", value: e.response.data.header });
    }
  };

  const handleNewNote = async (e) => {
    e.preventDefault();
    if (note === "") {
      dispatch({ type: "flash", value: "Note is empty" });
      return;
    }

    try {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: "/user/handleNewNote",
        headers: {
          "x-auth-token": state.token,
        },
        data: {
          task_id: props.task.task_id,
          state: props.task.task_state,
          note: note,
        },
      };
      const response = await Axios.request(config);
      dispatch({ type: "flash", value: "Note added" });
      setNote("");
      setnewNote(true);
    } catch (e) {
      console.log(e);
      dispatch({ type: "flash", value: e.message });
    }
  };
  return (
    <div className="centered-div">
      <div
        style={{
          position: "absolute",
          right: "10px",
          top: "5px",
          cursor: "pointer",
          fontWeight: "1000",
          fontSize: "30px",
        }}
        onClick={handleClose}
      >
        X
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "grid",
            width: "34vw",
            justifyContent: "center",
            alignItems: "center",
            marginRight: "1vw",
            marginBottom: "auto",
          }}
        >
          <h2>Task</h2>
          <div style={{ display: "flex", marginBottom: "10px" }}>
            <div style={{ marginRight: "4px", fontWeight: "bold" }}>Name:</div>
            <div>{props.task.task_name}</div>
          </div>
          <div style={{ display: "flex", marginBottom: "10px" }}>
            <div style={{ marginRight: "4px", fontWeight: "bold" }}>
              Description:
            </div>
            {props.canModify &&
            (props.task.task_state === "Open" ||
              props.task.task_state === "ToDo" ||
              props.task.task_state === "Doing") &&
            isEdit ? (
              <textarea
                className="login-username"
                type="text"
                id="des"
                name="des"
                value={des}
                onChange={(e) => setDes(e.target.value)}
                rows="5"
                cols="50"
                style={{ marginBottom: "5px", font: "unset" }}
              />
            ) : (
              <div>{props.task.task_description}</div>
            )}
          </div>

          <div style={{ display: "flex", marginBottom: "10px" }}>
            {props.canModify &&
            (props.task.task_state === "Open" ||
              props.task.task_state === "ToDo" ||
              props.task.task_state === "Doing" ||
              props.task.task_state === "Done") ? (
              <div style={{ display: "flex", marginBottom: "10px" }}>
                <div style={{ marginRight: "4px", fontWeight: "bold" }}>
                  Note:
                </div>
                <textarea
                  className="login-username"
                  type="text"
                  id="note"
                  name="note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows="5"
                  cols="50"
                  style={{ marginBottom: "5px", font: "unset" }}
                />
                <button
                  className="um-button"
                  style={{
                    width: "fit-content",
                    height: "fit-content",
                    marginLeft: "5px",
                  }}
                  onClick={handleNewNote}
                >
                  +
                </button>
              </div>
            ) : (
              <></>
            )}
          </div>

          <div style={{ display: "flex", marginBottom: "10px" }}>
            <div style={{ marginRight: "4px", fontWeight: "bold" }}>Plan:</div>
            {((props.canModify && props.task.task_state === "Open") ||
              props.task.task_state === "Done") &&
            isEdit ? (
              <GroupListSingle
                allGroups={props.allPlans}
                groups={plan}
                setGroups={setPlan}
                label="Plan"
              />
            ) : (
              <div>{props.task.task_plan}</div>
            )}
          </div>
          <div style={{ display: "flex", marginBottom: "10px" }}>
            <div style={{ marginRight: "4px", fontWeight: "bold" }}>
              Application:
            </div>
            <div>{props.task.task_app_acronym}</div>
          </div>
          <div style={{ display: "flex", marginBottom: "10px" }}>
            <div style={{ marginRight: "4px", fontWeight: "bold" }}>State:</div>
            <div>{props.task.task_state}</div>
          </div>
          <div style={{ display: "flex", marginBottom: "10px" }}>
            <div style={{ marginRight: "4px", fontWeight: "bold" }}>Owner:</div>
            <div>{props.task.task_owner}</div>
          </div>
          <div style={{ display: "flex", marginBottom: "10px" }}>
            <div style={{ marginRight: "4px", fontWeight: "bold" }}>
              Creator:
            </div>
            <div>{props.task.task_creator}</div>
          </div>
          <div style={{ display: "flex", marginBottom: "20px" }}>
            <div style={{ marginRight: "4px", fontWeight: "bold" }}>
              Date Created:
            </div>
            <div>{props.task.task_createDate}</div>
          </div>

          {/* OPEN */}
          {props.canModify && props.task.task_state === "Open" ? (
            <div>
              <button
                type="button"
                onClick={handleOpenUpdate}
                className="um-button"
                style={{ marginRight: "10px" }}
              >
                {isEdit ? "Confirm Edit" : "Edit"}
              </button>
              {isEdit ? (
                <></>
              ) : (
                <div style={{ all: "unset" }}>
                  <button
                    type="button"
                    onClick={handleOpenRelease}
                    className="um-button"
                  >
                    Release
                  </button>
                </div>
              )}
            </div>
          ) : (
            <></>
          )}
          {/* TODO */}
          {props.canModify && props.task.task_state === "ToDo" ? (
            <div>
              <button
                type="button"
                onClick={handleToDoUpdate}
                className="um-button"
                style={{ marginRight: "10px" }}
              >
                {isEdit ? "Confirm Edit" : "Edit"}
              </button>
              {isEdit ? (
                <></>
              ) : (
                <div style={{ all: "unset" }}>
                  <button
                    type="button"
                    onClick={handleToDoAccept}
                    className="um-button"
                  >
                    Accept
                  </button>
                </div>
              )}
            </div>
          ) : (
            <></>
          )}

          {/* DOING */}
          {props.canModify && props.task.task_state === "Doing" ? (
            <div>
              <button
                type="button"
                onClick={handleDoingUpdate}
                className="um-button"
                style={{ marginRight: "10px" }}
              >
                {isEdit ? "Confirm Edit" : "Edit"}
              </button>
              {isEdit ? (
                <></>
              ) : (
                <div style={{ all: "unset" }}>
                  <button
                    type="button"
                    onClick={handleDoingReturn}
                    className="um-button"
                    style={{ marginRight: "10px" }}
                  >
                    Return
                  </button>
                  <button
                    type="button"
                    onClick={handleDoingExtension}
                    className="um-button"
                    style={{ marginRight: "10px" }}
                  >
                    Request Extension
                  </button>
                  <button
                    type="button"
                    onClick={handleDoingApproval}
                    className="um-button"
                  >
                    Seek Approval
                  </button>
                </div>
              )}
            </div>
          ) : (
            <></>
          )}
          {/* DONE */}
          {props.canModify && props.task.task_state === "Done" ? (
            <div>
              <button
                type="button"
                onClick={handleDoneReassign}
                className="um-button"
                style={{ marginRight: "10px" }}
              >
                {isEdit ? "Confirm Reassign" : "Reassign Schedule"}
              </button>
              {isEdit ? (
                <></>
              ) : (
                <div style={{ all: "unset" }}>
                  <button
                    type="button"
                    onClick={handleDoneReject}
                    className="um-button"
                    style={{ marginRight: "10px" }}
                  >
                    Reject
                  </button>
                  <button
                    type="button"
                    onClick={handleDoneApprove}
                    className="um-button"
                  >
                    Approve
                  </button>
                </div>
              )}
            </div>
          ) : (
            <></>
          )}
        </div>

        <ViewNotes
          task_id={props.task.task_id}
          setnewNote={setnewNote}
          newNote={newNote}
        />
      </div>
      <div>
        <button
          type="button"
          onClick={handleClose}
          className="um-button"
          style={{
            paddingLeft: "20px",
            paddingRight: "20px",
            width: "fit-content",
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default ShowTask;
