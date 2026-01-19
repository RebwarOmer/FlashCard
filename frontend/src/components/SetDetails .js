import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCards, deleteCard, updateCard, createCard } from "../api/apiCards";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiX,
  FiCheck,
  FiMinus,
} from "react-icons/fi";
import { FaPlay } from "react-icons/fa";

const SetDetails = () => {
  const { setid } = useParams();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Modal states
  const [editModal, setEditModal] = useState({
    show: false,
    card: null,
    front: "",
    back: "",
  });

  const [createModal, setCreateModal] = useState({
    show: false,
    cards: [{ front: "", back: "" }],
    currentIndex: 0,
  });

  const [flippedCards, setFlippedCards] = useState({});

  // Fetch cards when component mounts or setid changes
  useEffect(() => {
    const fetchCards = async () => {
      try {
        setLoading(true);
        const response = await getCards(setid);

        if (response.error) {
          setError(response.error);
        } else {
          setCards(response.cards || []);
          const initialFlipped = {};
          response.cards?.forEach((card) => {
            initialFlipped[card.cardid] = false;
          });
          setFlippedCards(initialFlipped);
        }
      } catch (error) {
        setError("Failed to fetch cards. Please try again.");
        console.error("Error fetching cards:", error);
      } finally {
        setLoading(false);
      }
    };

    if (setid) fetchCards();
  }, [setid]);

  const handleStartQuiz = (setId) => {
    navigate(`/quiz/${setId}`);
  };
  // Delete a card
  const handleDeleteCard = async (cardid) => {
    try {
      const result = await deleteCard(cardid);
      if (!result.error) {
        setCards((prev) => prev.filter((card) => card.cardid !== cardid));
        // Remove from flipped state
        setFlippedCards((prev) => {
          const newState = { ...prev };
          delete newState[cardid];
          return newState;
        });
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError("Failed to delete card. Please try again.");
      console.error("Error deleting card:", error);
    }
  };

  // Update a card
  const handleUpdateCard = async () => {
    if (!editModal.card) return;

    try {
      await updateCard(editModal.card.cardid, editModal.front, editModal.back);
      setCards((prev) =>
        prev.map((card) =>
          card.cardid === editModal.card.cardid
            ? {
                ...card,
                frontcontent: editModal.front,
                backcontent: editModal.back,
              }
            : card
        )
      );
      setEditModal({ show: false, card: null, front: "", back: "" });
    } catch (error) {
      setError("Failed to update card. Please try again.");
      console.error("Error updating card:", error);
    }
  };

  // Create multiple cards
  const handleCreateCards = async () => {
    try {
      const createdCards = [];

      // Create each card in the modal
      for (const card of createModal.cards) {
        if (card.front.trim() && card.back.trim()) {
          const newCard = await createCard(setid, card.front, card.back);
          createdCards.push(newCard);
        }
      }

      if (createdCards.length > 0) {
        setCards((prev) => [...prev, ...createdCards]);

        // Add to flipped state
        const newFlipped = { ...flippedCards };
        createdCards.forEach((card) => {
          newFlipped[card.cardid] = false;
        });
        setFlippedCards(newFlipped);
      }

      setCreateModal({
        show: false,
        cards: [{ front: "", back: "" }],
        currentIndex: 0,
      });
    } catch (error) {
      setError("Failed to create cards. Please try again.");
      console.error("Error creating cards:", error);
    }
  };

  // Add a new card field to the create modal
  const addNewCardField = () => {
    setCreateModal((prev) => ({
      ...prev,
      cards: [...prev.cards, { front: "", back: "" }],
      currentIndex: prev.cards.length,
    }));
  };

  // Remove a card field from the create modal
  const removeCardField = (index) => {
    if (createModal.cards.length <= 1) return;

    setCreateModal((prev) => {
      const newCards = [...prev.cards];
      newCards.splice(index, 1);

      return {
        ...prev,
        cards: newCards,
        currentIndex: Math.min(prev.currentIndex, newCards.length - 1),
      };
    });
  };

  // Update a specific card field in the create modal
  const updateCardField = (index, field, value) => {
    setCreateModal((prev) => {
      const newCards = [...prev.cards];
      newCards[index] = { ...newCards[index], [field]: value };
      return { ...prev, cards: newCards };
    });
  };

  // Set the current card index in the create modal
  const setCurrentCardIndex = (index) => {
    setCreateModal((prev) => ({ ...prev, currentIndex: index }));
  };

  // Toggle card flip state
  const toggleCardFlip = (cardid) => {
    setFlippedCards((prev) => ({
      ...prev,
      [cardid]: !prev[cardid],
    }));
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Flashcard Set</h1>
          <p className="mt-2 text-gray-600">
            {cards.length} {cards.length === 1 ? "card" : "cards"} in this set
          </p>
        </header>

        {error && (
          <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex flex-col items-center mb-8">
          <button
            onClick={() =>
              setCreateModal({
                show: true,
                cards: [{ front: "", back: "" }],
                currentIndex: 0,
              })
            }
            className="flex items-center justify-center w-64 h-40 gap-2 px-6 py-3 font-medium text-blue-600 transition-all bg-white shadow-md rounded-xl hover:shadow-lg"
          >
            <FiPlus className="w-6 h-6" />
            <span>Add New Cards</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
        ) : cards.length === 0 ? (
          <div className="p-8 text-center bg-white shadow-sm rounded-xl">
            <p className="text-gray-500">No flashcards found in this set.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <div key={card.cardid} className="relative group">
                <div
                  className="relative h-64 cursor-pointer perspective"
                  onClick={() => toggleCardFlip(card.cardid)}
                >
                  <div
                    className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
                      flippedCards[card.cardid] ? "rotate-y-180" : ""
                    }`}
                  >
                    {/* Front of card */}
                    <div className="absolute flex flex-col items-center justify-center w-full h-full p-6 bg-white shadow-md rounded-xl backface-hidden">
                      <div className="absolute top-0 left-0 flex items-center justify-center w-8 h-8 m-3 text-xs font-bold text-white bg-blue-500 rounded-full">
                        ?
                      </div>
                      <p className="text-xl font-medium text-center text-gray-800">
                        {card.frontcontent}
                      </p>
                    </div>

                    {/* Back of card */}
                    <div className="absolute flex flex-col items-center justify-center w-full h-full p-6 bg-blue-500 shadow-md rounded-xl backface-hidden rotate-y-180">
                      <div className="absolute top-0 left-0 flex items-center justify-center w-8 h-8 m-3 text-xs font-bold text-blue-500 bg-white rounded-full">
                        !
                      </div>
                      <p className="text-xl font-medium text-center text-white">
                        {card.backcontent}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card actions */}
                <div className="absolute flex gap-2 transition-opacity opacity-0 top-4 right-4 group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditModal({
                        show: true,
                        card,
                        front: card.frontcontent,
                        back: card.backcontent,
                      });
                    }}
                    className="p-2 text-white bg-blue-500 rounded-full shadow hover:bg-blue-600"
                    aria-label="Edit card"
                  >
                    <FiEdit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCard(card.cardid);
                    }}
                    className="p-2 text-white bg-red-500 rounded-full shadow hover:bg-red-600"
                    aria-label="Delete card"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Card Modal */}
        {editModal.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="w-full max-w-md p-6 bg-white shadow-2xl rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Edit Card</h2>
                <button
                  onClick={() =>
                    setEditModal({
                      show: false,
                      card: null,
                      front: "",
                      back: "",
                    })
                  }
                  className="p-1 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Front
                </label>
                <textarea
                  value={editModal.front}
                  onChange={(e) =>
                    setEditModal((prev) => ({ ...prev, front: e.target.value }))
                  }
                  className="w-full p-3 text-gray-800 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  autoFocus
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Back
                </label>
                <textarea
                  value={editModal.back}
                  onChange={(e) =>
                    setEditModal((prev) => ({ ...prev, back: e.target.value }))
                  }
                  className="w-full p-3 text-gray-800 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() =>
                    setEditModal({
                      show: false,
                      card: null,
                      front: "",
                      back: "",
                    })
                  }
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateCard}
                  disabled={!editModal.front.trim() || !editModal.back.trim()}
                  className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiCheck className="inline mr-1" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Cards Modal */}
        {createModal.show && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="w-full max-w-2xl p-6 bg-white shadow-2xl rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  Create Multiple Cards
                </h2>
                <button
                  onClick={() =>
                    setCreateModal({
                      show: false,
                      cards: [{ front: "", back: "" }],
                      currentIndex: 0,
                    })
                  }
                  className="p-1 text-gray-400 rounded-full hover:text-gray-600 hover:bg-gray-100"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Card navigation tabs */}
              <div className="flex mb-4 overflow-x-auto">
                {createModal.cards.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentCardIndex(index)}
                    className={`flex items-center px-4 py-2 mr-2 text-sm font-medium rounded-t-lg ${
                      createModal.currentIndex === index
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Card {index + 1}
                    {createModal.cards.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeCardField(index);
                        }}
                        className="ml-2 text-gray-500 hover:text-gray-700"
                      >
                        <FiMinus className="w-3 h-3" />
                      </button>
                    )}
                  </button>
                ))}
                <button
                  onClick={addNewCardField}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  <FiPlus className="w-4 h-4 mr-1" />
                  Add Card
                </button>
              </div>

              {/* Current card form */}
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Front
                </label>
                <textarea
                  value={
                    createModal.cards[createModal.currentIndex]?.front || ""
                  }
                  onChange={(e) =>
                    updateCardField(
                      createModal.currentIndex,
                      "front",
                      e.target.value
                    )
                  }
                  className="w-full p-3 text-gray-800 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  autoFocus
                  placeholder="Enter question or term"
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Back
                </label>
                <textarea
                  value={
                    createModal.cards[createModal.currentIndex]?.back || ""
                  }
                  onChange={(e) =>
                    updateCardField(
                      createModal.currentIndex,
                      "back",
                      e.target.value
                    )
                  }
                  className="w-full p-3 text-gray-800 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Enter answer or definition"
                />
              </div>

              <div className="flex justify-between">
                <div>
                  {createModal.cards.length > 1 && (
                    <button
                      onClick={() => removeCardField(createModal.currentIndex)}
                      className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      <FiMinus className="w-4 h-4 mr-1" />
                      Remove This Card
                    </button>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      setCreateModal({
                        show: false,
                        cards: [{ front: "", back: "" }],
                        currentIndex: 0,
                      })
                    }
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateCards}
                    disabled={
                      !createModal.cards.some(
                        (card) => card.front.trim() && card.back.trim()
                      )
                    }
                    className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiCheck className="inline mr-1" />
                    Save All Cards ({createModal.cards.length})
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="fixed z-40 bottom-6 right-6">
        <button
          onClick={() => handleStartQuiz(setid)}
          className="flex items-center justify-center p-4 text-white transition-all bg-green-500 rounded-full shadow-lg hover:bg-green-600 hover:shadow-xl"
          aria-label="Start quiz"
          title="Start Quiz"
        >
          <FaPlay className="w-6 h-6" />
          <span className="ml-2 font-medium">Start Quiz</span>
        </button>
      </div>
    </div>
  );
};

export default SetDetails;
