import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import Chat from "./pages/chat";
import Register from "./pages/register";
import Login from "./pages/login";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Nav } from "react-bootstrap";
import "./App.css";
import NavBar from "./components/NavBar";
import { AuthContext } from "./contex/AuthContext";
import { useContext } from "react";

function App() {
  const { user } = useContext(AuthContext);
  console.log("check user", user);

  return (
    <>
      <NavBar />
      <Container className="text-secondary">
        <Routes>
          <Route
            path="/"
            element={user && user.errCode === 0 ? <Chat /> : <Login />}
          />
          <Route
            path="/register"
            element={user && user.errCode === 0 ? <Chat /> : <Register />}
          />
          <Route
            path="/login"
            element={user && user.errCode === 0 ? <Chat /> : <Login />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
