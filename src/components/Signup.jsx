import { useEffect, useRef } from "react";
import { useAuth } from "../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Signup = () => {
  const { signup, loading, error, setError, signInWithGoogle, toastObj } =
    useAuth();
  const navigate = useNavigate();

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async () => {
    try {
      const success = await signup(
        emailRef.current.value,
        passwordRef.current.value,
        nameRef.current.value,
        navigate
      );
      if (success) {
        nameRef.current.value = "";
        emailRef.current.value = "";
        passwordRef.current.value = "";
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const inputs = [
    {
      type: "text",
      id: "Name",
      ref: nameRef,
      placeholder: "John Doe",
      label: "Name",
    },
    {
      type: "email",
      id: "Email",
      ref: emailRef,
      placeholder: "your@gmail.com",
      label: "Email",
    },
    {
      type: "password",
      id: "Password",
      ref: passwordRef,
      placeholder: "******",
      label: "Password",
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

        {inputs.map((input, index) => {
          return (
            <div
              className="w-full flex items-center flex-col gap-3"
              key={index}
            >
              <label
                htmlFor={input.label}
                className="self-start sm:pl-8 pl-3 text-gray-300"
              >
                {input.label}
              </label>
              <input
                id={input.id}
                ref={input.ref}
                type={input.type}
                placeholder={input.placeholder}
                className="sm:w-[85%] w-[95%] bg-[#05070A] border-[1px] border-solid border-blue-700 rounded-lg px-4 py-2 outline-none"
              />
            </div>
          );
        })}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`bg-[#F1F4F8] border-[1px] border-gray-500 sm:w-[85%] w-[95%] rounded-lg text-lg font-semibold text-black py-1 ${
            loading ? "opacity-60 " : ""
          }`}
        >
          {loading ? "Please wait..." : "Sign up"}
        </button>

        <p>
          Already have an account?{" "}
          <Link to="/Login" className="text-blue-500 underline">
            Sign in
          </Link>
        </p>

        <div className="flex items-center sm:w-[85%] w-[95%]">
          <div className="flex-grow border-t border-gray-500"></div>
          <span className="px-3 text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-500"></div>
        </div>

        <button
          onClick={() => signInWithGoogle(navigate)}
          disabled={loading}
          className={`bg-[#05070A] border-[1px] border-gray-500 sm:w-[85%] w-[95%] rounded-lg text-md font-semibold py-2 text-white flex items-center justify-center gap-9 ${
            loading ? "opacity-60 " : ""
          }`}
        >
          <img
            src="/google.webp"
            alt="Google Logo"
            className="h-7 w-7 object-cover"
          />
          <p>Sign in with Google</p>
        </button>
      </div>
    </div>
  );
};

export default Signup;
