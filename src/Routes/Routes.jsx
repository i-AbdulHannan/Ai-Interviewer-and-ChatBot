import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "../Context/AuthContext";
import Layout from "../Layout/Layout";
import Hero from "../Pages/Hero";
import Signup from "../Pages/Signup";
import Login from "../Pages/Login";
import InterviewQuestions from "../Pages/InterviewQuestions";
import InterviewForm from "../Pages/InterviewForm";
import { InterviewFormProvider } from "../Context/InterviewFormContext";
import { InterviewContextProvider } from "../Context/InterviewQuestionContext";
import ProtectedRoute from "./ProtectedRoutes";
import { ApiContextProvider } from "../Context/ApiContext";
import ChatBot from "../Pages/ChatBot";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Layout />
        <Hero />
      </>
    ),
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/interview-form",
    element: (
      <ProtectedRoute>
        <InterviewFormProvider>
          <InterviewForm />
        </InterviewFormProvider>
      </ProtectedRoute>
    ),
  },
  {
    path: "/interview",
    element: (
      <ProtectedRoute>
        <Layout />
        <InterviewContextProvider>
          <InterviewQuestions />
        </InterviewContextProvider>
      </ProtectedRoute>
    ),
  },
  {
    path: "/app",
    element: (
      <ProtectedRoute>
        <Layout />
        <ApiContextProvider>
          <ChatBot />
        </ApiContextProvider>
      </ProtectedRoute>
    ),
  },
]);

const Routes = () => {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default Routes;
