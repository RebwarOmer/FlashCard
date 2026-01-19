import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiUpload,
  FiSkipForward,
  FiCheck,
  FiChevronDown,
  FiPlus,
  FiX,
} from "react-icons/fi";

const ProfileSetup = () => {
  const [age, setAge] = useState("");
  const [purposeOfUse, setPurposeOfUse] = useState("");
  const [customPurpose, setCustomPurpose] = useState("");
  const [showCustomPurposeInput, setShowCustomPurposeInput] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  // Common purposes of use
  const purposeOptions = [
    "Language Learning",
    "Exam Preparation",
    "Professional Development",
    "Personal Knowledge",
    "Teaching Aid",
    "Other (Please Specify)",
  ];

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (profilePicturePreview) {
        URL.revokeObjectURL(profilePicturePreview);
      }
    };
  }, [profilePicturePreview]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (JPEG, PNG, etc.)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    setProfilePicture(file);
    const previewUrl = URL.createObjectURL(file);
    setProfilePicturePreview(previewUrl);
    setError("");
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handlePurposeSelection = (purpose) => {
    if (purpose === "Other (Please Specify)") {
      setShowCustomPurposeInput(true);
      setPurposeOfUse("");
      setCustomPurpose("");
      // Focus on the custom input after it appears
      setTimeout(() => {
        document.getElementById("customPurposeInput")?.focus();
      }, 0);
    } else {
      setPurposeOfUse(purpose);
      setShowCustomPurposeInput(false);
      setCustomPurpose("");
    }
    setIsDropdownOpen(false);
  };

  const handleAddCustomPurpose = () => {
    if (customPurpose.trim()) {
      setPurposeOfUse(customPurpose);
      setShowCustomPurposeInput(false);
    } else {
      setError("Please enter a purpose");
    }
  };

  const handleCancelCustomPurpose = () => {
    setShowCustomPurposeInput(false);
    setCustomPurpose("");
    setPurposeOfUse("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!age) {
      setError("Age is required");
      return;
    }

    if (!purposeOfUse) {
      setError("Please select or specify a purpose of use");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("age", age);
      formData.append("purposeOfUse", purposeOfUse);
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      const response = await fetch(
        "http://localhost:5000/flashcard/profile-setup",
        {
          method: "POST",
          credentials: "include",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update profile");
      }

      navigate("/sets");
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700">
      <div className="w-full max-w-md bg-white shadow-2xl rounded-xl">
        {/* Header */}
        <div className="px-6 py-8 text-center bg-blue-800">
          <h2 className="text-2xl font-bold text-white">
            Complete Your Profile
          </h2>
          <p className="mt-2 text-blue-100">
            Help us personalize your experience
          </p>
        </div>

        {/* Form */}
        <div className="p-6 sm:p-8">
          {error && (
            <div className="p-3 mb-6 text-sm text-red-600 rounded-md bg-red-50">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
            encType="multipart/form-data"
          >
            {/* Profile Picture Upload */}
            <div className="flex flex-col items-center">
              <label className="block mb-4 text-sm font-medium text-gray-700">
                Profile Picture
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="profilePicture"
                  name="profilePicture"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
                <div className="relative group">
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className={`flex items-center justify-center w-32 h-32 rounded-full border-2 border-dashed border-gray-300 overflow-hidden transition-all duration-300 ${
                      profilePicturePreview ? "border-solid" : ""
                    } hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    aria-label="Upload profile picture"
                  >
                    {profilePicturePreview ? (
                      <img
                        src={profilePicturePreview}
                        alt="Profile preview"
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex flex-col items-center p-4">
                        <FiUpload className="w-8 h-8 text-gray-400" />
                        <span className="mt-2 text-xs text-gray-500">
                          Upload Photo
                        </span>
                      </div>
                    )}
                  </button>
                  {profilePicturePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setProfilePicture(null);
                        setProfilePicturePreview(null);
                      }}
                      className="absolute p-1 text-white bg-red-500 rounded-full -top-2 -right-2 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      aria-label="Remove profile picture"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Age Input */}
            <div>
              <label
                htmlFor="age"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                className="w-full px-4 py-3 text-gray-700 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="13"
                max="120"
                required
              />
            </div>

            {/* Enhanced Purpose of Use Section */}
            <div className="relative" ref={dropdownRef}>
              <label
                htmlFor="purposeOfUse"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                Purpose of Use
              </label>

              {!showCustomPurposeInput ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center justify-between w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-expanded={isDropdownOpen}
                    aria-haspopup="listbox"
                    aria-labelledby="purposeOfUse-label"
                  >
                    <span className="truncate">
                      {purposeOfUse || "Select a purpose"}
                    </span>
                    <FiChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        isDropdownOpen ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isDropdownOpen && (
                    <div
                      className="absolute z-10 w-full mt-1 overflow-y-auto text-gray-600 bg-white border border-gray-300 rounded-md shadow-lg max-h-60"
                      role="listbox"
                      aria-labelledby="purposeOfUse-label"
                    >
                      {purposeOptions.map((option, index) => (
                        <button
                          key={index}
                          type="button"
                          className="w-full px-4 py-2 text-left hover:bg-blue-50 focus:outline-none focus:bg-blue-50"
                          role="option"
                          aria-selected={purposeOfUse === option}
                          onClick={() => handlePurposeSelection(option)}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      id="customPurposeInput"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your purpose"
                      value={customPurpose}
                      onChange={(e) => setCustomPurpose(e.target.value)}
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleAddCustomPurpose}
                      className="px-4 py-3 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      disabled={!customPurpose.trim()}
                      aria-label="Add custom purpose"
                    >
                      <FiPlus className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleCancelCustomPurpose}
                    className="text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <button
                type="button"
                onClick={() => navigate("/sets")}
                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-auto"
              >
                <FiSkipForward className="mr-2" />
                Skip for Now
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 sm:w-auto"
              >
                {isLoading ? (
                  <>
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
                    Saving...
                  </>
                ) : (
                  <>
                    <FiCheck className="mr-2" />
                    Complete Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
