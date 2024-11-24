// import { SendRounded, BorderColorOutlined } from "@mui/icons-material";
import { useChatBotContext } from "../Context/ChatBotContext";
import Sidebar from "../Components/Sidebar";
import ChatList from "../Components/ChatList";
import ChatForm from "../Components/ChatForm";

const ChatBot = () => {
  const { isChat, userName, fetchUserName } = useChatBotContext();

  return (
    <>
      <Sidebar />
      <div className="h-[calc(100svh-82px)] max-h-[calc(100svh-82px)] w-full flex items-center justify-center">
        <div className="h-full w-full lg:w-[1000px] 2xl:w-[1200px] relative">
          <ChatForm />
          <div className="w-full h-[calc(100%-80px)] flex flex-col items-center gap-7 overflow-y-auto scroll-smooth chat-Div mt-5">
            {!isChat && (
              <div className="w-full h-full flex items-center justify-center flex-col gap-4">
                <h2 className="md:text-4xl font-bold text-2xl text-center">
                  Hi 👏 {fetchUserName ? "User" : userName}
                </h2>
                <h4 className="md:text-3xl font-semibold text-xl text-center">
                  How can I help you today?
                </h4>
              </div>
            )}
            <ChatList />
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
