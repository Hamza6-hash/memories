import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Paper, Snackbar, Alert } from "@mui/material";
import { setLogin } from "../../state/index";
import { useDispatch } from "react-redux";

const Login = () => {
  const [showAlert, setShowAlert] = useState(false);

  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  // const { errors, setErrors } = useState({});

  const handleClickAway = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setShowAlert(false);
  };

  const login = async (e) => {
    e.preventDefault();
    // const errors = {};
    // if (email.trim() === "") {
    //   errors.email = "Enter email";
    // }
    // if (password.trim() === "") {
    //   errors.password = "Enter password";
    // }

    // if (Object.keys(errors).length === 0) {
    const res = await fetch("http://localhost:3001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const loggedIn = await res.json();
    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
    }
    if (res.ok) {
      navigate("/home");
    } else if (!res.ok) {
      setShowAlert(true);
    }
    // }
    // else {
    //   setErrors(errors);
    // }
  };

  return (
    <>
      <div className="login-form">
        <Paper sx={{ width: "50%" }}>
          <form onSubmit={login}>
            <Typography
              variant="h4"
              style={{ textAlign: "center", marginBottom: "20px" }}
            >
              Welcome back
            </Typography>

            {/* {errors.email && <div style={{ color: "red" }}>{errors.email}</div>} */}
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* {errors.password && <div>{errors.password}</div>} */}
            <input
              type="password"
              name="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button className="btn-reg" type="submit">
              Login
            </button>

            <Typography
              variant="h6"
              style={{ textAlign: "center", mt: "20px" }}
            >
              Don't have an account? <Link to={"/register"}>Register</Link>
            </Typography>
          </form>
        </Paper>

        <Snackbar
          open={showAlert}
          autoHideDuration={3000}
          onClose={handleClickAway}
        >
          <Alert
            severity="error"
            onClose={handleClickAway}
            elevation={6}
            variant="filled"
          >
            Invalid Credentials
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};

export default Login;
