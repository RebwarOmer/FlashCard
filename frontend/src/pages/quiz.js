import { useState, useEffect } from "react";
import {
  FaCheck,
  FaTimes,
  FaChartBar,
  FaArrowRight,
  FaHome,
} from "react-icons/fa";
import { startQuiz, submitResponse, completeQuiz } from "../api/apiQuiz";
import { useParams, useNavigate } from "react-router-dom";

const Quiz = () => {
  const { setid } = useParams();
  const navigate = useNavigate();
  console.log(setid);

  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionId, setSessionId] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        console.log("Fetching quiz data for set:", setid);
        const quizData = await startQuiz(setid);
        console.log("Received quiz data:", quizData);

        if (!quizData?.cards) {
          console.error("No cards received in response");
          return;
        }

        setCards(quizData.cards);
        setSessionId(quizData.session.sessionId);
        setIsLoading(false);
      } catch (error) {
        console.error("Error starting quiz:", error);
      }
    };
    initializeQuiz();
  }, [setid]);

  const handleResponse = async (isCorrect) => {
    try {
      await submitResponse({
        sessionId,
        cardId: cards[currentIndex].cardId,
        isCorrect,
      });

      if (isCorrect) {
        setScore((prev) => prev + 1);
      }

      if (currentIndex === cards.length - 1) {
        await completeQuiz({
          sessionId,
          score: isCorrect ? score + 1 : score,
          totalQuestions: cards.length,
        });
        setQuizCompleted(true);
      } else {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
      }
    } catch (error) {
      console.error("Error submitting response:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
        <p className="mt-4">Loading quiz cards...</p>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
        <div className="w-full max-w-2xl p-8 text-center bg-white shadow-lg rounded-xl">
          <div className="flex justify-center mb-6">
            <FaChartBar className="text-4xl text-blue-600" />
          </div>
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
            Quiz Completed!
          </h2>

          {/* Added the score in "X/Y" format */}
          <div className="mb-4 text-3xl font-bold">
            Score: {score}/{cards.length}
          </div>

          <p className="mb-6 text-xl">
            You scored{" "}
            <span className="font-bold">
              {Math.round((score / cards.length) * 100)}%
            </span>
          </p>

          <div className="w-full h-4 mb-8 bg-gray-200 rounded-full">
            <div
              className="h-4 bg-blue-600 rounded-full"
              style={{ width: `${Math.round((score / cards.length) * 100)}%` }}
            ></div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 px-6 py-3 text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Try Again <FaArrowRight />
            </button>

            {/* Added new button to return home */}
            <button
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 px-6 py-3 text-gray-800 transition bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              <FaHome /> Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="relative w-full max-w-2xl overflow-hidden bg-white shadow-lg rounded-xl">
        <div className="absolute px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full top-4 left-4">
          {currentIndex + 1}/{cards.length}
        </div>

        <div className="p-8 pt-16 text-center min-h-[300px] flex flex-col justify-center">
          {cards.length > 0 && cards[currentIndex] ? (
            <div className="mb-6 text-2xl font-medium text-gray-800">
              {showAnswer
                ? cards[currentIndex].backcontent
                : cards[currentIndex].frontcontent}
            </div>
          ) : (
            <div className="text-red-500">No card data available</div>
          )}

          {!showAnswer && cards.length > 0 && cards[currentIndex] && (
            <button
              onClick={() => setShowAnswer(true)}
              className="px-4 py-2 mx-auto text-gray-800 transition bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Show Answer
            </button>
          )}
        </div>

        {showAnswer && (
          <div className="flex gap-4 p-4 bg-gray-100">
            <button
              onClick={() => handleResponse(false)}
              className="flex items-center justify-center flex-1 gap-2 py-3 text-white transition bg-red-500 rounded-lg hover:bg-red-600"
            >
              <FaTimes /> I Didn't Know
            </button>
            <button
              onClick={() => handleResponse(true)}
              className="flex items-center justify-center flex-1 gap-2 py-3 text-white transition bg-green-500 rounded-lg hover:bg-green-600"
            >
              <FaCheck /> I Knew It
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
