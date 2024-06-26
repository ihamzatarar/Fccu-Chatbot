import React, { useState, useEffect } from 'react';
import '../styles/SignIn.css';
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import LoadingIndicator from "./LoadingIndicator";

const SignIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authState, setAuthState] = useState({
    route: "api/token/",
    method: "login"
  });
  const [loading, setLoading] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const container = document.querySelector('.main-container');
    container.style.backgroundImage = isActive ? 'url("/src/assets/Space.jpg")' : 'url("/src/assets/Car.jpg")';
  }, [isActive]);

  const toggleActive = () => {
    setIsActive(!isActive);
    setAuthState(currentState => {
      if (currentState.route === "api/token/") {
        return { route: "/api/user/register/", method: "register" };
      } else {
        return { route: "api/token/", method: "login" };
      }
    });
  };

  useEffect(() => {
    console.log("Current route:", authState.route);
    console.log("Current method:", authState.method);
  }, [authState]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log(authState.route);  // Ensure logging the current route
      const res = await api.post(authState.route, { username, password });
      if (authState.method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/home");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error occurred:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="main-container">
      <div className={`container ${isActive ? 'active' : ''}`} id="container">
        <div className="form-container sign-up">
          <form onSubmit={handleSubmit}>
            <h1>Create Account</h1>
            <div className="social-icons">
              <a href="#" className="icon"><i className="fa-brands fa-google-plus-g"></i></a>
              <a href="#" className="icon"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" className="icon"><i className="fa-brands fa-github"></i></a>
              <a href="#" className="icon"><i className="fa-brands fa-linkedin-in"></i></a>
            </div>
            <span>or use your email for registration</span>
            <input
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">{loading ? <LoadingIndicator/> : "Sign Up"}</button>
          </form>
        </div>

        <div className="form-container sign-in">
          <form onSubmit={handleSubmit}>
            <h1>Sign In</h1>
            <div className="social-icons">
              <a href="#" className="icon"><i className="fa-brands fa-google-plus-g"></i></a>
              <a href="#" className="icon"><i className="fa-brands fa-facebook-f"></i></a>
              <a href="#" className="icon"><i className="fa-brands fa-github"></i></a>
              <a href="#" className="icon"><i className="fa-brands fa-linkedin-in"></i></a>
            </div>
            <span>or use your email account</span>
             <h1>{name}</h1>
            <input
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">{loading ? <LoadingIndicator /> : "Sign In"}</button>
          </form>
        </div>

        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Enter your credentials to sign in</p>
              <button className="hidden" onClick={toggleActive}>Sign Up</button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Hello, Friend!</h1>
              <p>Register with your personal details to use all site features</p>
              <button className="hidden" onClick={toggleActive}>Sign In</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
