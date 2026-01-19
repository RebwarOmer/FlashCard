import API from "./axios"; // Adjust the path if needed

export const startQuiz = async (setid) => {
  const response = await API.post("/quiz/start", { setid });
  // Capital "I"
  return response.data;
};

export const submitResponse = async ({ sessionId, cardId, isCorrect }) => {
  await API.post("/quiz/response", { sessionId, cardId, isCorrect });
};

export const completeQuiz = async ({ sessionId, score, totalQuestions }) => {
  await API.post("/quiz/complete", { sessionId, score, totalQuestions });
};
