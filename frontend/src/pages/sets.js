import { MdModeEdit, MdAdd } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import { FaPlay } from "react-icons/fa"; // New import for quiz icon
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom"; // Added useNavigate
import { getSets, deleteSet, updateSet } from "../api/apiSets";

const Sets = () => {
  const [sets, setSets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSet, setSelectedSet] = useState(null);
  const [newSetName, setNewSetName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Added for navigation

  useEffect(() => {
    const fetchSets = async () => {
      try {
        setIsLoading(true);
        const data = await getSets();
        if (data && Array.isArray(data)) {
          setSets(data);
        }
      } catch (error) {
        console.error("Error fetching sets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSets();
  }, []);

  const handleDeleteSet = async (setid) => {
    try {
      await deleteSet(setid);
      setSets((prevSets) => prevSets.filter((set) => set.setid !== setid));
    } catch (error) {
      console.error("Error deleting set:", error);
    }
  };

  const handleEditSet = (set) => {
    setSelectedSet(set);
    setNewSetName(set.setname);
    setShowModal(true);
  };

  const handleUpdateSet = async () => {
    try {
      await updateSet(selectedSet.setid, newSetName);
      setSets((prevSets) =>
        prevSets.map((set) =>
          set.setid === selectedSet.setid
            ? { ...set, setname: newSetName }
            : set
        )
      );
      setShowModal(false);
    } catch (error) {
      console.error("Error updating set:", error);
    }
  };

  // New function to handle quiz start
  const handleStartQuiz = (setid) => {
    navigate(`/quiz/${setid}`);
  };

  const filteredSets = sets.filter((set) =>
    set.setname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col items-center justify-between mb-8 md:flex-row">
          <h1 className="mb-4 text-3xl font-bold text-gray-800 md:mb-0">
            Flashcard Sets
          </h1>

          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiSearch className="w-5 h-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search sets..."
              className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Add New Set Card */}
        <div className="flex justify-center mb-8">
          <NavLink
            to="/create"
            className="flex flex-col items-center justify-center w-full max-w-xs p-6 transition-all bg-white border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-500 hover:shadow-md group"
          >
            <div className="flex items-center justify-center w-16 h-16 mb-3 text-white bg-blue-500 rounded-full group-hover:bg-blue-600">
              <MdAdd className="w-8 h-8" />
            </div>
            <span className="text-lg font-medium text-gray-700">
              Create New Set
            </span>
          </NavLink>
        </div>

        {/* Sets Grid */}
        {isLoading ? (
          <div className="flex justify-center">
            <div className="w-8 h-8 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
          </div>
        ) : filteredSets.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-lg shadow-sm">
            <h3 className="text-xl font-medium text-gray-700">
              {searchTerm ? "No matching sets found" : "No sets created yet"}
            </h3>
            <p className="mt-2 text-gray-500">
              {searchTerm
                ? "Try a different search term"
                : "Create your first flashcard set to get started"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredSets.map((set) => (
              <div
                key={set.setid}
                className="relative overflow-hidden transition-all bg-white shadow-sm rounded-xl hover:shadow-md group"
              >
                <NavLink to={`/sets/${set.setid}`} className="block">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800 truncate">
                        {set.setname}
                      </h3>
                      <span className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">
                        {set.card_count} cards
                      </span>
                    </div>
                  </div>
                </NavLink>

                {/* Action Buttons */}
                <div className="absolute flex space-x-2 transition-opacity opacity-0 top-3 right-3 group-hover:opacity-100">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleStartQuiz(set.setid);
                    }}
                    className="p-2 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 hover:text-green-600"
                    aria-label="Start quiz"
                    title="Start Quiz"
                  >
                    <FaPlay className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleEditSet(set);
                    }}
                    className="p-2 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 hover:text-blue-600"
                    aria-label="Edit set"
                  >
                    <MdModeEdit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      if (
                        window.confirm(
                          "Are you sure you want to delete this set?"
                        )
                      ) {
                        handleDeleteSet(set.setid);
                      }
                    }}
                    className="p-2 text-gray-600 bg-gray-100 rounded-full hover:bg-gray-200 hover:text-red-600"
                    aria-label="Delete set"
                  >
                    <AiFillDelete className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-md p-6 bg-white shadow-xl rounded-xl">
            <h2 className="mb-4 text-2xl font-semibold text-gray-800">
              Edit Set Name
            </h2>
            <input
              type="text"
              value={newSetName}
              onChange={(e) => setNewSetName(e.target.value)}
              className="w-full p-3 mb-6 text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter new set name"
              autoFocus
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateSet}
                disabled={!newSetName.trim()}
                className={`px-4 py-2 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                  newSetName.trim()
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-400 cursor-not-allowed"
                }`}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sets;
