import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./NavBar.scss";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../contex/AuthContext";
import Notification from "./chat/Notification";
const NavBar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const [isLogined, setIsLogined] = useState(false);

  useEffect(() => {
    const isLogin = localStorage.getItem("islogin");
    setIsLogined(isLogin === "true");
  }, []);

  return (
    <Navbar bg="dark" className="mb-4" style={{ height: "3.75rem" }}>
      <Container>
        <h1>
          <Link to="/" className="link-light text-decoration-none">
            Chat App
          </Link>
        </h1>
        <span className="text-warning">
          {user && user.errCode === 0
            ? `Logged in as ${user.name}`
            : "Welcome to my chat App"}
        </span>
        <Nav>
          <Stack direction="horizontal" gap={3}>
            {(!isLogined ||
              user?.errCode === 1 ||
              user == null ||
              user?.errCode == null) && (
              <>
                <Link
                  to="/login"
                  className="login-register link-light text-decoration-none"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="login-register link-light text-decoration-none"
                >
                  Register
                </Link>
              </>
            )}
            {isLogined && user?.errCode === 0 && (
              <>
                <Notification />
                <Link
                  onClick={() => logoutUser()}
                  to="/login"
                  className="link-light text-decoration-none"
                >
                  Logout
                </Link>
              </>
            )}
          </Stack>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavBar;
