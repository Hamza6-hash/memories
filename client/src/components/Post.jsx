import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  DialogTitle,
  TextField,
  FormControl,
  IconButton,
  Box,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import AddAPhotoRoundedIcon from "@mui/icons-material/AddAPhotoRounded";
import { useState } from "react";
import { setPosts } from "../state";
import { useDispatch, useSelector } from "react-redux";
// import memLamp from "../../images/memLamp.webp";
// import memPics from "../../images/memPics.jpg";
import memWatch from "../images/memWatch.jpg";

const Posts = () => {
  /* States */
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [picturePath, setPicturePath] = useState(null);
  const [open, setOpen] = useState(false);

  /* Reading states form react-redux store */
  const token = useSelector((state) => state.token);
  const { _id } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  /* Dialog handling methods */
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  /* Sharing memory function */
  const shareMemory = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("userId", _id);
    formData.append("title", title);
    if (!picturePath) {
      formData.append("picturePath", "");
    } else {
      formData.append("picturePath", picturePath.name);
    }
    formData.append("description", description);

    try {
      const response = await fetch("http://localhost:3001/post", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const posts = await response.json();
      dispatch(setPosts({ posts }));

      if (response.ok) {
        setTitle("");
        setDescription("");
        setPicturePath("");
        setOpen(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <IconButton
        sx={{ position: "absolute", bottom: "0", left: "95%", mb: "40px" }}
        onClick={handleClickOpen}
      >
        <EditIcon sx={{ position: "fixed", zIndex: 1 }} />
      </IconButton>

      <Dialog
        sx={{
          "& .MuiPaper-root": {
            background: `url(${memWatch})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            filter: "opacity(90%)",
          },
        }}
        fullWidth
        open={open}
        onClose={handleClose}
      >
        <DialogTitle
          sx={{ color: "black", fontWeight: "1000", fontSize: "1.2rem" }}
        >
          Share Your Memories with Public
        </DialogTitle>

        <DialogContent>
          <form onSubmit={shareMemory}>
            <FormControl fullWidth>
              <TextField
                name="title"
                margin="dense"
                label="title"
                type="text"
                sx={{ color: "black", fontWeight: "1000" }}
                variant="standard"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <label htmlFor="description">
                Description
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={6}
                  style={{
                    resize: "none",
                    width: "100%",
                    color: "black",
                    marginTop: "10px",
                    zIndex: 2,
                    fontWeight: "1000",
                    backgroundColor: "inherit",
                  }}
                />
              </label>

              {picturePath ? (
                <Box display="flex">
                  <p>{picturePath.name}</p>
                  <IconButton
                    sx={{ position: "relative", left: "80%" }}
                    onClick={() => setPicturePath(null)}
                  >
                    <CloseOutlinedIcon fontSize="20rem" />
                  </IconButton>
                </Box>
              ) : (
                <>
                  <div
                    style={{ display: "flex", justifyContent: "flex-start" }}
                  >
                    <IconButton>
                      <label htmlFor="add photo">
                        <AddAPhotoRoundedIcon
                          sx={{ ":hover": { cursor: "pointer" } }}
                        />
                        <input
                          id="add photo"
                          style={{ display: "none" }}
                          type="file"
                          value=""
                          onChange={(e) => setPicturePath(e.target.files[0])}
                        />
                        Upload Photo
                      </label>
                    </IconButton>
                  </div>
                </>
              )}

              <Button
                sx={{ mt: "10px" }}
                type="submit"
                variant="contained"
                color="secondary"
                disabled={!title || !description}
              >
                Post
              </Button>
            </FormControl>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Posts;
