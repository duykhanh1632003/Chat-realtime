import { Container, Nav, Navbar, Stack } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./NavBar.scss";
import { useContext } from "react";
import { AuthContext } from "../contex/AuthContext";
const NavBar = () => {
  const { user, logoutUser } = useContext(AuthContext);
  console.log("check user", user);
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
            ? `Logeed in as ${user.name}`
            : "Welcome to my chat App"}
        </span>
        <Nav>
          <Stack direction="horizontal" gap={3}>
            {(user && user.errCode === 1) || !user && (
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
            {user && user.errCode === 0 && (
              <>
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
