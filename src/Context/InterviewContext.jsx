import { createContext, useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { GeminiApiCall } from "../utilities/Gemini";
import { useNavigate } from "react-router-dom";

const interviewContext = createContext();

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
  const [userDetails, setUserDetaisl] = useState("");

  const onSubmit = async (formData) => {
    const { selectedIndustry, Description, Experience, JobTitle, Skills } =
      formData;
    const prompt = `Generate a JSON array of realistic, professional 3 interview questions based on the following job details. Focus on questions that assess the candidate’s skills, experience, and fit for the role in a real-world interview setting. Make questions natural and relevant. Job Details:Industry: ${selectedIndustry},  Job Title: ${JobTitle} , Job Description: ${Description} , Required Skills: ${Skills} , Experience Level: ${Experience} Output only the questions as a JSON array, with no additional text or symbols.`;
    setGenerateQuestions(true);
    setUserDetaisl(
      `I am a ${JobTitle} , my sills is ${Skills} and my experience is  ${Experience} `
    );
    try {
      const result = await GeminiApiCall(prompt);
      const cleanResponse = result
        .replace(/```json/, "")
        .replace(/```/, "")
        .trim();
      const parse = JSON.parse(cleanResponse);
      setGenerateQuestions(false);
      navigate("/interview", { state: parse });
    } catch (error) {
      console.error("Error while running the API or saving data:", error);
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
        FormData,
        GenerateQuestions,
        userDetails,
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
