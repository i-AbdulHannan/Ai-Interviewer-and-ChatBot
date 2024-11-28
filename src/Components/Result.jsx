import React from "react";
import Button from "./Button";
import { Link } from "react-router-dom";

const ProgressCircle = ({ percentage }) => {
  const progressColor = percentage >= 60 ? "#39FF14" : "#f87171";

  return (
    <div className="flex flex-col items-center justify-center h-full py-2 gap-8">
      <div
        className="relative flex items-center justify-center rounded-full h-52 w-52"
        style={{
          background: `conic-gradient(${progressColor} 0% ${percentage}%, #e5e7eb ${percentage}% 100%)`,
        }}
      >
        <div className="absolute text-4xl font-bold text-black">
          {percentage}%
        </div>
      </div>
      <p className="md:text-2xl font-medium text-center text-lg">
        {percentage >= 80
          ? "Excellent performance! 👍 You are highly prepared for the role."
          : percentage >= 60
          ? "Good effort! You meet the requirements, but there's room for improvement."
          : "Needs improvement! 🙁 Consider reviewing the topics and trying again."}
      </p>
      <div className="flex flex-col md:flex-row items-center justify-center md:gap-9 gap-6">
        <Button>
          <Link to="/app">GoTo DashBoard</Link>
        </Button>
        <Button>
          <Link to="/interview-form">Again Interview</Link>
        </Button>
      </div>
    </div>
  );
};

export default ProgressCircle;
