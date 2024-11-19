import { SendRounded } from "@mui/icons-material";
import { UseApiContext } from "../Context/ApiContext";
import React from "react";

const ChatBot = () => {
  const {
    handleInput,
    sendIcon,
    handleSend,
    currentMsg,
    messages,
    isChat,
    FetchedData,
    FetchingData,
  } = UseApiContext();
  return (
    <div className="h-[calc(100svh-82px)] max-h-[calc(100svh-82px)]  w-full  flex items-center justify-center">
      <div className="h-full w-full  lg:w-[1000px] 2xl:w-[1200px] relative">
        <div className="w-full lg:h-[80px] h-[70px] flex items-center justify-between flex-col gap-2 absolute bottom-0">
          <form
            onSubmit={handleSend}
            className="w-full h-full flex items-center justify-center"
          >
            <div className="flex items-center justify-center lg:w-[80%] w-full gap-2 lg:gap-1">
              <input
                value={currentMsg}
                type="text"
                className="w-full rounded-3xl lg:text-lg lg:h-[49px] h-[42px] lg:font-semibold text-white placeholder-gray-200 outline-none px-5 bg-[#040E1A] shadow-md shadow-gray-600 border-[1px] border-gray-100"
                placeholder="Enter your Prompt here."
                onChange={handleInput}
              />
              <button type="submit">
                <SendRounded
                  sx={{
                    fontSize: { xs: 30, lg: 35 },
                    display: sendIcon ? "block" : "none",
                    cursor: "pointer",
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.2)",
                    },
                  }}
                ></SendRounded>
              </button>
            </div>
          </form>
          <p className="lg:font-semibold lg:text-base text-sm">
            Developed by Muhammad Furqan.
          </p>
        </div>
        <div className="w-full h-[calc(100%-80px)] flex flex-col items-center gap-7 overflow-y-auto scroll-smooth chat-Div mt-5">
          {!isChat && (
            <div className="w-full h-full  flex items-center justify-center flex-col gap-4">
              <h2 className="md:text-4xl font-bold text-2xl text-center">
                Hello , Muhammad Furqan
              </h2>
              <h4 className="md:text-3xl font-semibold text-xl text-center">
                How can i help you today?
              </h4>
            </div>
          )}
          {messages.map((msg, index) => {
            {
              return (
                <React.Fragment key={index}>
                  <div className="lg:w-[80%]  w-full flex-col lg:flex-row flex gap-3 bg-[#040E1A] px-4 py-4 rounded-xl shadow-md shadow-gray-600 break-all">
                    <div className="h-8 w-8 rounded-full bg-blue-800 flex-shrink-0 flex items-center justify-center text-base font-medium">
                      M
                    </div>
                    <p className="font-normal lg:text-[18px] text-[17px] tracking-wide">
                      {msg}
                    </p>
                  </div>
                  <div className="lg:w-[80%]  w-full flex-col lg:flex-row flex gap-3 bg-[#040E1A] px-4 py-4 rounded-xl shadow-md shadow-gray-600 break-all">
                    <div className="h-8 w-8 rounded-full bg-blue-800 flex-shrink-0 flex items-center justify-center text-base font-medium">
                      M
                    </div>
                    <p className="font-normal lg:text-[18px] text-[17px] tracking-wide">
                      {FetchingData
                        ? "Generate Response"
                        : FetchedData
                        ? FetchedData
                        : "No Reponse From API Please Try Later.."}
                    </p>
                  </div>
                </React.Fragment>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
