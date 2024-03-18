import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import CreateTask from "../Components/CreateTask";
import TaskCard from "../Components/TaskCard";
import StateContext from "../StateContext";
import DispatchContext from "../DispatchContext";

function TaskHome() {
  const navigate = useNavigate();
  const params = useParams();
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const columns = ["Open", "ToDo", "Doing", "Done", "Close"];
  const [isCreate, setisCreate] = useState(false);
  const [allPermits, setallPermits] = useState({});
  const [allUserGroups, setallUserGroups] = useState([]);
  const [permitCreate, setpermitCreate] = useState("");
  const [isShowOpen, setisShowOpen] = useState(false);
  const [tasks, setTasks] = useState([{}]);
  const [allApps, setallApps] = useState([]);
  const [allPlans, setAllPlans] = useState([]);
  const [allColor, setallColor] = useState({});

  const fetchData = async () => {
    try {
      let config;
      if (params.plan_name === undefined) {
        config = {
          method: "get",
          maxBodyLength: Infinity,
          url: "/user/getTasks",
          headers: {
            "x-auth-token": state.token,
          },
          params: { app: params.app_name },
        };
      } else {
        config = {
          method: "get",
          maxBodyLength: Infinity,
          url: "/user/getTasks",
          headers: {
            "x-auth-token": state.token,
          },
          params: { app: params.app_name, plan: params.plan_name },
        };
      }
      const response = await Axios.request(config);
      setTasks(response.data.body);
      let config_2 = {
        method: "get",
        maxBodyLength: Infinity,
        url: "/user/getAppsNames",
        headers: {
          "x-auth-token": state.token,
        },
      };
      const response_2 = await Axios.request(config_2);
      setallApps(response_2.data.body.map((x) => x.app_acronym));
      setallPermits(
        Object.fromEntries(
          response_2.data.body
            .filter((item) => item.app_acronym === params.app_name)
            .map((item) => [item.app_acronym, item])
        )
      );
      setpermitCreate(
        response_2.data.body.filter((x) => x.app_acronym === params.app_name)[0]
          .app_permit_create
      );

      let config_3 = {
        method: "get",
        maxBodyLength: Infinity,
        url: "/user/getPlansNames",
        headers: {
          "x-auth-token": state.token,
        },
      };
      const response_3 = await Axios.request(config_3);
      setAllPlans(
        response_3.data.body.map((x) => [x.plan_app_acronym, x.plan_mvp_name])
      );

      let temp = {};
      for (const x of response_3.data.body) {
        temp[x["plan_mvp_name"]] = x["color"];
      }
      setallColor(temp);

      let config_4 = {
        method: "get",
        maxBodyLength: Infinity,
        url: "/user/getUserGroups",
        headers: {
          "x-auth-token": state.token,
        },
      };
      const response_4 = await Axios.request(config_4);
      setallUserGroups(response_4.data.body.map((x) => x.groupname));
    } catch (e) {
      console.log(e);
      dispatch({ type: "flash", value: e.response.data.header });
    }
  };

  const hasPermits = (task) => {
    if (task.task_app_acronym in allPermits) {
      const app = task.task_app_acronym;
      if (task.task_state === "Open") {
        if (allUserGroups.includes(allPermits[`${app}`].app_permit_open)) {
          return true;
        } else {
          return false;
        }
      } else if (task.task_state === "ToDo") {
        if (allUserGroups.includes(allPermits[`${app}`].app_permit_toDoList)) {
          return true;
        } else {
          return false;
        }
      } else if (task.task_state === "Doing") {
        if (allUserGroups.includes(allPermits[`${app}`].app_permit_doing)) {
          return true;
        } else {
          return false;
        }
      } else if (task.task_state === "Done") {
        if (allUserGroups.includes(allPermits[`${app}`].app_permit_done)) {
          return true;
        } else {
          return false;
        }
      } else if (task.task_state === "Close") {
        return false;
      } else {
        console.log("Error in hasPermits");
      }
    } else {
      return false;
    }
  };

  const handleBack = (e) => {
    e.preventDefault();
    if (params.plan_name === undefined) {
      navigate(`/app`);
    } else {
      navigate(`/app/${params.app_name}/plan`);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      {isCreate ? (
        <CreateTask
          isCreate={isCreate}
          setisCreate={setisCreate}
          allApps={allApps}
          allPlans={allPlans}
          fetchData={fetchData}
        />
      ) : (
        <></>
      )}
      <h2 className="login-header">Task</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        {allUserGroups.includes(permitCreate) ? (
          <button
            onClick={() => setisCreate(!isCreate)}
            className="um-button"
            style={{ marginRight: "10px" }}
          >
            {" "}
            Create Task{" "}
          </button>
        ) : (
          <></>
        )}
        <button onClick={handleBack} className="um-button">
          Back
        </button>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {columns.map((column) => (
          <div
            key={column}
            style={{ width: "220px", height: "200px", textAlign: "center" }}
          >
            <h2>{column}</h2>
            <ul style={{ all: "unset" }}>
              {tasks
                .filter((task) => task.task_state === column)
                .map((task) => (
                  <TaskCard
                    key={task.task_id}
                    task={task}
                    allPlans={allPlans}
                    canModify={hasPermits(task)}
                    isShowOpen={isShowOpen}
                    setisShowOpen={setisShowOpen}
                    fetchData={fetchData}
                    color={
                      task.task_plan === ""
                        ? "#FFFFFF"
                        : allColor[task.task_plan]
                    }
                  />
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaskHome;
