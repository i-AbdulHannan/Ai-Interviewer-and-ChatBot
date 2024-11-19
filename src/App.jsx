import Header from "./components/Header";
import Hero from "./components/Hero";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import InterviewForm from "./components/InterviewForm";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./Context/AuthContext.jsx";
import { InterviewFormProvider } from "./Context/InterviewFormContext.jsx";
import InterviewQuestions from "./components/InterviewQuestions.jsx";
import { InterviewContextProvider } from "./Context/InterviewQuestionContext.jsx";
import ChatBot from "./components/ChatBot.jsx";
import { ApiContextProvider } from "./Context/ApiContext.jsx";
import Layout from "./Layout/Layout.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
      <InterviewFormProvider>
        <ProtectedRoute>
          <InterviewForm />
        </ProtectedRoute>
      </InterviewFormProvider>
    ),
  },
  {
    path: "/interview",
    element: (
      <ProtectedRoute>
        <Layout />
        <InterviewContextProvider>
          <Header />
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

const App = () => {
  const queryClient = new QueryClient();

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AuthProvider>
  );
};

export default App;
