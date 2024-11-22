import { useEffect } from "react";
import { useAuth } from "../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Inputs from "../Components/Inputs";
import GoogleBtn from "../Components/googleBtn";
import AuthButton from "../Components/AuthButton";

const Signup = () => {
  const {
    error,
    toastObj,
    signupNameRef,
    signupEmailRef,
    signupPasswordRef,
    handleSignupSubmit,
  } = useAuth();
  const navigate = useNavigate();

  const signupFields = [
    {
      type: "text",
      id: "Name",
      ref: signupNameRef,
      placeholder: "John Doe",
      label: "Name",
      autocomplete: "off",
    },
    {
      type: "email",
      id: "Email",
      ref: signupEmailRef,
      placeholder: "your@gmail.com",
      label: "Email",
      autocomplete: "off",
    },
    {
      type: "password",
      id: "Password",
      ref: signupPasswordRef,
      placeholder: "******",
      label: "Password",
      autocomplete: "off",
    },
  ];

  useEffect(() => {
    if (error) {
      toast.error(error, toastObj);
    }
  }, [error]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <div className="flex flex-col bg-[#040E1A] w-full sm:w-[400px] items-center gap-6 py-6 rounded-lg shadow-lg shadow-blue-300">
        <h1 className="text-4xl font-bold">Sign Up</h1>
        <Inputs fields={signupFields} />
        <AuthButton text={"Sign up"} handleSubmit={handleSignupSubmit} />
        <p>
          Already have an account?
          <Link to="/login" className="text-blue-500 pl-1">
            Sign in
          </Link>
        </p>
        <div className="flex items-center sm:w-[85%] w-[95%]">
          <div className="flex-grow border-t border-gray-500"></div>
          <span className="px-3 text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-500"></div>
        </div>
        <GoogleBtn navigate={navigate} />
      </div>
    </div>
  );
};

export default Signup;
