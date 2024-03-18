import React, { useState, useContext, useEffect } from "react";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";
import Axios from "axios";

function ViewNotes(props) {
  const state_con = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const [viewNoteDetails, setviewNoteDetails] = useState([]);
  const [isDateAsc, setisDateAsc] = useState(false);
  const fetchData = async () => {
    try {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: "/user/viewNotes",
        headers: {
          "x-auth-token": state_con.token,
        },
        params: {
          task_id: props.task_id,
        },
      };
      const response = await Axios.request(config);
      response.data.body.reverse();
      setviewNoteDetails(response.data.body);
      props.setnewNote(false);
    } catch (e) {
      dispatch({ type: "flash", value: e.response.data.header });
    }
  };
  useEffect(() => {
    fetchData();
  }, [props.newNote]);
  return (
    <div
      style={{
        width: "34vw",
        overflowY: "auto",

        marginLeft: "1vw",
        overflowX: "auto",
      }}
    >
      <h2 style={{ marginBottom: "0" }}>Notes</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "right",
          marginRight: "15px",
          cursor: "pointer",
        }}
        onClick={(e) => {
          e.preventDefault();
          setisDateAsc(!isDateAsc);
          viewNoteDetails.reverse();
        }}
      >
        Date {isDateAsc ? "↑" : "↓"}
      </div>
      <div
        style={{
          margin: "5px",
          marginBottom: "15px",
        }}
      >
        <div
          style={{
            borderTop: "1px solid black",
            borderBottom: "1px solid black",
          }}
        >
          {viewNoteDetails.map((note) => (
            <div
              key={note.id}
              style={{
                borderLeft: "2px solid black",
                borderRight: "2px solid black",
                borderBottom: "1px solid black",
                borderTop: "1px solid black",
                padding: "10px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "left" }}>
                <div style={{ fontWeight: "bold" }}>State:&nbsp;</div>
                <div style={{ marginRight: "1vw" }}>{note.state}</div>
                <div style={{ fontWeight: "bold" }}>Owner:&nbsp;</div>
                <div style={{ marginRight: "1vw" }}>{note.username}</div>

                <div style={{ fontWeight: "bold" }}>Date/Time:&nbsp;</div>
                <div>{note.created_at}</div>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "left",
                  textAlign: "left",
                }}
              >
                <div>{note.note}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ViewNotes;
