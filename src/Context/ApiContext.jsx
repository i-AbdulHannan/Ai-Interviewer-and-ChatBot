import { createContext, useContext, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../utilities/firebase";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  arrayUnion,
  Timestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useAuth } from "./AuthContext";

const ApiContext = createContext({
  handleInput: () => {},
  sendIcon: false,
  handleSend: () => {},
  currentMsg: "",
  isChat: false,
  FetchingData: false,
  Chat: [],
  setChat: () => {},
  startNewChat: () => {}, // Function to start a new chat
  getDataToFirebase: () => {}, // Function to start a new chat
});

export const ApiContextProvider = ({ children }) => {
  const [sendIcon, setSendIcon] = useState(false);
  const [currentMsg, setCurrentMsg] = useState("");
  const [isChat, setIsChat] = useState(false);
  const [FetchingData, setFetchingData] = useState(false);
  const [Chat, setChat] = useState([]);
  const [history, setHistory] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null); // Track current chat session ID
  const { User } = useAuth();

  const handleInput = (e) => {
    const val = e.target.value;
    setCurrentMsg(val);
    setSendIcon(val.trim() !== "");
  };

  // Start a new chat session
  const startNewChat = async () => {
    setChat([]);
    setIsChat(false);
    setCurrentChatId(null);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (currentMsg.trim() !== "") {
      setCurrentMsg("");
      setSendIcon(false);
      setIsChat(true);

      setChat((prevChat) => [
        ...prevChat,
        { prompts: currentMsg, ApiResponse: null },
      ]);

      await run(currentMsg);
    }
  };

  const apiKey = "AIzaSyC8FZKDC7C2-p4v9H5_B0MQFswRWp_r0ig";
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };

  const saveUserChat = async ({ Prompt, Response }) => {
    try {
      if (!currentChatId) {
        // Create a new chat document if no chat session is active
        const chatDocRef = await addDoc(collection(db, "Chats"), {
          userId: User.uid,
          messages: arrayUnion({
            Prompt,
            Response,
          }),
          timestamp: Timestamp.now(),
        });
        setCurrentChatId(chatDocRef.id); // Save the new chat session ID
      } else if (currentChatId) {
        // Update the messages array of the current chat session document
        const chatDocRef = doc(db, "Chats", currentChatId);
        await updateDoc(chatDocRef, {
          messages: arrayUnion({
            Prompt,
            Response,
          }),
        });
      }
    } catch (error) {
      console.error("Error saving chat data to Firestore:", error);
    }
  };

  const run = async (UserInput) => {
    setFetchingData(true);

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [{ text: "" }],
        },
      ],
    });

    try {
      const result = await chatSession.sendMessage(UserInput);
      const responseText = result.response.text();

      // Save the prompt and response to Firestore
      await saveUserChat({
        Prompt: UserInput,
        Response: responseText,
      });

      setFetchingData(false);
      setChat((prevChat) => {
        const updatedChat = [...prevChat];
        updatedChat[updatedChat.length - 1].ApiResponse = responseText;
        return updatedChat;
      });
    } catch (error) {
      console.error("Error while running the API or saving data:", error);
      setFetchingData(false);
    }
  };

  const getDataToFirebase = async () => {
    console.log("run");
    const q = query(collection(db, "Chats"), where("userId", "==", User.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const chatSession = doc.data().messages;
      setHistory([...history, chatSession]);
      console.log(chatSession);
    });
  };

  return (
    <ApiContext.Provider
      value={{
        handleInput,
        sendIcon,
        handleSend,
        currentMsg,
        isChat,
        run,
        FetchingData,
        Chat,
        setChat,
        startNewChat, // Expose the startNewChat function
        getDataToFirebase,
        history,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export const UseApiContext = () => {
  return useContext(ApiContext);
};
