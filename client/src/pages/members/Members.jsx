import {
  Typography,
  Avatar,
  Box,
  Grid,
  IconButton,
  Card,
  CardMedia,
  CardContent,
  CardHeader,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment";
import Header from "../../components/Header";

export default function Members() {
  /* States */
  const [searchTerm, setSearchTerm] = useState("");
  const [searchUser, setSearchUser] = useState(null);
  const [animate, setAnimate] = useState(false);
  const [posts, setPosts] = useState(null);

  const isMobileScreens = useMediaQuery("(max-width: 1000px)");
  const token = useSelector((state) => state.token);

  /* Saerching User by firstName */
  useEffect(() => {
    const fetchSearchUsers = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/users/names/search?firstName=${searchTerm}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        setSearchUser(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (searchTerm) {
      setAnimate(true);
    } else {
      setAnimate(false);
    }

    fetchSearchUsers();
  }, [searchTerm]);

  /* Get requset for the posts for serach and click user */
  const getPost = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/user/post/${id}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Header />
      <div style={{ marginTop: "8%", width: "20%", marginLeft: "2%" }}>
        <input
          type="text"
          placeholder="Search User by Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Grid mt="3%" container spacing={2}>
        <Grid item xs={6}>
          <div style={{ marginTop: "5%", marginLeft: "3%", height: "500px" }}>
            <div
              style={{ height: "100%", overflow: "auto" }}
              className="scrollbar-container"
            >
              {searchUser && searchUser.length > 0 ? (
                searchUser.map((users, index) => (
                  <Box
                    className={`user ${animate ? "show bounce" : ""} delay${
                      index + 1
                    }`}
                    display="flex"
                    key={users._id}
                  >
                    <IconButton onClick={() => getPost(users._id)}>
                      <Avatar
                        sx={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                        }}
                        src={`http://localhost:3001/assets/${users.picturePath}`}
                      />
                    </IconButton>

                    <Typography mt="48px">
                      {users.firstName} {users.lastName}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography>No User found</Typography>
              )}
            </div>
          </div>
        </Grid>

        <Grid item xs={6}>
          {posts && posts.length > 0 ? (
            <>
              <Typography variant="h5" color="text.secondary">
                Can't interact here, you Can Only Read the Memory here
              </Typography>

              <div
                style={{
                  marginTop: "5%",
                  height: "500px",
                  overflow: "auto",
                  marginRight: "15%",
                }}
              >
                <div style={{ height: "100%", overflow: "auto" }}>
                  {posts.map((post, index) => (
                    <Card
                      key={post._id}
                      sx={{
                        maxWidth: "auto",
                        marginBottom: index !== posts.length - 1 ? "20px" : 0,
                      }}
                    >
                      <CardHeader
                        avatar={
                          <IconButton>
                            <Avatar
                              alt="post-profile-pic"
                              src={`http://localhost:3001/assets/${post.userId.picturePath}`}
                            />
                          </IconButton>
                        }
                        title={
                          <Typography>
                            {post.userId.firstName} {post.userId.lastName} has
                            shared a memory about {post.title}...
                          </Typography>
                        }
                        subheader={`${moment(post.createdAt).fromNow()}`}
                      />

                      {post.picturePath ? (
                        <CardMedia
                          component="img"
                          height={"auto"}
                          image={`http://localhost:3001/assets/${post.picturePath}`}
                        />
                      ) : (
                        <Typography
                          sx={{ whiteSpace: "nowrap" }}
                          variant={isMobileScreens ? "h2" : "h1"}
                          color="text.secondary"
                        >
                          Memory
                        </Typography>
                      )}

                      <CardContent>
                        <Typography variant="body1" color="text.secondary">
                          {post.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <Typography variant="h5">
              Click on User to see their memories
            </Typography>
          )}
        </Grid>
      </Grid>
    </>
  );
}
