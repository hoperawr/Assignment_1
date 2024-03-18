import * as React from "react";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import ListItemText from "@mui/material/ListItemText";

function GroupListSingle(props) {
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
    props.setGroups(value);
  };

  return (
    <div className="add_user_elements">
      <FormControl size="small" sx={{ width: 150 }}>
        <InputLabel id="demo-single-select-label">{props.label}</InputLabel>
        <Select
          labelId="demo-single-select-label"
          id="demo-single-select"
          value={props.groups || ""}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected}
          MenuProps={MenuProps}
        >
          {props.allGroups.map((name) => (
            <MenuItem key={name} value={name}>
              <ListItemText primary={name} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default GroupListSingle;
