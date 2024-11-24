import { ManageHistoryOutlined, CancelOutlined } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useChatBotContext } from "../Context/ChatBotContext";

const Sidebar = ({}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { history, fetchChatSessions, fetchChatSession, setIsChat } =
    useChatBotContext();

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleHistory = (id) => {
    fetchChatSession(id);
    setIsChat(true);
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    fetchChatSessions();
  }, []);

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
        onClick={handleSidebarToggle}
      />
      <div
        className={`h-screen w-full shadow-2xl shadow-black lg:w-[300px] bg-[#081229]  rounded-lg absolute z-[1061] py-3 transition-all duration-300 ease-in-out top-0 ${
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
        <div className="w-full h-[50%] flex flex-col pl-5">
          <h1 className="lg:text-2xl text-xl font-bold text-slate-100">
            Chat History
          </h1>
          <div className="w-full h-full overflow-y-auto my-4 sideBar">
            {history.map((session) => {
              return (
                <p
                  key={session.id}
                  className="lg:text-lg font-medium py-2"
                  onClick={() => handleHistory(session.id)}
                >
                  {session.messages[0]?.Prompt.slice(0, 20)}
                </p>
              );
            })}
          </div>
        </div>
        <div className="w-full h-[50%]  flex flex-col pl-5">
          <h1 className="lg:text-2xl text-xl font-bold text-slate-100">
            Interview History
          </h1>
          <div className="w-full h-full overflow-y-auto my-4 sideBar">
            {history.map((session) => {
              return (
                <p key={session.id} className="lg:text-lg font-medium py-2 ">
                  {session.messages[0]?.Prompt.slice(0, 20)}...
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
