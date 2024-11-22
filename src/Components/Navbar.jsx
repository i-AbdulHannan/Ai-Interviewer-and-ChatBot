import { useState } from "react";
import { MenuRounded } from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import Button from "./Button";
import NavbarLinks from "./NavbarLinks";
import { useAuth } from "../Context/AuthContext";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { User } = useAuth();

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <nav className="sticky bg-[#040E1A] border-b-2 border-gray-400 top-0 h-20 w-full flex items-center justify-between px-2 gap-10 lg:px-10 lg:pl-20 z-[1060] ">
      <img
        src="/assets/Logo.jpeg"
        alt="logo"
        className="h-16 w-16 rounded-full object-cover md:h-20 md:w-20"
      />
      <div className="z-[1060] lg:hidden text-white">
        <MenuRounded
          sx={{
            fontSize: { xs: 30, lg: 40 },
            cursor: "pointer",
            transition: "transform 0.2s ease-in-out",
            "&:hover": { transform: "scale(1.1)" },
          }}
          onClick={handleToggle}
        />
      </div>
      <NavbarLinks state={open} />
      <NavLink className="hidden lg:flex" to={`${User ? "/app" : "/login"}`}>
        <Button text={"Get Started"} />
      </NavLink>
    </nav>
  );
};

export default Navbar;
