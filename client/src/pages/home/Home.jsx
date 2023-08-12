import Posts from "./Posts";
import Header from "../../components/Header";
import FollowerSideBar from "./FollowerSideBar";
import AccountSideBar from "./AccountSideBar";
import { useMediaQuery } from "@mui/material";

const Home = () => {
  const isMobileScreens = useMediaQuery("(max-width: 1000px)");
  return (
    <>
      <Header />

      {isMobileScreens ? null : (
        // <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <>
          {/* <div style={{ marginLeft: "auto", marginRight: "16px" }}> */}
          <AccountSideBar />
          {/* </div> */}
          {/* <div style={{ marginLeft: "auto" }}> */}
          <FollowerSideBar />
          {/* </div> */}
          {/* // </div> */}
        </>
      )}

      <Posts />
    </>
  );
};

export default Home;
