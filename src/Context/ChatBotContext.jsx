import { createContext, useContext, useEffect, useState, useRef } from "react";
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
  orderBy,
} from "firebase/firestore";
import { useAuth } from "./AuthContext";
import { GeminiApiCall } from "../utilities/Gemini";

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
  const [history, setHistory] = useState("");
  const [fetchedHistory, fetchHistory] = useState(true);
  const [showPauseIcon, setShowPauseIcon] = useState(false);
  const [stopResponse, setStopResponse] = useState(false);
  const { User } = useAuth();

  const stopResponseRef = useRef(stopResponse); // useRef to track stopResponse state

  useEffect(() => {
    stopResponseRef.current = stopResponse; // Sync stopResponseRef with stopResponse state
  }, [stopResponse]);

  useEffect(() => {
    getUserName();
  }, []);

  const handleStop = () => {
    setFetchingData(false);
    setStopResponse(true);
    setShowPauseIcon(false);
  };

  const handleInput = (e) => {
    const val = e.target.value;
    setCurrentMsg(val);
    setSendIcon(val.trim() !== "");
  };

  const startNewChat = async () => {
    fetchChatSessions();
    setChat([]);
    setIsChat(false);
    setCurrentChatId(null);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (currentMsg.trim() !== "") {
      setStopResponse(false);
      setShowPauseIcon(true);
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
          timestamp: Timestamp.now(),
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
    fetchHistory(true); // Loading state ko true set karen
    try {
      const q = query(
        collection(db, "Chats"),
        where("userId", "==", User.uid),
        orderBy("timestamp", "desc") // Timestamp ko descending order me sort karna
      );
      const querySnapshot = await getDocs(q);
      const sessions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHistory(sessions); // Sorted sessions ko set karein
    } catch (error) {
      console.error("Error fetching chat sessions:", error); // Error handling
    } finally {
      fetchHistory(false); // Loading ko false set karein after fetching
    }
  };

  const fetchChatSession = async (sessionId) => {
    const chatDocRef = doc(db, "Chats", sessionId);
    const chatDoc = await getDoc(chatDocRef);
    if (chatDoc.exists()) {
      setChat(chatDoc.data().messages);
      setCurrentChatId(chatDoc.id);
    }
  };

  const typeResponse = (fullText) => {
    let index = 0;
    const typingInterval = setInterval(() => {
      // Check stopResponseRef.current inside the interval
      if (stopResponseRef.current) {
        clearInterval(typingInterval); // If stopResponse is true, stop typing
        return;
      }

      setChat((prevChat) => {
        const updatedChat = [...prevChat];
        const lastMessage = updatedChat[updatedChat.length - 1];
        if (index < fullText?.length) {
          lastMessage.Response += fullText[index];
          index += 1;
        } else {
          clearInterval(typingInterval);
          setShowPauseIcon(false);
        }
        return updatedChat;
      });
    }, 25);
  };

  const findChats = () => {
    return Chat.map((obj) => ({ text: obj.Prompt }));
  };

  const run = async (UserInput) => {
    setFetchingData(true);
    let responseText;
    try {
      const ChatHistory = findChats();
      if (ChatHistory.length < 1) {
        responseText = await GeminiApiCall(UserInput);
      } else if (ChatHistory.length >= 1) {
        responseText = await GeminiApiCall(UserInput, [
          { role: "user", parts: ChatHistory },
        ]);
      }
      await saveUserChat({
        Prompt: UserInput,
        Response: responseText,
      });
      setFetchingData(false);
      typeResponse(responseText);
    } catch (error) {
      console.log("Error while running the API or saving data:", error);
      setFetchingData(false);
    }
  };

  return (
    <ChatBotContext.Provider
      value={{
        handleStop,
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
        fetchedHistory,
        showPauseIcon,
      }}
    >
      {children}
    </ChatBotContext.Provider>
  );
};

export const useChatBotContext = () => {
  return useContext(ChatBotContext);
};
