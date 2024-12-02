import { useEffect, useState } from "react";
import Button from "../Components/Button";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { GeminiApiCall } from "../utilities/Gemini";
import { useAuth } from "../Context/AuthContext";
import Result from "../Components/Result";
import { db } from "../utilities/firebase"; // Ensure Firebase setup is correct
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

const InterviewQuestions = () => {
  const location = useLocation();
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [Answers, setAnswers] = useState([]);
  const [index, setIndex] = useState(0);
  const [response, setResponse] = useState(null);
  const [interviewComplete, setInterviewComplete] = useState(false);
  const [generateResult, setGenerateResult] = useState(false);
  const [questions, setQuestions] = useState(location?.state?.questions || []);
  const [jobTitle, setJobTitle] = useState(location?.state?.jobTitle || null);
  const [btnDisable, setBtnDisable] = useState(false);
  const [userdetail, setUserDetail] = useState(
    location?.state?.userDetails || null
  );
  const { User, setError } = useAuth();

  const handleChange = (e) => {
    setCurrentAnswer(e.target.value);
  };

  useEffect(() => {
    if (response) {
      addDoc(collection(db, "Interview"), {
        Result: response,
        timestamp: serverTimestamp(),
        UserId: User.uid,
        jobTitle,
      })
        .then(() => {
          setQuestions([]);
          setInterviewComplete(true);
          setGenerateResult(false);
          setBtnDisable(false);
          setJobTitle(null);
        })
        .catch((error) => {
          setBtnDisable(false);
          setError("Error save response");
          setGenerateResult(false);
        });
    }
  }, [response]);

  const handleNextQuestion = async () => {
    if (index < questions.length - 1) {
      if (currentAnswer.trim() === "") {
        setError("Please write answer in text Area:");
        return;
      }
      if (currentAnswer.trim().length > 600) {
        setError("Your Answer exceeds 600 characters. Please shorten it");
        return;
      }
      setAnswers((prev) => [...prev, currentAnswer]);
      setIndex(index + 1);
      setCurrentAnswer("");
    } else if (index === questions.length - 1) {
      if (currentAnswer.trim() === "") {
        setError("Please write answer in text Area:");
        return;
      }
      if (currentAnswer.trim().length > 600) {
        setError("Your Answer exceeds 600 characters. Please shorten it");
        console.log(currentAnswer.length);
        return;
      }
      setAnswers((prev) => [...prev, currentAnswer]);
      setBtnDisable(true);
      setGenerateResult(true);
      const AllQuestions = questions.map((item) => ({ text: item }));
      const allAnswers = [...Answers, currentAnswer];
      const AnswersStructure = allAnswers.map(
        (item, index) => `${index + 1}: Answer ${item}`
      );

      const prompt = `Please evaluate the following answers based on the questions provided in the previous history. Rate each answer out of 5, then calculate the total percentage. Ensure that the answers align with the context and are concise and clear. provide only the total percentage , without any extra text." ${AnswersStructure.join(
        "\n"
      )}`;
      try {
        const ApiResponse = await GeminiApiCall(prompt, [
          {
            role: "user",
            parts: [{ text: userdetail }, ...AllQuestions],
          },
        ]);
        if (ApiResponse.trim().endsWith("%")) {
          setResponse(ApiResponse.slice(0, -2));
        } else if (ApiResponse.trim().length > 4) {
          setResponse(0);
        } else {
          setResponse(ApiResponse);
        }
        setInterviewComplete(true);
        setUserDetail(null);
        setQuestions(null);
      } catch (error) {
        setError("Error generating Result Please try again or later");
        setGenerateResult(false);
        setBtnDisable(false);
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
                id="answer "
                rows="7"
                placeholder="Write Answer..."
                className="bg-[#CBD5E1] w-full outline-none md:text-xl text-lg font-semibold text-black px-3 py-1 rounded-lg placeholder-black custom-sidebar"
              ></textarea>
            </div>
            <div className="w-full flex justify-end">
              <Button
                Click={handleNextQuestion}
                disabled={btnDisable}
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
        {!questions?.length && !interviewComplete && (
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
