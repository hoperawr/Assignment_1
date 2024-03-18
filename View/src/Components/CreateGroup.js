import React, { useContext, useState } from "react";
import StateContext from "../StateContext";
import Axios from "axios";
import DispatchContext from "../DispatchContext";

function CreateGroup(props) {
  const state = useContext(StateContext);
  const dispatch = useContext(DispatchContext);
  const [group, setGroup] = useState();
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      let config = {
        method: "post",
        maxBodyLength: Infinity,
        url: `/admin/addGroup`,
        headers: {
          "x-auth-token": `${state.token}`,
        },
        data: {
          group: group,
        },
      };
      const response = await Axios.request(config);
      dispatch({ type: "flash", value: response.data.header });
      props.setisCreateGroup(!props.isCreateGroup);
      props.fetchData();
      if (props.isAddUser) {
        props.setisAddUser(false);
      }
    } catch (e) {
      dispatch({ type: "flash", value: e.response.data.header });
    }
  }
  return (
    <ul className="add_create_ul">
      {!props.isCreateGroup ? (
        <button
          className="um-button"
          onClick={() => props.setisCreateGroup(!props.isCreateGroup)}
        >
          Create Group
        </button>
      ) : (
        <></>
      )}
      {props.isCreateGroup ? (
        <form onSubmit={handleSubmit}>
          <label className="add_user_elements"> Group </label>
          <input
            type="text"
            id="group"
            name="group"
            onChange={(e) => setGroup(e.target.value)}
            required
            className="add_user_elements"
            autocomplete="off"
          />
          <button type="submit" className="add_user_elements um-button">
            Submit
          </button>
          <button
            onClick={() => props.setisCreateGroup(!props.isCreateGroup)}
            className="add_user_elements um-button"
          >
            Cancel
          </button>
        </form>
      ) : (
        <></>
      )}
    </ul>
  );
}

export default CreateGroup;
