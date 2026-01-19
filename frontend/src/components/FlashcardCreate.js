import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSet } from "../api/apiSets";
import { createCard } from "../api/apiCards";
import { FiPlus, FiTrash2, FiArrowLeft } from "react-icons/fi";

const FlashcardCreate = () => {
  const [title, setTitle] = useState("");
  const [flashcards, setFlashcards] = useState([]);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAddFlashcard = () => {
    if (!front.trim() || !back.trim()) {
      setError("Both front and back content are required");
      return;
    }
    setFlashcards((prevFlashcards) => [
      ...prevFlashcards,
      { frontcontent: front, backcontent: back },
      $,
    ]);
    setFront("");
    setBack("");
    setError("");
  };

  const removeFlashcard = (index) => {
    const updatedFlashcards = [...flashcards];
    updatedFlashcards.splice(index, 1);
    setFlashcards(updatedFlashcards);
  };

  const handleCreateSet = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (flashcards.length === 0) {
      setError("Please add at least one flashcard");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await createSet(title);

      if (response.error) {
        setError(response.error);
        return;
      }

      const setId = response.setid;
      if (!setId) {
        throw new Error("Set ID is undefined");
      }

      // Create all cards in parallel for better performance
      await Promise.all(
        flashcards.map((card) =>
          createCard(setId, card.frontcontent, card.backcontent)
        )
      );

      navigate("/sets");
    } catch (err) {
      console.error("Error creating set:", err);
      setError("An error occurred while creating the set. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <FiArrowLeft className="mr-2" />
            Back
          </button>
        </div>

        <div className="overflow-hidden bg-white rounded-lg shadow-xl">
          {/* Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-800">
            <h1 className="text-2xl font-bold text-white">
              Create New Flashcard Set
            </h1>
          </div>

          {/* Main Content */}
          <div className="p-6">
            {error && (
              <div className="p-3 mb-6 text-red-600 rounded-md bg-red-50">
                {error}
              </div>
            )}

            {/* Set Title */}
            <div className="mb-8">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Set Title
              </label>
              <input
                type="text"
                placeholder="Enter a title for your flashcard set"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Add Flashcards */}
            <div className="mb-8">
              <h2 className="mb-4 text-lg font-medium text-gray-800">
                Add Flashcards
              </h2>

              <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Front (Question)
                  </label>
                  <textarea
                    placeholder="Enter question or term"
                    value={front}
                    onChange={(e) => setFront(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Back (Answer)
                  </label>
                  <textarea
                    placeholder="Enter answer or definition"
                    value={back}
                    onChange={(e) => setBack(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                onClick={handleAddFlashcard}
                disabled={!front.trim() || !back.trim()}
                className="flex items-center justify-center w-full px-4 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiPlus className="mr-2" />
                Add Flashcard
              </button>
            </div>

            {/* Preview Flashcards */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-800">
                  Flashcard Preview
                </h2>
                <span className="text-sm text-gray-500">
                  {flashcards.length}{" "}
                  {flashcards.length === 1 ? "card" : "cards"}
                </span>
              </div>

              {flashcards.length === 0 ? (
                <div className="py-8 text-center rounded-md bg-gray-50">
                  <p className="text-gray-500">No flashcards added yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {flashcards.map((card, index) => (
                    <div
                      key={index}
                      className="p-4 border border-gray-200 rounded-md hover:shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-800">
                            {card.frontcontent}
                          </h3>
                          <p className="mt-1 text-gray-600">
                            {card.backcontent}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFlashcard(index)}
                          className="text-gray-400 hover:text-red-500"
                          aria-label="Remove flashcard"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => navigate(-1)}
                className="px-6 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSet}
                disabled={loading || !title.trim() || flashcards.length === 0}
                className="px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="w-4 h-4 mr-2 -ml-1 text-white animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Creating...
                  </span>
                ) : (
                  "Create Set"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardCreate;
