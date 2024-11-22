import { NavLink } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import Button from "./Button";

const NavbarLinks = ({ state }) => {
  const { User } = useAuth();
  const pages = ["Home", "About", "Menu", "Contact"];

  return (
    <>
      {/*  Mobile view */}
      <ul
        className={`${state ? "translate-x-0" : "-translate-x-full"}
        inset-0 fixed flex  bg-black text-white items-center justify-center flex-col gap-10 text-xl font-bold transition-all duration-300 ease-in-out md:right-[65%] lg:hidden`}
      >
        {pages.map((page, index) => {
          return (
            <li key={index}>
              <a onClick={() => setOpen(false)}>{page}</a>
            </li>
          );
        })}
        <NavLink to={`${User ? "/app" : "/login"}`}>
          <Button text={"Get Started"} />
        </NavLink>
      </ul>
      {/* Laptop view */}
      <ul className="hidden items-center gap-6 text-white text-xl font-bold lg:flex">
        {pages.map((page, index) => {
          return (
            <li key={index}>
              <a onClick={() => setOpen(false)}>{page}</a>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default NavbarLinks;
