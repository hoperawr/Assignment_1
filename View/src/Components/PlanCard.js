import React, { useState, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import DispatchContext from "../DispatchContext";
import EditPlan from "./EditPlan";

function PlanCard(props) {
  const navigate = useNavigate();
  const dispatch = useContext(DispatchContext);
  const params = useParams();
  const [isEdit, setisEdit] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/app/${params.app_name}/plan/${props.plan.plan_mvp_name}/task`);
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
        <EditPlan
          setisEditHome={props.setisEditHome}
          setisEdit={setisEdit}
          plan_mvp_name={props.plan.plan_mvp_name}
          fetchData={props.fetchData}
          start={props.plan.plan_startDate}
          end={props.plan.plan_endDate}
          color={props.plan.color}
        />
      ) : (
        <></>
      )}
      <td onClick={handleSubmit} style={{ cursor: "pointer" }}>
        {props.plan.plan_mvp_name}
      </td>
      <td onClick={handleSubmit} style={{ cursor: "pointer" }}>
        {props.plan.plan_startDate}
      </td>
      <td onClick={handleSubmit} style={{ cursor: "pointer" }}>
        {props.plan.plan_endDate}
      </td>
      <td onClick={handleSubmit} style={{ cursor: "pointer" }}>
        {props.plan.plan_app_acronym}
      </td>
      <td style={{ cursor: "pointer" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",

            alignItems: "center",
          }}
        >
          {props.plan.color}
          <div
            style={{
              width: "15px",
              height: "15px",
              backgroundColor: `${props.plan.color}`,
              marginLeft: "5px",
            }}
          />
        </div>
      </td>
      {props.userGroups.includes("Project Manager") ? (
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

export default PlanCard;
