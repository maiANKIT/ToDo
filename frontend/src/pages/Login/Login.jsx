import {
  useState,
  useContext,
  useEffect,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { toast } from "react-toastify";

import { loginUser } from "../../services/authAPI";
import { AuthContext } from "../../context/AuthContext";

import logo from "../../assets/images/logo.png";

import "./login.css";

const Login = () => {
  const navigate = useNavigate();

  const { login } =
    useContext(AuthContext);

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const changeHandler = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response =
        await loginUser(formData);

      login(
        response.data.token,
        response.data.user
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      toast.success(
        "Login Successful"
      );

      navigate("/dashboard");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Login Failed"
      );
    }
  };

  return (
    <div className="auth-page">
      <form
        onSubmit={submitHandler}
        className="auth-card neu-card"
      >
        <img
          src={logo}
          alt="logo"
          className="auth-logo"
        />

        <h1>Welcome Back</h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={changeHandler}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={changeHandler}
          required
        />

        <button type="submit">
          Login
        </button>

        <p>
          Don't have an account?{" "}
          <Link to="/signup">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;