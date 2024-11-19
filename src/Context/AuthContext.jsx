import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import {
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  setDoc,
  doc,
} from "firebase/firestore";
import { auth, db } from "../utilities/firebase";
import { Bounce } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchedUser, FetchingUser] = useState(true);
  const [User, setUser] = useState(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        FetchingUser(false);
        setUser(user);
      } else {
        FetchingUser(false);
        setUser(null);
      }
    });
  }, []);

  const toastObj = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    transition: Bounce,
  };

  const formValidation = (email, password, name = null) => {
    if (name !== null && name.trim() === "") {
      setError("Please fill all fields");
      return false;
    }
    if (email.trim() === "" || password.trim() === "") {
      setError("Please fill all fields");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Invalid email format");
      return false;
    }
    if (password.length < 6) {
      setError("Password should be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleAuthError = (error) => {
    switch (error) {
      case "auth/email-already-in-use":
        setError("Email already registered. Please Login.");
        break;
      case "auth/user-not-found":
        setError("User not found. Please Sign up.");
        break;
      case "auth/wrong-password":
        setError("Incorrect password. Please try again.");
        break;
      case "auth/invalid-email":
        setError("Invalid email format.");
        break;
      case "auth/network-request-failed":
        setError("Network error. Check connection.");
        break;
      default:
        setError("An error occurred. Please try again.");
    }
  };

  const signup = async (email, password, name, navigate) => {
    setError(null);

    if (!formValidation(email, password, name)) {
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password).then(
        (userCredential) => {
          const user = userCredential.user;
          setDoc(doc(db, "users", user.uid), {
            name,
            email,
            createdAt: serverTimestamp(),
            UserId: user.uid,
          });
        }
      );
      navigate("/Login");
    } catch (error) {
      handleAuthError(error.code);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (navigate) => {
    const provider = new GoogleAuthProvider();
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const q = query(
        collection(db, "users"),
        where("email", "==", user.email)
      );
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          createdAt: serverTimestamp(),
          UserId: user.uid,
        });
      }
      navigate("/InterviewForm");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email, password, navigate) => {
    setError(null);
    if (!formValidation(email, password)) {
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/InterviewForm");
    } catch (error) {
      handleAuthError(error.code);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signup,
        loading,
        error,
        setError,
        signInWithGoogle,
        signIn,
        User,
        fetchedUser,
        toastObj,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
