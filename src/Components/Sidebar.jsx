import { ManageHistoryOutlined, CancelOutlined } from "@mui/icons-material";
import { useCallback, useEffect, useState } from "react";
import { useChatBotContext } from "../Context/ChatBotContext";
import Loader from "./Loader";

const Sidebar = ({ sidebarOpen, setSidebarOpen, handleSidebarToggle }) => {
  // const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    history,
    fetchChatSessions,
    fetchChatSession,
    setIsChat,
    fetchedHistory,
    startNewChat,
  } = useChatBotContext();

  // const handleSidebarToggle = () => {
  //   setSidebarOpen(!sidebarOpen);
  // };

  const handleHistory = (id) => {
    fetchChatSession(id);
    setIsChat(true);
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    fetchChatSessions();
    console.log(" triggered");
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
        <div className="w-full h-[50%] flex flex-col pl-5">
          <div className="w-full flex justify-between items-center">
            <h1 className="lg:text-2xl text-xl font-bold text-slate-100">
              Chat History
            </h1>
            <CancelOutlined
              sx={{
                fontSize: { xs: 30, lg: 35 },
                cursor: "pointer",
                transition: "transform 0.2s ease-in-out",
                "&:hover": { transform: "scale(1.1)" },
              }}
              onClick={handleSidebarToggle}
            />
          </div>
          <div className="w-full h-full overflow-y-auto my-4 sideBar">
            {history.length > 0 ? (
              history.map((session) => {
                return (
                  <div
                    className="w-full hover:cursor-pointer hover:bg-[#18274a]  mb-3 rounded-lg py-1 px-2  flex items-center justify-between"
                    key={session.id}
                    onClick={() => handleHistory(session.id)}
                  >
                    <p className="lg:text-xl font-medium">
                      {session.messages[0]?.Prompt.slice(0, 15)}...
                    </p>
                    <p>
                      {new Date(
                        session.timestamp.seconds * 1000
                      ).toLocaleDateString()}
                    </p>
                  </div>
                );
              })
            ) : (
              <div className="h-full w-full flex items-center justify-center text-xl font-semibold flex-col gap-7">
                {fetchedHistory ? <Loader /> : "No History Available Yet."}
              </div>
            )}
          </div>
        </div>
        <div className="w-full h-[50%]  flex flex-col pl-5">
          <h1 className="lg:text-2xl text-xl font-bold text-slate-100">
            Interview History
          </h1>
          <div className="w-full h-full overflow-y-auto my-4 sideBar">no</div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
