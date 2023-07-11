import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Paper, Typography, Snackbar, Alert, IconButton } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [picturePath, setPicturePath] = useState("");
  const [errors, setErrors] = useState({});

  const [showAlert, setShowAlert] = useState(false);

  const handleClickAway = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowAlert(false);
  };

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (firstName.trim() === "") {
      errors.firstName = "required*";
    }
    if (lastName.trim() === "") {
      errors.lastName = "required*";
    }
    if (email.trim() === "") {
      errors.email = "required*";
    }
    if (password.trim() === "") {
      errors.password = "required*";
    }

    if (Object.keys(errors).length === 0) {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("bio", bio);
      formData.append("picturePath", picturePath.name);
      const res = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        navigate("/");
      } else if (res.status === 404) {
        setShowAlert(true);
      }
    } else {
      setErrors(errors);
    }
  };

  return (
    <>
      <div className="login-form">
        <Paper sx={{ width: "50%" }}>
          <form onSubmit={handleSubmit}>
            <Typography
              variant="h4"
              style={{ textAlign: "center", marginBottom: "20px" }}
            >
              Welcome to Memories
            </Typography>

            {errors.firstName && (
              <div style={{ color: "red" }}>{errors.firstName}</div>
            )}
            <input
              type="text"
              name="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="firstName"
            />

            {errors.lastName && (
              <div style={{ color: "red" }}>{errors.lastName}</div>
            )}
            <input
              type="text"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
            />

            <input
              type="text"
              name="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Add up to three professions"
            />

            {errors.email && <div style={{ color: "red" }}>{errors.email}</div>}
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />

            {errors.password && (
              <div style={{ color: "red" }}>{errors.password}</div>
            )}
            <input
              type="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              placeholder="password"
            />

            {picturePath ? (
              <>
                <p>
                  {picturePath.name}
                  <IconButton onClick={() => setPicturePath("")}>
                    <CloseOutlinedIcon />
                  </IconButton>
                </p>
              </>
            ) : (
              <input
                type="file"
                // name="picturePath"
                onChange={(e) => setPicturePath(e.target.files[0])}
                value=""
              />
            )}
            <button className="btn-reg" type="submit">
              Register
            </button>
          </form>
          <Typography variant="h6" style={{ textAlign: "center" }}>
            Already have an account login here? <Link to={"/"}>Login</Link>
          </Typography>
        </Paper>

        <Snackbar
          open={showAlert}
          autoHideDuration={5000}
          onClose={handleClickAway}
        >
          <Alert
            onClose={handleClickAway}
            severity="error"
            elevation={6}
            variant="filled"
          >
            Email already exist
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

export default Register;
