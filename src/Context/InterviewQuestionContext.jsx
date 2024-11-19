import { createContext, useContext, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utilities/firebase";

const InterviewContext = createContext();

export const InterviewContextProvider = ({ children }) => {
  const [userName, setUserName] = useState(null);

  const getUserName = async (uid) => {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);
    if (userDoc.exists()) {
      setUserName(userDoc.data().name);
    }
  };

  return (
    <InterviewContext.Provider value={{ userName, getUserName }}>
      {children}
    </InterviewContext.Provider>
  );
};

export const useInterviewContext = () => {
  return useContext(InterviewContext);
};
