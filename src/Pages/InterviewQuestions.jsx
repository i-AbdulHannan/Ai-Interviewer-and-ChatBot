import { useEffect, useState } from "react";
import Button from "../Components/Button";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { GeminiApiCall } from "../utilities/Gemini";
import { toast } from "react-toastify";
import { useAuth } from "../Context/AuthContext";
import Result from "../Components/Result";
import { useInterviewContext } from "../Context/InterviewContext";
import { db } from "../utilities/firebase"; // Ensure Firebase setup is correct
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

const InterviewQuestions = () => {
  const location = useLocation();
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [Answers, setAnswers] = useState([]);
  const [index, setIndex] = useState(0);
  const [response, setResponse] = useState(null);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [generateResult, setGenerateResult] = useState(false);
  const [questions, setQuestions] = useState(location.state.questions);
  const [jobTitle, setJobTitle] = useState(location.state.jobTitle);
  const { toastObj, User, setError } = useAuth();

  const handleChange = (e) => {
    setCurrentAnswer(e.target.value);
  };

  useEffect(() => {
    if (response) {
      // After response is set, store it in Firestore
      console.log("statrr");

      addDoc(collection(db, "Interview"), {
        Result: response,
        timestamp: serverTimestamp(),
        UserId: User.uid,
        jobTitle,
      })
        .then(() => {
          setJobTitle("");
          setQuestions([]);
          setInterviewComplete(true);
          setGenerateResult(false); // Stop loading indicator
          console.log("end");
        })
        .catch((error) => {
          setError(error.message);
          setGenerateResult(false);
          console.log(error);
        });
    }
  }, [response]); // Run after response is updated

  const handleNextQuestion = async () => {
    if (index < questions.length - 1) {
      if (currentAnswer.trim() === "") {
        toast.warning("Please write answer in text Area:", toastObj);
        return;
      }
      setAnswers((prev) => [...prev, currentAnswer]);
      setIndex(index + 1);
      setCurrentAnswer("");
    } else if (index === questions.length - 1) {
      if (currentAnswer.trim() === "") {
        toast.warning("Please write answer in text Area:", toastObj);
        return;
      }
      setAnswers((prev) => [...prev, currentAnswer]);
      setGenerateResult(true);
      const AllQuestions = questions.map((item) => ({ text: item }));
      const allAnswers = [...Answers, currentAnswer];
      const AnswersStructure = allAnswers.map(
        (item, index) => `${index + 1}: Answer ${item}`
      );

      const prompt = `Please rate the following answers out of 5, calculate the percentage, and provide a short message about the result. The questions have been provided in the previous history; please check them. Give me only percentage no extra text. ${AnswersStructure.join(
        "\n"
      )}`;
      try {
        const ApiResponse = await GeminiApiCall(prompt, [
          {
            role: "user",
            parts: AllQuestions,
          },
        ]);
        console.log(typeof ApiResponse);

        if (ApiResponse.trim().endsWith("%")) {
          setResponse(ApiResponse.slice(0, -2));
        } else {
          setResponse(ApiResponse);
        }
      } catch (error) {
        setError(error.message);
        setGenerateResult(false);
        console.log(error);
      }
    }
  };

  return (
    <div className="min-h-[calc(100svh-80px)] py-6 w-full flex items-center justify-center">
      <div className="max-w-[1200px] lg:w-[80%] w-[97%] rounded-xl bg-[#040E1A] min-h-[80%] shadow-md shadow-blue-300 md:px-5 px-3 py-4">
        {Array.isArray(questions) && questions.length > 0 && (
          <div className="w-full flex items-center flex-col gap-10">
            <div className="w-full flex flex-col md:flex-row md:gap-3 gap-1">
              <p className="text-xl font-medium">{`Q${index + 1}:`}</p>
              <p className="md:text-xl text-lg font-medium">
                {questions[index]}
              </p>
            </div>
            <div className="w-full flex flex-col md:gap-3 gap-1">
              <label
                className="text-xl text-center md:text-left font-semibold"
                htmlFor="answer"
              >
                Enter Your Answer:
              </label>
              <textarea
                value={currentAnswer}
                onChange={handleChange}
                id="answer"
                rows="7"
                placeholder="Write Answer..."
                className="bg-[#CBD5E1] w-full outline-none md:text-xl text-lg font-semibold text-black px-3 py-1 rounded-lg placeholder-black"
              ></textarea>
            </div>
            <div className="w-full flex justify-end">
              <Button
                Click={handleNextQuestion}
                text={
                  generateResult
                    ? "Generating Result..."
                    : questions.length - 1 === index
                    ? "Submit"
                    : "Next Question"
                }
              />
            </div>
          </div>
        )}
        {interviewComplete && <Result percentage={response} />}
        {questions.length == 0 && !interviewComplete && (
          <div className="w-full h-full flex items-center justify-center lg:px-20 flex-col gap-7">
            <p className="lg:text-3xl text-xl font-semibold text-center">
              Interview questions currently unavailable. Please fill the form to
              proceed with the interview.
            </p>
            <Button>
              <Link to="/interview-form">Interview Form</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewQuestions;
