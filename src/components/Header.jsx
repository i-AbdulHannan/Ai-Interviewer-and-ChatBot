import { useState } from "react";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { NavLink } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { User } = useAuth();

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const pages = ["Home", "About", "Menu", "Contact"];
  let his = [
    "sdfskjhskjf",
    "fhkjfkfks",
    "sfhsssusuy",
    "sdfskjhskjf",
    "fhkjfkfks",
    "sfhsssusuy",
    "sdfskjhskjf",
    "fhkjfkfks",
    "sfhsssusuy",
  ];

  return (
    <>
      <div
        className={`h-screen w-full shadow-2xl shadow-black lg:w-[300px] bg-[#040E1A]  rounded-lg absolute z-[1061] py-3 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <MenuRoundedIcon
          className="text-4xl absolute top-5 right-5"
          onClick={handleSidebarToggle}
        />
        <div className="w-full h-[50%]  flex flex-col pl-5">
          <h1 className="lg:text-2xl text-xl font-bold text-slate-100">
            Interview History
          </h1>
          <div className="w-full h-full overflow-y-auto my-4 sideBar">
            {his.map((hi, index) => {
              return (
                <p key={index} className="lg:text-lg font-medium py-2 ">
                  {hi}
                </p>
              );
            })}
          </div>
        </div>
        <div className="w-full h-[50%] flex flex-col pl-5">
          <h1 className="lg:text-2xl text-xl font-bold text-slate-100">
            Chat History
          </h1>
          <div className="w-full h-full overflow-y-auto my-4 sideBar">
            {his.map((hi, index) => {
              return (
                <p key={index} className="lg:text-lg font-medium py-2">
                  {hi}
                </p>
              );
            })}
          </div>
        </div>
      </div>
      <nav className="sticky bg-[#040E1A] border-b-2 border-gray-400 top-0 h-20 w-full flex items-center justify-between px-2 gap-10 lg:px-10 z-[1060] ">
        <div className="flex items-center justify-center gap-3 lg:gap-7">
          <MenuRoundedIcon className="text-4xl" onClick={handleSidebarToggle} />
          <img
            src="/Logo.jpeg"
            alt="logo"
            className="h-16 w-16 rounded-full object-cover md:h-20 md:w-20"
          />
        </div>
        <div className="z-[1060] lg:hidden text-white">
          <MenuRoundedIcon className="text-4xl " onClick={handleToggle} />
        </div>
        <ul
          className={`${open ? "translate-x-0" : "-translate-x-full"}
        inset-0 fixed flex  bg-black text-white items-center justify-center flex-col gap-10 text-xl font-bold transition-all duration-300 ease-in-out md:right-[65%] lg:hidden`}
        >
          {pages.map((page, index) => {
            return (
              <li key={index}>
                <a onClick={() => setOpen(false)}>{page}</a>
              </li>
            );
          })}
          <button className="px-3 py-2 border-2 border-blue-500 rounded-lg shadow-md shadow-blue-400 text-lg">
            <NavLink to={`${User ? "/InterviewForm" : "/Login"}`}>
              Get Started
            </NavLink>
          </button>
        </ul>

        <ul className="hidden items-center gap-6 text-white text-xl font-bold lg:flex">
          {pages.map((page, index) => {
            return (
              <li key={index}>
                <a onClick={() => setOpen(false)}>{page}</a>
              </li>
            );
          })}
        </ul>

        <button className="hidden px-3 py-2 text-white font-semibol border-2 border-blue-500 shadow-lg shadow-blue-400 rounded-lg lg:block">
          <NavLink to={`${User ? "/InterviewForm" : "/Login"}`}>
            Get Started
          </NavLink>
        </button>
      </nav>
    </>
  );
};

export default Navbar;
