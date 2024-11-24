import { createContext, useContext, useEffect, useState } from "react";
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
  getDoc,
} from "firebase/firestore";
import { useAuth } from "./AuthContext";
import { generationConfig, model } from "../utilities/Gemini";

const ChatBotContext = createContext({
  handleInput: () => {},
  sendIcon: false,
  handleSend: () => {},
  currentMsg: "",
  isChat: false,
  FetchingData: false,
  Chat: [],
  setChat: () => {},
  startNewChat: () => {},
  getDataToFirebase: () => {},
});

export const ChatBotContextProvider = ({ children }) => {
  const [sendIcon, setSendIcon] = useState(false);
  const [currentMsg, setCurrentMsg] = useState("");
  const [isChat, setIsChat] = useState(false);
  const [FetchingData, setFetchingData] = useState(false);
  const [Chat, setChat] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [userName, setUserName] = useState("");
  const [fetchUserName, fetchingUserName] = useState(true);
  const [history, setHistory] = useState([]);
  const { User } = useAuth();

  useEffect(() => {
    getUserName();
  }, []);

  const handleInput = (e) => {
    const val = e.target.value;
    setCurrentMsg(val);
    setSendIcon(val.trim() !== "");
  };

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
        { Prompt: currentMsg, Response: "" },
      ]);

      await run(currentMsg);
    }
  };

  const saveUserChat = async ({ Prompt, Response }) => {
    try {
      if (!currentChatId) {
        const chatDocRef = await addDoc(collection(db, "Chats"), {
          userId: User.uid,
          messages: arrayUnion({
            Prompt,
            Response,
          }),
          timestamp: Timestamp.now(),
        });
        setCurrentChatId(chatDocRef.id);
      } else if (currentChatId) {
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

  const getUserName = async () => {
    const docRef = doc(db, "users", User.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      fetchingUserName(false);
      setUserName(docSnap.data().name);
    }
  };

  const fetchChatSessions = async () => {
    const q = query(collection(db, "Chats"), where("userId", "==", User.uid));
    const querySnapshot = await getDocs(q);
    const sessions = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setHistory(sessions);
  };

  const fetchChatSession = async (sessionId) => {
    const chatDocRef = doc(db, "Chats", sessionId);
    const chatDoc = await getDoc(chatDocRef);
    if (chatDoc.exists()) {
      setChat(chatDoc.data().messages);
    }
  };

  const typeResponse = (fullText) => {
    let index = 0;

    const typingInterval = setInterval(() => {
      setChat((prevChat) => {
        const updatedChat = [...prevChat];
        const lastMessage = updatedChat[updatedChat.length - 1];

        if (index < fullText.length) {
          lastMessage.Response += fullText[index];
          index += 1;
        } else {
          clearInterval(typingInterval); // Stop typing when done
        }

        return updatedChat;
      });
    }, 25);
  };

  const run = async (UserInput) => {
    setFetchingData(true);

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    try {
      const result = await chatSession.sendMessage(UserInput);
      const responseText = result.response.text();

      await saveUserChat({
        Prompt: UserInput,
        Response: responseText,
      });

      setFetchingData(false);
      typeResponse(responseText);
    } catch (error) {
      console.error("Error while running the API or saving data:", error);
      setFetchingData(false);
    }
  };

  return (
    <ChatBotContext.Provider
      value={{
        history,
        handleInput,
        sendIcon,
        handleSend,
        currentMsg,
        isChat,
        run,
        FetchingData,
        Chat,
        setChat,
        startNewChat,
        userName,
        fetchUserName,
        fetchChatSessions,
        fetchChatSession,
        setIsChat,
      }}
    >
      {children}
    </ChatBotContext.Provider>
  );
};

export const useChatBotContext = () => {
  return useContext(ChatBotContext);
};
