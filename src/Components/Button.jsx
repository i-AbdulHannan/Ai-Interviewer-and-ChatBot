const Button = ({ text, children, Click, Class }) => {
  return (
    <button
      className={`px-4 py-2 border-2 border-blue-500 rounded-lg shadow-md shadow-blue-400 text-lg ${Class}`}
      onClick={Click}
    >
      {text}
      {children}
    </button>
  );
};

export default Button;
