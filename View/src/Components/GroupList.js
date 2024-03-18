import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

function GroupList(props) {
  const ITEM_HEIGHT = 40;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: "ITEM_HEIGHT * 4",
        width: 200,
      },
    },
  };
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    props.setGroups(typeof value === "string" ? value.split(",") : value);
  };
  return (
    <div className="add_user_elements">
      <FormControl
        size="small"
        sx={{
          width: 150,
        }}
      >
        <InputLabel id="demo-multiple-checkbox-label">Group</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={props.groups}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          {props.allGroups.map((name) => (
            <MenuItem key={name} value={name}>
              <Checkbox checked={props.groups.indexOf(name) > -1} />
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default GroupList;
