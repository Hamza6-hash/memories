import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Avatar,
  useMediaQuery,
  Tooltip,
} from "@mui/material";

import {
  Menu,
  Home,
  Logout,
  WbSunny,
  DirectionsRun,
  Brightness3,
  People,
} from "@mui/icons-material";

import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { Link } from "react-router-dom";
import Post from "./Post";
import { setLogout } from "../../state";
import moment from "moment";

function Header() {
  /* States */
  const isMobileScreens = useMediaQuery("(max-width: 1000px)");
  const [openDrawer, setOpenDrawer] = useState(false);

  /* Reading react-redux stores */
  const user = useSelector((state) => state.user);
  const { _id } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  /* Greeting User */
  const currentHour = new Date().getHours();
  let greeting;
  let icon;

  if (currentHour >= 0 && currentHour < 12) {
    greeting = "Good Morning";
    icon = <DirectionsRun fontSize="large" color="secondary" />;
  } else if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good Afternoon";
    icon = <WbSunny fontSize="large" color="warning" />;
  } else {
    greeting = "Good Evening";
    icon = <Brightness3 fontSize="large" color="primary" />;
  }

  /* Opening drawer for screen width 1000px */
  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const logout = async (id) => {
    try {
      await fetch(`http://localhost:3001/auth/user/logout/${id}`, {
        method: "PATCH",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          {isMobileScreens ? (
            <IconButton color="inherit" edge="start" onClick={toggleDrawer}>
              <Menu />
            </IconButton>
          ) : null}
          {isMobileScreens ? null : (
            <Typography
              variant="h5"
              component="div"
              sx={{ flexGrow: 1, fontStyle: "italic" }}
            >
              MEMORIES
            </Typography>
          )}

          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, whiteSpace: "nowrap" }}
          >
            {greeting} {user.firstName} {user.lastName}
            {icon}
          </Typography>

          {isMobileScreens ? null : (
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <IconButton
                sx={{ mr: "10px" }}
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                color="inherit"
              >
                {moment(user.loginTime).fromNow() >
                  moment(user.logoutTime).fromNow() ||
                moment(!user.logoutTime).fromNow() ? (
                  <Typography>Active Now</Typography>
                ) : (
                  <Typography>
                    Active: {moment(user.logoutTime).fromNow()}
                  </Typography>
                )}
                <Link
                  style={{ color: "inherit", textDecoration: "none" }}
                  to={`/profile/${_id}`}
                >
                  <Avatar
                    sx={{ objectFit: "cover" }}
                    src={`http://localhost:3001/assets/${user.picturePath}`}
                  />
                </Link>
              </IconButton>

              <IconButton sx={{ mr: "10px" }}>
                <Link to="/users">
                  <People color="secondary" fontSize="large" />
                </Link>
              </IconButton>

              <IconButton sx={{ mr: "10px" }}>
                <Link to={"/home"}>
                  <Home color="primary" fontSize="large" />
                </Link>
              </IconButton>

              <Tooltip arrow title="logout">
                <Link to={"/"}>
                  <IconButton
                    onClick={() => {
                      dispatch(setLogout());
                      logout(user._id);
                    }}
                    sx={{ mr: "10px" }}
                  >
                    <Logout fontSize="large" color="error" />
                  </IconButton>
                </Link>
              </Tooltip>
            </Box>
          )}
        </Toolbar>

        {/* For width only and below 1000px  */}
        <Drawer
          sx={{
            "& .MuiPaper-root": {
              backgroundColor: "black",
            },
          }}
          anchor="left"
          open={openDrawer}
          onClose={toggleDrawer}
        >
          <List>
            {isMobileScreens ? (
              <ListItem>
                <Typography>Memories</Typography>
              </ListItem>
            ) : null}

            <ListItem>
              <ListItemIcon>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-haspopup="true"
                  color="inherit"
                >
                  <Link
                    style={{ color: "inherit", textDecoration: "none" }}
                    to={`/profile/${_id}`}
                  >
                    <Avatar
                      alt="profile pic"
                      sx={{ objectFit: "cover" }}
                      src={`http://localhost:3001/assets/${user.picturePath}`}
                    />
                  </Link>
                </IconButton>
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItem>

            <Link
              style={{ color: "inherit", textDecoration: "none" }}
              to={"/home"}
            >
              <ListItem button>
                <ListItemIcon>
                  <Home color="primary" />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItem>
            </Link>

            <Link
              style={{ color: "inherit", textDecoration: "none" }}
              to="/users"
            >
              <ListItem button>
                <ListItemIcon>
                  <People color="secondary" fontSize="large" />
                </ListItemIcon>
                <ListItemText primary="Memory Members" />
              </ListItem>
            </Link>

            <Link style={{ color: "inherit", textDecoration: "none" }} to={"/"}>
              <ListItem button>
                <ListItemIcon
                  onClick={() => {
                    dispatch(setLogout());
                    logout(user._id);
                  }}
                >
                  <Logout color="error" />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </Link>
          </List>
        </Drawer>
      </AppBar>

      <Post />
    </>
  );
}

export default Header;
