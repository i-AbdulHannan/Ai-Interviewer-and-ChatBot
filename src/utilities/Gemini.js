import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyC8FZKDC7C2-p4v9H5_B0MQFswRWp_r0ig";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const GeminiApiCall = async (prompt, history = []) => {
  const chatSession = model.startChat({
    generationConfig,
    history: history,
  });

  console.log(history);
  const result = await chatSession.sendMessage(prompt);
  const responseText = result.response.text();
  return responseText;
};

export { GeminiApiCall };
