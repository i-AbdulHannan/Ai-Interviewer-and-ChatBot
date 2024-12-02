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
  handleStop: () => {},
  history: "",
  run: () => {},
  userName: "",
  fetchUserName: true,
  fetchChatSessions: () => {},
  fetchChatSession: () => {},
  setIsChat: () => {},
  fetchedHistory: true,
  showPauseIcon: false,
  setSelectedResult: () => {},
  selectedResult: null,
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
  const [selectedResult, setSelectedResult] = useState(null);
  const { User, setError } = useAuth();

  const stopResponseRef = useRef(stopResponse);

  useEffect(() => {
    stopResponseRef.current = stopResponse;
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
    setCurrentMsg("");
    setFetchingData(false);
    setShowPauseIcon(false);
    setStopResponse(true);
    if (selectedResult) {
      setSelectedResult(null);
    }
  };

  const handleSend = async (e) => {
    if (!showPauseIcon) {
      if (selectedResult) {
        setSelectedResult(null);
      }
      e.preventDefault();
      if (currentMsg?.trim() !== "") {
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
      setError("Error save Document");
    }
  };

  const getUserName = async () => {
    try {
      const docRef = doc(db, "users", User.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        fetchingUserName(false);
        setUserName(docSnap.data().name);
      }
    } catch (error) {
      setError("Error Fetching Username");
    }
  };

  const fetchChatSessions = async () => {
    fetchHistory(true);
    try {
      const q = query(
        collection(db, "Chats"),
        where("userId", "==", User.uid),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);

      const sessions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHistory(sessions);
    } catch (error) {
      setError("Error fetching chat sessions");
    } finally {
      fetchHistory(false);
    }
  };

  const fetchChatSession = async (sessionId) => {
    if (selectedResult) {
      setSelectedResult(null);
    }
    try {
      const chatDocRef = doc(db, "Chats", sessionId);
      const chatDoc = await getDoc(chatDocRef);
      if (chatDoc.exists()) {
        setChat(chatDoc.data().messages);
        setCurrentChatId(chatDoc.id);
      }
    } catch (error) {
      setError("Error Fetching History");
    }
  };

  const typeResponse = (
    fullText = "No Response from Api please try later:"
  ) => {
    let index = 0;
    const typingInterval = setInterval(() => {
      if (stopResponseRef.current) {
        clearInterval(typingInterval);
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
      typeResponse(responseText);
    } catch (error) {
      typeResponse("No response from API Please Try later");
    } finally {
      setFetchingData(false);
    }
  };

  return (
    <ChatBotContext.Provider
      value={{
        selectedResult,
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
        setSelectedResult,
      }}
    >
      {children}
    </ChatBotContext.Provider>
  );
};

export const useChatBotContext = () => {
  return useContext(ChatBotContext);
};
