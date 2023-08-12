import React from "react";
import { useSelector } from "react-redux";
import {
  Typography,
  Box,
  ListItem,
  ListItemAvatar,
  IconButton,
  List,
  ListItemText,
  Avatar,
} from "@mui/material";
import { Link } from "react-router-dom";

export default function AccountSideBar() {
  const user = useSelector((state) => state.user);
  return (
    <div className="account-sidebar">
      <Box sx={{ width: "300px", backgroundColor: "#333333", padding: "16px" }}>
        <Typography variant="h6">Your Account</Typography>
        <List>
          <ListItem>
            <ListItemAvatar>
              <IconButton>
                <Link to={`/profile/${user._id}`}>
                  <Avatar
                    sx={{ width: "60px", height: "60px", objectFit: "cover" }}
                    src={`http://localhost:3001/assets/${user.picturePath}`}
                  />
                </Link>
              </IconButton>
            </ListItemAvatar>
            <ListItemText
              sx={{ ml: "5px" }}
              primary={`${user.firstName} ${user.lastName}`}
            />
          </ListItem>
          <ListItem>
            <Typography>{user.bio}</Typography>
          </ListItem>
        </List>
      </Box>
    </div>
  );
}
