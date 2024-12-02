import { createContext, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { GeminiApiCall } from "../utilities/Gemini";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const interviewContext = createContext({
  industriesAndJobs: [],
  handleIndustryChange: () => {},
  jobTitles: [],
  onSubmit: () => {},
  register: () => {},
  handleSubmit: () => {},
  GenerateQuestions: false,
  setValue: [],
  value: [],
  btndisable: false,
});

const InterviewContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const industriesAndJobs = [
    {
      industry: " Software Development",
      jobs: [
        " Software Engineering",
        "Application Development",
        "Systems Integration",
        "Quality Assurance and Testing",
      ],
    },
    {
      industry: " Web and Mobile App Development",
      jobs: [
        "Mernstack ",
        "Frontend Developer",
        "Backend Developer",
        "Fullstack Developer",
        "Mobile App Developer (iOS/Android)",
        "React Developer",
        "Angular Developer",
        "UI/UX Designer",
        "Flutter Developer",
      ],
    },
    {
      industry: " Data Science and Analytics",
      jobs: [
        "Data Scientist",
        "Data Analyst",
        "Data Engineer",
        "Business Intelligence Analyst",
        "Machine Learning Engineer",
        "Data Visualization Specialist",
      ],
    },
    {
      industry: "Artificial Intelligence",
      jobs: [
        "AI Research Scientist",
        "Machine Learning Engineer",
        "Deep Learning Specialist",
        "AI Software Engineer",
        "Computer Vision Engineer",
        "NLP Engineer",
      ],
    },
    {
      industry: "Cybersecurity",
      jobs: [
        "Cybersecurity Analyst",
        "Security Engineer",
        "Penetration Tester",
        "Ethical Hacker",
        "Security Operations Center (SOC) Analyst",
        "Network Security Engineer",
      ],
    },
    {
      industry: "Education Technology (EdTech)",
      jobs: [
        " E-Learning Developer",
        "Curriculum Designer (Tech-based)",
        "Educational Data Analyst",
        "Instructional Designer",
      ],
    },
    {
      industry: " Cloud Computing and DevOps",
      jobs: [
        " Cloud Engineering (AWS, Azure, GCP)",
        "DevOps Engineer (CI/CD, Kubernetes)",
        "Site Reliability Engineering (SRE)",
        "Cloud Solutions Architect",
      ],
    },
    {
      industry: "E-commerce & Fintech",
      jobs: [
        "E-commerce Manager",
        "Product Manager (Fintech)",
        "Blockchain Developer",
        "Fintech Analyst",
        "Payment Gateway Specialist",
        "Digital Marketing Manager",
      ],
    },
    {
      industry: "Telecommunications & Networking",
      jobs: [
        "Network Engineer",
        "Telecommunications Technician",
        "Wireless Communications Specialist",
        "IoT Engineer",
        "Network Administrator",
      ],
    },
    {
      industry: "Robotics & Automation",
      jobs: [
        "Robotics Engineer",
        "Automation Engineer",
        "Mechatronics Engineer",
        "Control Systems Engineer",
        "Industrial Automation Specialist",
      ],
    },
    {
      industry: "Gaming & Entertainment",
      jobs: [
        "Game Developer",
        "Game Designer",
        "3D Animator",
        "VR/AR Developer",
        "Multimedia Designer",
        "Sound Designer",
      ],
    },
    {
      industry: "Internet of Things and Smart Technology",
      jobs: [
        "IoT Engineer",
        "Embedded Systems Engineer",
        "IoT Security Specialist",
        "IoT Data Analyst",
      ],
    },
    {
      industry: "Health Tech",
      jobs: [
        "Health Informatics Specialist",
        "Biomedical Engineer",
        "Clinical Systems Analyst",
        "Health Data Analyst",
        "Telemedicine Specialist",
      ],
    },
  ];

  const { register, handleSubmit } = useForm();
  const [jobTitles, setJobTitles] = useState([]);
  const [GenerateQuestions, setGenerateQuestions] = useState(false);
  const [value, setValue] = useState([]);
  const [btndisable, setBtnDisable] = useState(false);
  const { setError } = useAuth();

  const onSubmit = async (formData) => {
    const { selectedIndustry, Description, Experience, JobTitle, Type } =
      formData;
    if (
      selectedIndustry === "" ||
      Description === "" ||
      Experience === "" ||
      JobTitle === "" ||
      Type === "" ||
      value.length <= 0
    ) {
      setError("Please Fill all Fields");
      return;
    }
    if (Description.length > 300) {
      console.log(Description.length);

      setError("Your Description exceeds 300 characters. Please shorten it");
      return;
    }

    setBtnDisable(true);
    const prompt = `Generate a JSON array of realistic, professional interview questions based on the following job details. Focus on questions that assess the candidate’s skills, experience, and fit for the role in a real-world interview setting. Make questions natural and relevant. Job Details:Industry: ${selectedIndustry},  Job Title: ${JobTitle} , Job Description: ${Description} , Required Skills: ${value.join(
      " , "
    )} , Experience Level: ${Experience} Output only the questions as a JSON array, with no additional text or symbols.`;
    setGenerateQuestions(true);
    const userDetails = `I am a ${JobTitle} , my sills is ${value.join(
      " , "
    )} and my experience is  ${Experience} `;

    try {
      const result = await GeminiApiCall(prompt);
      const cleanResponse = result
        .replace(/```json/, "")
        .replace(/```/, "")
        .trim();
      const parse = JSON.parse(cleanResponse);
      setGenerateQuestions(false);
      setBtnDisable(false);
      navigate("/interview", {
        state: {
          questions: parse,
          jobTitle: JobTitle,
          userDetails: userDetails,
        },
      });
    } catch (error) {
      setError("Error while running the API or saving data:");
      setBtnDisable(false);
      setGenerateQuestions(false);
    }
  };
  const handleIndustryChange = (e) => {
    const selectedIndustry = e.target.value;
    const findJobs = industriesAndJobs.find(
      (obj) => obj.industry === selectedIndustry
    );
    if (findJobs) {
      setJobTitles(findJobs.jobs);
    } else {
      setJobTitles([]);
    }
  };

  return (
    <interviewContext.Provider
      value={{
        industriesAndJobs,
        handleIndustryChange,
        jobTitles,
        onSubmit,
        register,
        handleSubmit,
        btndisable,
        GenerateQuestions,
        setValue,
        value,
      }}
    >
      {children}
    </interviewContext.Provider>
  );
};

const useInterviewContext = () => {
  return useContext(interviewContext);
};

export { InterviewContextProvider, useInterviewContext };
