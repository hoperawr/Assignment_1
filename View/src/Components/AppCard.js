import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import DispatchContext from "../DispatchContext";
import EditApp from "./EditApp";

function AppCard(props) {
  const navigate = useNavigate();
  const dispatch = useContext(DispatchContext);
  const [isEdit, setisEdit] = useState(false);
  const handleSubmit = () => {
    if (props.isPlans) {
      navigate(`/app/${props.app.app_acronym}/plan`);
    } else {
      navigate(`/app/${props.app.app_acronym}/task`);
    }
  };
  const handleEdit = (e) => {
    e.preventDefault();
    if (!props.isEditHome && !isEdit) {
      props.setisEditHome(true);
      setisEdit(true);
    }
  };
  return (
    <tr>
      {isEdit ? (
        <EditApp
          allGroups={props.allGroups}
          isEdit={isEdit}
          setisEdit={setisEdit}
          setisEditHome={props.setisEditHome}
          acronym={props.app.app_acronym}
          description={props.app.app_description}
          start={props.app.app_startDate}
          end={props.app.app_endDate}
          create={props.app.app_permit_create}
          open={props.app.app_permit_open}
          todo={props.app.app_permit_toDoList}
          doing={props.app.app_permit_doing}
          done={props.app.app_permit_done}
          fetchData={props.fetchData}
        />
      ) : (
        <></>
      )}
      <td onClick={handleSubmit} style={{ cursor: "pointer" }}>
        {props.app.app_acronym}
      </td>
      <td onClick={handleSubmit} style={{ cursor: "pointer" }}>
        {props.app.app_description}
      </td>
      <td onClick={handleSubmit} style={{ cursor: "pointer" }}>
        {props.app.app_startDate}
      </td>
      <td onClick={handleSubmit} style={{ cursor: "pointer" }}>
        {props.app.app_endDate}
      </td>
      <td onClick={handleSubmit} style={{ cursor: "pointer" }}>
        {props.app.app_permit_create}
      </td>
      <td onClick={handleSubmit} style={{ cursor: "pointer" }}>
        {props.app.app_permit_open}
      </td>
      <td onClick={handleSubmit} style={{ cursor: "pointer" }}>
        {props.app.app_permit_toDoList}
      </td>
      <td onClick={handleSubmit} style={{ cursor: "pointer" }}>
        {props.app.app_permit_doing}
      </td>
      <td onClick={handleSubmit} style={{ cursor: "pointer" }}>
        {props.app.app_permit_done}
      </td>
      {props.userGroups.includes("Project Lead") ? (
        <td>
          <button
            style={{ zIndex: "1" }}
            onClick={handleEdit}
            className="um-button"
          >
            Edit
          </button>
        </td>
      ) : (
        <></>
      )}
    </tr>
  );
}

export default AppCard;
