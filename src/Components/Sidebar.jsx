import { ManageHistoryOutlined, CancelOutlined } from "@mui/icons-material";
import { useState } from "react";
import { UseApiContext } from "../Context/ApiContext";

const Sidebar = ({}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { getDataToFirebase } = UseApiContext();
  const history = ["akjak", "zalja"];

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const combinedClickHandler = () => {
    handleSidebarToggle();
    getDataToFirebase();
  };
  return (
    <>
      <ManageHistoryOutlined
        sx={{
          fontSize: { xs: 30, lg: 35 },
          cursor: "pointer",
          transition: "transform 0.2s ease-in-out",
          "&:hover": { transform: "scale(1.1)" },
        }}
        className="absolute top-6 left-5 z-[1060] "
        onClick={combinedClickHandler}
      />
      <div
        className={`h-screen w-full shadow-2xl shadow-black lg:w-[300px] bg-[#040E1A]  rounded-lg absolute z-[1061] py-3 transition-all duration-300 ease-in-out top-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <CancelOutlined
          className="text-4xl absolute top-3 right-3"
          sx={{
            fontSize: { xs: 30, lg: 40 },
            cursor: "pointer",
            transition: "transform 0.2s ease-in-out",
            "&:hover": { transform: "scale(1.1)" },
          }}
          onClick={handleSidebarToggle}
        />
        <div className="w-full h-[50%]  flex flex-col pl-5">
          <h1 className="lg:text-2xl text-xl font-bold text-slate-100">
            Interview History
          </h1>
          <div className="w-full h-full overflow-y-auto my-4 sideBar">
            {history.map((hi, index) => {
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
            {history.map((hi, index) => {
              return (
                <p key={index} className="lg:text-lg font-medium py-2">
                  {hi}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
