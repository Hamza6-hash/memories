import { Link } from "react-router-dom";
import moment from "moment";
import { setPosts, setPost, deleteePost } from "../state";
import { useEffect, useState } from "react";

import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  IconButton,
  Typography,
  Stack,
  Divider,
  Paper,
  TextField,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  CircularProgress,
  Box,
} from "@mui/material";

import { DeleteForever, Edit, Forum } from "@mui/icons-material";
import DeleteIcon from "@mui/icons-material/Delete";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useSelector, useDispatch } from "react-redux";

export default function User() {
  /* States  */
  const [input, setInput] = useState(false);
  const [editPost, setEditPost] = useState("");
  const [editComment, setEditComment] = useState("");
  const [comment, setComment] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [open, setOpen] = useState(false);

  /* React-redux stores states */
  const { _id } = useSelector((state) => state.user);
  const userId = _id;
  const token = useSelector((state) => state.token);
  const post = useSelector((state) => state.posts);

  const dispatch = useDispatch();

  /* Dialog Controls methods */
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  /* Get request to the backend for all posts */
  const getPosts = async () => {
    try {
      const response = await fetch("http://localhost:3001/user/posts", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      dispatch(setPosts({ posts: data }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPosts();
    // eslint-disable-next-line
  }, []);

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

  /* Delete request for post of authorize user */
  const deletePost = async (id) => {
    await fetch(`http://localhost:3001/user/post/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch(deleteePost({ id }));
  };

  /* Patch request for updating likes  */
  const patchLike = async (id) => {
    const response = await fetch(
      `http://localhost:3001/user/post/likes/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      }
    );
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  /* PATCH request for updating post of authorize user */
  const updatePost = async (id, e) => {
    console.log(id);
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
    dispatch(setPost({ post: updatedPost }));
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

  return (
    <>
      <main style={{ marginTop: "15%" }}>
        {post.length !== 0 ? (
          post.map((posts) => (
            <div key={posts._id} className="article">
              <Card className="card" sx={{ maxWidth: 300, height: "10%" }}>
                <CardHeader
                  avatar={
                    <IconButton>
                      <Link to={`/profile/${posts.userId._id}`}>
                        <Avatar
                          alt="post-profile-pic"
                          src={`http://localhost:3001/assets/${posts.userId.picturePath}`}
                        />
                      </Link>
                    </IconButton>
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
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        variant="standard"
                      />
                    ) : (
                      <Typography>
                        {posts.userId.firstName} {posts.userId.lastName} has
                        shared a memory about {posts.title}...
                      </Typography>
                    )
                  }
                  subheader={`${moment(posts.createdAt).fromNow()}`}
                />

                {posts.picturePath ? (
                  <CardMedia
                    component="img"
                    height={"10px"}
                    image={`http://localhost:3001/assets/${posts.picturePath}`}
                  />
                ) : (
                  <Typography
                    sx={{ whiteSpace: "nowrap" }}
                    variant="h1"
                    color="text.secondary"
                  >
                    Memory
                  </Typography>
                )}

                <CardContent>
                  {editPost === posts._id && input ? (
                    <>
                      <form onSubmit={(e) => updatePost(posts._id, e)}>
                        <textarea
                          rows={5}
                          style={{
                            width: "100%",
                            backgroundColor: "inherit",
                            resize: "none",
                            color: "whitesmoke",
                            padding: "5px",
                          }}
                          onChange={(e) => setDescription(e.target.value)}
                          autoFocus
                          value={description}
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
                    </>
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
                      spacing={1}
                    >
                      <IconButton onClick={() => patchLike(posts._id)}>
                        {posts.likes[userId] ? (
                          <FavoriteIcon color="error" />
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
                        <Forum
                          color="primary"
                          // sx={{ color: "#42a5f5" }}
                        />
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
                          <DeleteIcon color="warning" />
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
                            <Link to={`/profile/${comment.userId._id}`}>
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
                            </Link>
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
          ))
        ) : (
          <Typography textAlign="center">
            <CircularProgress size="large" />
          </Typography>
        )}
        {/* <Typography textAlign="center" variant="h4" color="text.secondary">
          You have read all the memories... shares your?
        </Typography> */}
      </main>
    </>
  );
}
