const Button = ({ text }) => {
  return (
    <button className="px-3 py-2 border-2 border-blue-500 rounded-lg shadow-lg shadow-blue-400 text-lg">
      {text}
    </button>
  );
};

export default Button;
