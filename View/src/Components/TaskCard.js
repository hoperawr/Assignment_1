import React, { useState } from "react";
import ShowTask from "./ShowTask";

function TaskCard(props) {
  const [isShow, setisShow] = useState(false);
  return (
    <div>
      {isShow ? (
        <ShowTask
          isShow={isShow}
          setisShow={setisShow}
          task={props.task}
          canModify={props.canModify}
          setisShowOpen={props.setisShowOpen}
          allPlans={props.allPlans
            .filter((x) => props.task.task_app_acronym === x[0])
            .map((x) => x[1])}
          fetchData={props.fetchData}
        />
      ) : (
        <></>
      )}
      <div
        onClick={() => {
          if (!props.isShowOpen) {
            setisShow(true);
            props.setisShowOpen(true);
          }
        }}
        className="sticky-note"
        style={{
          backgroundImage: `linear-gradient(90deg, ${props.color} 0%, transparent 100%)`,
        }}
      >
        {props.canModify ? (
          <div
            style={{
              position: "absolute",
              left: "10px",
              top: "5px",
              fontWeight: "1000",
            }}
            className=""
          >
            !!!
          </div>
        ) : (
          <></>
        )}
        <div>
          <h3 style={{ marginBottom: "10px" }}>{props.task.task_name}</h3>
          <div style={{ marginBottom: "10px" }}>
            {props.task.task_description}
          </div>
          <div>Task ID: {props.task.task_id}</div>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
