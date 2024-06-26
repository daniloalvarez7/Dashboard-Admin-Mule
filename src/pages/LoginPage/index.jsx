import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import Logo from "../../components/Logo";
import PasswordInput from "../../components/LoginRegisterComponents/PasswordInput";
import CheckBox from "../../components/LoginRegisterComponents/CheckBox";
import Input from "../../components/LoginRegisterComponents/Input";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
import { useSelector } from "react-redux";
import { isLogged } from "../../services/AuthService";
import Cookies from "js-cookie";
import { failAlert } from "../../utils/SuccesAlert";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { VITE_BACKEND_URL } = import.meta.env;
  const [error, setError] = useState({
    username: "",
    password: "",
  });
  const { loggedUser } = useSelector((state) => state.sessionReducer);
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
    keepSession: true,
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    let errors = {};
    e.preventDefault();
    //Validacion
    if (!inputs.username || !inputs.password) {
      errors.username = "All fields are required";
    } else if (
      !/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,80}$/.test(
        inputs.password
      )
    ) {
      errors.password =
        "The password must contain at least one number and one special character, and six characters at least";
    } else {
      //Comprobar usuario y contraseña en BD
      setLoading(true);
      await axios
        .post(`${VITE_BACKEND_URL}/auth/login`, {
          usernameOrEmail: inputs.username.toLocaleLowerCase(),
          password: inputs.password,
        })
        .then((response) => {
          if (!Cookies.get("token"))
            Cookies.set("token", response.data.token, { expires: 1 / 24 });
          navigate("/dashboard/home");
        })
        .catch(async (err) => {
          if (err.response?.status === 401)
            await failAlert(undefined, err.response.data.message, undefined);
          else await failAlert(undefined, "Internal Server Error!", undefined);
        })
        .finally(setLoading(false));
    }
    setError(errors);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "keepSession") {
      setInputs((prevInputs) => ({
        ...prevInputs,
        [name]: !inputs.keepSession,
      }));
    } else {
      setInputs((prevValue) => ({ ...prevValue, [name]: value }));
    }
    setError({ username: "", password: "" });
  };
  return (
    <form className="flex flex-col p-6 bg-white rounded max-w-[463px] m-auto">
      <header className="flex gap-1.5 self-left text-base font-extrabold whitespace-nowrap mb-5">
        <Logo />
        <h4 className="my-auto bg-clip-text text-ellipsis">
          Hotel Esmeralda Resort & Spa
        </h4>
      </header>
      <h2 className="mt-1.5 text-2xl font-bold text-zinc-700">Admin Login</h2>
      <p className="mt-2 text-sm text-slate-500">
        Welcome back. Enter your credentials to access your account
      </p>
      <Input
        text={"Username or email"}
        name="username"
        handler={handleChange}
        type={"text"}
        error={error.username}
      />
      <div className="flex w-full  relative flex-col ">
        <PasswordInput
          name={"password"}
          text="Password"
          handler={handleChange}
          value={inputs.password}
          error={error.password}
        />
      </div>
      <div className="flex gap-5 mt-6">
        <Link
          to="recover"
          className="text-sm cursor-pointer font-bold text-right text-emerald-700 mb-3"
        >
          Forgot Password
        </Link>
      </div>{" "}
      <Loading state={loading}>
        {error.length > 0 && (
          <p className="mt-1 text-sm font-bold text-red-600 white-space-nowrap text-ellipsis">
            {error[0]}
          </p>
        )}
      </Loading>{" "}
      <label className="flex gap-2 mt-3 text-sm text-zinc-900 text-center">
        <CheckBox
          value={inputs.keepSession}
          handler={handleChange}
          name={"keepSession"}
        />
        <span>Keep me signed in</span>
      </label>
      <Link
        to="register"
        className="text-md cursor-pointer font-bold text-right text-red-700 my-7"
      >
        Haven't an account? Click here to register.
      </Link>
      <button
        type="submit"
        className="justify-center items-center px-3 py-1.5 mt-6 text-base font-semibold text-center text-white whitespace-nowrap bg-emerald-700 rounded"
        onClick={handleSubmit}
      >
        Continue
      </button>
    </form>
  );
}
