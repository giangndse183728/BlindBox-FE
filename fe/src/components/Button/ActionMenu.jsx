import React, { useState } from "react";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ActionMenu = ({ onEdit, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreVertIcon style={{ color: "white" }} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "rgba(30, 30, 30, 0.6)", // Dark with transparency
            color: "#ffffff", // Light text
            backdropFilter: "blur(10px)", // Blur effect
            boxShadow: "0px 4px 12px rgba(255, 255, 255, 0.15)", // Soft light glow
            borderRadius: "12px", // Rounded edges
            border: "1px solid rgba(255, 255, 255, 0.2)", // Subtle border for depth
          },
        }}
      >
        <MenuItem
          onClick={() => { handleClose(); onEdit(); }}
          sx={{
            color: "#ffffff",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
          }}
        >
          <EditIcon sx={{ marginRight: 1, color: "#ddd" }} /> Edit
        </MenuItem>
        <MenuItem
          onClick={() => { handleClose(); onDelete(); }}
          sx={{
            color: "#ffffff",
            "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.1)" },
          }}
        >
          <DeleteIcon sx={{ marginRight: 1, color: "red" }} /> Delete
        </MenuItem>
      </Menu>
    </>
  );
};

export default ActionMenu;
