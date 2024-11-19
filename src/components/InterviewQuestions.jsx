// import { useEffect } from "react";
// import { useInterviewContext } from "../store/InterviewQuestionContext";
// import { useAuth } from "../store/AuthContext";

const InterviewQuestions = () => {
  // const { getUserName, userName } = useInterviewContext();
  // const { User, fetchedUser } = useAuth();
  // useEffect(() => {
  //   if (!fetchedUser) {
  //     getUserName(User.uid);
  //   }
  // }, []);
  return (
    <div className="h-[calc(100svh-82px)]  w-full flex items-center justify-center">
      {/* <div className="max-w-[1200px] w-[80%] rounded-xl bg-[#040E1A] min-h-[80%] shadow-lg shadow-blue-300 px-5 py-4">
        <div className="w-full flex items-center flex-col gap-10">
          <div className="w-full flex gap-3">
            <p className="text-xl font-medium">Q1:</p>
            <p className="text-xl font-medium">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptas
              doloribus consequatur cumque vero suscipit autem. Animi beatae
              accusantium a sed.
            </p>
          </div>
          <div className="w-full flex flex-col gap-3">
            <label className="text-xl font-semibold" htmlFor="answer">
              Enter Your Answer:
            </label>
            <textarea
              id="answer"
              rows="7"
              placeholder="Write Answer..."
              className="bg-[#CBD5E1] w-full outline-none text-xl font-semibold text-black px-3 py-1 rounded-lg placeholder-black"
            ></textarea>
          </div>
          <div className="w-full flex justify-end">
            <button className="px-3 py-2 bg-blue-950 border-[3px] rounded-lg border-blue-400 font-semibold text-base">
              Next Question
            </button>
          </div>
        </div>
      </div> */}
      {/* <div className="w-full h-full flex flex-col">
        <div className=" h-[70%] flex items-center justify-center">
          <img
            src="/Ai-removebg.png"
            alt="Robot"
            className="w-auto h-[350px] object-cover"
          />
        </div>
        <div className="h-[30%] flex items-center justify-center">
          <button>Next Question</button>
          <button>Repeat Question</button>
          <button></button>
        </div>
      </div> */}
    </div>
  );
};

export default InterviewQuestions;
