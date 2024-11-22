import React from "react";
import { UseApiContext } from "../Context/ApiContext";

const ChatList = () => {
  const { Chat } = UseApiContext();
  return (
    <>
      {Chat.map((msg, index) => (
        <React.Fragment key={index}>
          <div className="lg:w-[80%] w-full flex-col lg:flex-row flex gap-3 bg-[#040E1A] px-4 py-4 rounded-xl shadow-md shadow-gray-600 break-all">
            <div className="h-8 w-8 rounded-full bg-blue-800 flex-shrink-0 flex items-center justify-center text-base font-medium">
              M
            </div>
            <p className="font-normal lg:text-[18px] text-[17px] tracking-wide">
              {msg.prompts}
            </p>
          </div>
          {msg.ApiResponse && (
            <div className="lg:w-[80%] w-full flex-col lg:flex-row flex gap-3 bg-[#040E1A] px-4 py-4 rounded-xl shadow-md shadow-gray-600 break-all">
              <div className="h-8 w-8 rounded-full bg-blue-800 flex-shrink-0 flex items-center justify-center text-base font-medium">
                M
              </div>
              <p className="font-normal lg:text-[18px] text-[17px] tracking-wide">
                {msg.ApiResponse}
              </p>
            </div>
          )}
        </React.Fragment>
      ))}
    </>
  );
};

export default ChatList;
