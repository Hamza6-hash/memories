import { useSelector, useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { setUserPost, setUserPosts, deleteeUserPost, setPost } from "../state";

import {
  Card,
  CardHeader,
  CardMedia,
  CardActions,
  CardContent,
  Avatar,
  IconButton,
  Typography,
  Divider,
  Button,
  TextField,
  FormControl,
  Stack,
  Paper,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Modal,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../components/widgets/Header";

import {
  Favorite,
  Delete,
  Forum,
  Edit,
  DeleteForever,
} from "@mui/icons-material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import moment from "moment";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import AccountCircleTwoToneIcon from "@mui/icons-material/AccountCircleTwoTone";
import "../CustomScrollbar.css";

const profileStyles = {
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "16px",
    marginTop: "80px",
  },
  avatar: {
    width: "100px",
    height: "100px",
    marginBottom: "10px",
  },
  name: {
    marginTop: "8px",
    fontWeight: "bold",
  },
  bio: {
    marginTop: "4px",
  },
  button: {
    marginTop: "16px",
  },
  editForm: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: "16px",
  },
  inputField: {
    marginBottom: "8px",
  },
};

const Profile = () => {
  /* States */
  const [firstName, setFirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [bio, setBio] = useState("");
  const [picturePath, setPicturePath] = useState("");
  const [description, setDescription] = useState("");
  const [comment, setComment] = useState("");
  const [editComment, setEditComment] = useState("");
  const [title, setTitle] = useState("");
  const [openProfile, setOpenProfile] = useState(false);
  const [input, setInput] = useState(false);
  const [editPost, setEditPost] = useState("");
  const [editProfile, setEditProfile] = useState(false);
  const [edit, setEdit] = useState(false);
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  /* Reading states from react-redux */
  const { _id } = useSelector((state) => state.user);
  const userId = _id;
  const token = useSelector((state) => state.token);

  const [user, setUser] = useState(null);
  const userPosts = useSelector((state) => state.userPosts);

  /* Patch requst to update the user comments */
  const commentPost = async (id, e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:3001/user/post/comment/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, comment }),
    });
    const updatedPosts = await res.json();
    if (res.ok) {
      setComment(null);
    }

    // console.log(updatedPost);
    dispatch(setPost({ post: updatedPosts }));
  };

  useEffect(() => {
    getPost();
    getUserProfile();
    // eslint-disable-next-line
  }, []);

  /* Getting User profile */
  const getUserProfile = async () => {
    try {
      const response = await fetch(`http://localhost:3001/users/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  /* Editing User profile */
  const editProfileInfo = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("bio", bio);
    formData.append("picturePath", picturePath.name);

    try {
      const res = await fetch(
        `http://localhost:3001/users/profile/update/${id}`,
        {
          method: "PATCH",

          body: formData,
        }
      );
      if (res.ok) {
        navigate(`/`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  /* Editing authorize user Profile picture */
  const editProfilePicture = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("picturePath", picturePath.name);

    const res = await fetch(`http://localhost:3001/users/picupdate/${_id}`, {
      method: "PATCH",
      body: formData,
    });
    const data = await res.json();
    console.log(data);
  };

  /* Deleting authorize user post */
  const deletePost = async (id) => {
    await fetch(`http://localhost:3001/user/post/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch(deleteeUserPost({ id }));
  };

  /* Getting User Profile who has been clicked */
  const getPost = async () => {
    try {
      const response = await fetch(`http://localhost:3001/user/post/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      dispatch(setUserPosts({ userPosts: data }));
    } catch (error) {
      console.log(error);
    }
  };

  // console.log(localStorage.getItem("userId"));

  /* Patch request for likes */
  const patchLike = async (postId) => {
    const response = await fetch(
      `http://localhost:3001/user/post/likes/${postId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      }
    );
    const updatedUserPosts = await response.json();
    dispatch(setUserPost({ userPost: updatedUserPosts }));
  };

  /* Patch requset for editing post  */
  const updatePost = async (id, e) => {
    e.preventDefault();
    const res = await fetch(`http://localhost:3001/user/post/edit/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ description, title }),
    });
    if (res.ok) {
      setInput(false);
    }
    const updatedPost = await res.json();
    dispatch(setUserPost({ userPost: updatedPost }));
  };

  /* Delete Comment request */
  const deleteComment = async (id, commentId) => {
    console.log(commentId);
    try {
      const res = await fetch(
        `http://localhost:3001/user/post/comment/delete/${id}/${commentId}`,
        {
          method: "DELETE",
        }
      );
      const updatedPosts = await res.json();
      dispatch(setPost({ post: updatedPosts }));
    } catch (error) {
      console.log(error);
    }
  };

  if (!user) return null;

  return (
    <>
      <Header />

      <Modal open={openProfile} onClose={() => setOpenProfile(false)}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "400px",
          }}
        >
          <IconButton onClick={() => setOpenProfile(false)}>
            <CloseOutlinedIcon />
          </IconButton>
          <img
            style={{
              maxWidth: "50%",
              maxHeight: "100%",
              objectFit: "cover",
              marginTop: "10%",
            }}
            src={`http://localhost:3001/assets/${user.picturePath}`}
            alt=""
          />
        </div>
      </Modal>

      <div style={profileStyles.root}>
        {editProfile ? (
          <div style={profileStyles.editForm}>
            <form onSubmit={editProfileInfo}>
              <FormControl>
                <Typography color="error" variant="h5">
                  Note: All Details should be filled
                </Typography>

                <IconButton>
                  <label htmlFor="profile-picture-upload">
                    <AccountCircleTwoToneIcon sx={profileStyles.avatar} />
                    Edit Profile
                  </label>
                  <input
                    id="profile-picture-upload"
                    type="file"
                    value={""}
                    style={{ display: "none" }}
                    onChange={(e) => setPicturePath(e.target.files[0])}
                  />
                </IconButton>

                {picturePath ? <p>{picturePath.name}</p> : null}
                <TextField
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  sx={profileStyles.inputField}
                  required
                />

                <TextField
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setlastName(e.target.value)}
                  sx={profileStyles.inputField}
                  required
                />

                <TextField
                  label="Bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  sx={profileStyles.inputField}
                  required
                />

                <Button variant="contained" color="primary" type="submit">
                  Save
                </Button>
              </FormControl>
            </form>

            <Button
              variant="contained"
              color="error"
              sx={{ mt: "10px" }}
              onClick={() => setEditProfile(false)}
            >
              Cancel
            </Button>
          </div>
        ) : (
          <>
            {edit ? (
              <div style={profileStyles.root}>
                <form onSubmit={editProfilePicture}>
                  <IconButton>
                    <label htmlFor="profile-picture-upload">
                      <AccountCircleTwoToneIcon sx={profileStyles.avatar} />
                      Edit Profile
                    </label>

                    <input
                      id="profile-picture-upload"
                      type="file"
                      value={""}
                      style={{ display: "none" }}
                      onChange={(e) => setPicturePath(e.target.files[0])}
                    />
                  </IconButton>

                  {picturePath ? <p>{picturePath.name}</p> : null}
                  <Button type="submit" variant="contained" color="primary">
                    Update
                  </Button>
                </form>
              </div>
            ) : (
              <IconButton onClick={() => setOpenProfile(true)}>
                <Avatar
                  src={`http://localhost:3001/assets/${user.picturePath}`}
                  style={profileStyles.avatar}
                />
              </IconButton>
            )}

            {id === _id ? (
              <IconButton
                onClick={() => (edit ? setEdit(false) : setEdit(true))}
              >
                <Edit />
              </IconButton>
            ) : null}

            <Typography variant="h5" style={profileStyles.name}>
              {user.firstName} {user.lastName}
            </Typography>

            <Typography variant="body1" style={profileStyles.bio}>
              {user.bio}
            </Typography>

            <Typography variant="body1" style={profileStyles.bio}>
              {user.email}
            </Typography>
            {moment(user.loginTime).fromNow() <
            moment(user.logoutTime).fromNow() ? (
              <Typography>Active Now</Typography>
            ) : (
              <Typography>
                Active: {moment(user.logoutTime).fromNow()}
              </Typography>
            )}

            <Typography variant="body1" style={profileStyles.bio}>
              Member since {moment(user.createdAt).format("YYYY-MM-DD")}
            </Typography>

            {user._id === _id ? (
              <Button
                variant="contained"
                color="primary"
                style={profileStyles.button}
                onClick={() => setEditProfile(true)}
              >
                Edit Profile
              </Button>
            ) : null}
          </>
        )}
      </div>
      <Divider />

      {userPosts.map((posts) => (
        <div key={posts._id} className="article" style={{ marginTop: "80px" }}>
          <Card className="card" sx={{ maxWidth: 300 }}>
            <CardHeader
              sx={{ fontFamily: "sans-serif" }}
              avatar={
                <Avatar
                  alt="poster-profile-pic"
                  src={`http://localhost:3001/assets/${posts.userId.picturePath}`}
                />
              }
              action={
                posts.userId._id === _id ? (
                  <IconButton
                    onClick={() => {
                      input ? setInput(false) : setInput(true);
                      setEditPost(posts._id);
                      setDescription(posts.description);
                      setTitle(posts.title);
                    }}
                  >
                    <Edit />
                  </IconButton>
                ) : null
              }
              title={
                editPost === posts._id && input ? (
                  <TextField
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    variant="standard"
                  />
                ) : (
                  <Typography>
                    {posts.userId.firstName} {posts.userId.lastName}
                    {posts.userId.bio} has shared a memory about {posts.title}
                    ...
                  </Typography>
                )
              }
              subheader={`${moment(posts.createdAt).fromNow()}`}
            />
            {posts.picturePath ? (
              <CardMedia
                component="img"
                height={"auto"}
                image={`http://localhost:3001/assets/${posts.picturePath}`}
                alt="post"
              />
            ) : (
              <Typography textAlign="center" variant="h1">
                Memory
              </Typography>
            )}
            <CardContent>
              {editPost === posts._id && input ? (
                <form onSubmit={(e) => updatePost(posts._id, e)}>
                  <textarea
                    rows={5}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{
                      width: "100%",
                      backgroundColor: "inherit",
                      color: "whitesmoke",
                      resize: "none",
                    }}
                    value={description}
                    autoFocus
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    color="warning"
                    sx={{ mt: "10px" }}
                  >
                    Edit
                  </Button>
                </form>
              ) : (
                <Typography variant="body1" color="text.secondary">
                  {posts.description}
                </Typography>
              )}
            </CardContent>
            <CardActions disableSpacing>
              <Paper>
                <Stack
                  direction="row"
                  divider={<Divider orientation="vertical" flexItem />}
                  spacing={2}
                >
                  <IconButton onClick={() => patchLike(posts._id)}>
                    {posts.likes[userId] ? (
                      <Favorite color="error" />
                    ) : (
                      <FavoriteBorderOutlinedIcon />
                    )}
                  </IconButton>
                  <Typography
                    sx={{
                      position: "relative",
                      top: 8,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {Object.keys(posts.likes).length} Likes
                  </Typography>
                  <IconButton
                    onClick={() => {
                      handleOpen();
                      setEditComment(posts._id);
                    }}
                  >
                    <Forum color="primary" />
                  </IconButton>
                  <Typography
                    sx={{
                      position: "relative",
                      top: 8,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {posts.comments.length} Comments
                  </Typography>

                  {posts.userId._id === _id ? (
                    <IconButton onClick={() => deletePost(posts._id)}>
                      <Delete color="warning" />
                    </IconButton>
                  ) : null}
                </Stack>
              </Paper>
            </CardActions>
          </Card>
          {editComment === posts._id ? (
            <Dialog
              sx={{ "& .MuiPaper-root": { backgroundColor: "#153e54" } }}
              open={open}
              fullScreen
              onClose={handleClose}
            >
              <DialogTitle>Public Comments</DialogTitle>

              <DialogContent>
                {posts.comments.map((comment, index) => (
                  <>
                    {
                      <Box display="flex">
                        <div>
                          <IconButton>
                            <Avatar
                              src={`http://localhost:3001/assets/${comment.userId.picturePath}`}
                              sx={{
                                width: "60px",
                                height: "60px",
                                objectFit: "cover",
                              }}
                            />
                          </IconButton>
                        </div>

                        <Paper
                          sx={{
                            mt: "12px",
                            p: "10px",
                            mb: index !== comment.length - 1 ? "5px" : 0,
                          }}
                          display="flex"
                        >
                          <Typography>
                            {comment.userId.firstName} {""}
                            {comment.userId.lastName}
                          </Typography>
                          <Typography>{comment.comment}</Typography>
                          <Divider />
                          <Divider />
                          <Divider />
                          <Box display="flex">
                            <Typography sx={{ mt: "7px" }}>
                              {moment(comment.date).fromNow()}
                            </Typography>
                            {comment.userId._id === posts.userId._id ? (
                              <IconButton
                                onClick={() =>
                                  deleteComment(posts._id, comment._id)
                                }
                              >
                                <DeleteForever color="error" />
                              </IconButton>
                            ) : null}
                          </Box>
                        </Paper>
                      </Box>
                    }
                  </>
                ))}
              </DialogContent>

              <DialogActions>
                <form onSubmit={(e) => commentPost(posts._id, e)}>
                  <TextField
                    fullWidth
                    autoFocus
                    variant="standard"
                    margin="dense"
                    onChange={(e) => setComment(e.target.value)}
                  />

                  <Button
                    disabled={!comment}
                    type="submit"
                    variant="contained"
                    color="warning"
                  >
                    Comment
                  </Button>
                </form>
                <Button onClick={handleClose}>Cancel</Button>
              </DialogActions>
            </Dialog>
          ) : null}
        </div>
      ))}
      <Typography textAlign="center" variant="body1" color="text.secondary">
        Join Since {moment(user.createdAt).fromNow()}
      </Typography>
    </>
  );
};

export default Profile;
