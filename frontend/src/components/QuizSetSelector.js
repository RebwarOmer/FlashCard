import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSets } from "../api/apiSets"; // Your API function

const QuizSetSelector = () => {
  const [sets, setSets] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSets = async () => {
      try {
        setLoading(true);
        const data = await getSets();
        console.log(data);

        // Ensure data is an array before setting state
        if (Array.isArray(data)) {
          setSets(data);
        } else {
          setSets([]); // Fallback to empty array
          console.error("Expected array but got:", data);
        }
      } catch (err) {
        setError(err.message);
        console.error("Error fetching sets:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSets();
  }, []);

  if (loading) return <div className="py-8 text-center">Loading sets...</div>;

  if (error)
    return (
      <div className="py-8 text-center text-red-500">
        Error loading sets: {error}
      </div>
    );

  if (!sets || sets.length === 0) {
    return (
      <div className="max-w-4xl p-6 mx-auto text-center">
        <h1 className="mb-4 text-2xl font-bold">No Sets Available</h1>
        <p className="mb-4">You haven't created any flashcard sets yet.</p>
        <button
          onClick={() => navigate("/sets")}
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Create Your First Set
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <h1 className="mb-6 text-2xl font-bold">Select a Set to Quiz</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sets.map((set) => (
          <div
            key={set.id}
            className="p-4 transition-shadow border rounded-lg cursor-pointer hover:shadow-md"
            onClick={() => navigate(`/quiz/${set.setid}`)}
          >
            <h2 className="text-lg font-semibold">{set.setname}</h2>
            <p className="text-gray-600">{set.card_count?.length || 0} cards</p>
            <button className="px-4 py-2 mt-2 text-white transition-colors bg-blue-600 rounded hover:bg-blue-700">
              Start Quiz
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizSetSelector;
