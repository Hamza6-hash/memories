import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  Avatar,
  Typography,
  IconButton,
  ListItemIcon,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
// import PersonRemoveOutlinedIcon from "@mui/icons-material/PersonRemoveOutlined";

export default function FollowerSideBar() {
  const token = useSelector((state) => state.token);
  const [people, setPeople] = useState(null);

  const getUsers = async () => {
    try {
      const response = await fetch("http://localhost:3001/users/are/exist", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const users = await response.json();
      //   console.log(users);
      setPeople(users);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line
  }, []);

  if (!people) return null;

  return (
    <div className="follow-side-bar">
      <Box sx={{ width: "300px", backgroundColor: "#333333", padding: "16px" }}>
        <Typography variant="h6">Follow Suggestion</Typography>
        <List>
          {people.map((user, index) => (
            <ListItem key={index}>
              <ListItemAvatar>
                <IconButton>
                  <Link to={`/profile/${user._id}`}>
                    <Avatar
                      sx={{ objectFit: "cover", width: "60px", height: "60px" }}
                      src={`http://localhost:3001/assets/${user.picturePath}`}
                    />
                  </Link>
                </IconButton>
              </ListItemAvatar>
              <ListItemText
                sx={{ ml: "5px" }}
                primary={`${user.firstName} ${user.lastName}`}
              />
              <ListItemIcon>
                <IconButton>
                  <PersonAddOutlinedIcon />
                </IconButton>
              </ListItemIcon>
            </ListItem>
          ))}
        </List>
      </Box>
    </div>
  );
}
