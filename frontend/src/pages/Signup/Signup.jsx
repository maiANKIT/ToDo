import {
  useState,
  useEffect,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import { toast } from "react-toastify";

import { signupUser } from "../../services/authAPI";

import logo from "../../assets/images/logo.png";

import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const [formData, setFormData] =
    useState({
      name: "",
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
      await signupUser(formData);

      toast.success(
        "Account Created Successfully"
      );

      navigate("/login");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Signup Failed"
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

        <h1>Create Account</h1>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={changeHandler}
          required
        />

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
          Create Account
        </button>

        <p>
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;