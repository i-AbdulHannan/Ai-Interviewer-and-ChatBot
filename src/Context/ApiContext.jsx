import { createContext, useContext, useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const ApiContext = createContext();

export const ApiContextProvider = ({ children }) => {
  const [sendIcon, setSendIcon] = useState(false);
  const [messages, setMessages] = useState([]);
  const [currentMsg, setCurrentMsg] = useState(undefined);
  const [isChat, setIsChat] = useState(false);
  const [FetchingData, setFetchingData] = useState(false);
  const [FetchedData, setFetchedData] = useState(null);

  const handleInput = (e) => {
    const val = e.target.value;
    setCurrentMsg(val);
    if (val.trim() !== "") {
      setSendIcon(true);
    } else {
      setSendIcon(false);
    }
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (currentMsg.trim() !== "") {
      setIsChat(true);
      setMessages([...messages, currentMsg]);
      setCurrentMsg("");
      setSendIcon(false);
      run(currentMsg);
    }
  };

  const apiKey = "AIzaSyC8FZKDC7C2-p4v9H5_B0MQFswRWp_r0ig";
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  async function run(UserInput) {
    setFetchingData(true);
    const chatSession = model.startChat({
      generationConfig,
      history: [
        { role: "user", parts: [{ text: "ja bhaut kharab language hai" }] },
      ],
    });

    const result = await chatSession.sendMessage(UserInput);
    setFetchingData(false);
    setFetchedData(result.response.text());
    console.log(result.response.text());
  }

  return (
    <ApiContext.Provider
      value={{
        handleInput,
        sendIcon,
        handleSend,
        messages,
        currentMsg,
        isChat,
        run,
        FetchingData,
        FetchedData,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const UseApiContext = () => {
  return useContext(ApiContext);
};
