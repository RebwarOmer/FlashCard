import React, { useState, useEffect, useRef } from "react";
import { useUser } from "../components/UserContext";
import { editUserInfo, deleteUserAccount } from "../api/apiUser";
import {
  FiEdit2,
  FiSave,
  FiX,
  FiUser,
  FiCalendar,
  FiTarget,
} from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";

const Settings = () => {
  const { userData, setUserData, profilePicture, setProfilePicture } =
    useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdatingPicture, setIsUpdatingPicture] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    purpose: "",
    profilePicture: null,
  });
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const getImageUrl = (profilePicture) => {
    if (!profilePicture) return "http://localhost:5000/uploads/user.png";
    if (profilePicture.startsWith("http")) return profilePicture;
    return `http://localhost:5000${profilePicture}?t=${Date.now()}`;
  };

  useEffect(() => {
    if (userData) {
      const fullProfilePictureUrl = getImageUrl(profilePicture);
      setFormData({
        name: userData.Name,
        age: userData.Age,
        purpose: userData.PurposeOfUse,
        profilePicture: fullProfilePictureUrl,
      });
      setProfilePicturePreview(fullProfilePictureUrl);
    }
  }, [userData, profilePicture]);

  const handleSave = async () => {
    setIsLoading(true);
    const formDataObj = new FormData();
    formDataObj.append("name", formData.name);
    formDataObj.append("age", formData.age);
    formDataObj.append("purposeOfUse", formData.purpose);

    // Only append profile picture if it's a new file
    if (formData.profilePicture instanceof File) {
      formDataObj.append("profilePicture", formData.profilePicture);
    }

    try {
      const updatedData = await editUserInfo(formDataObj);
      setUserData(updatedData);
      setProfilePicture(updatedData.profilePictureUrl);
      setProfilePicturePreview(getImageUrl(updatedData.profilePictureUrl));
      setIsEditing(false);
      setIsUpdatingPicture(false);
    } catch (error) {
      console.error("Error saving user info:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePicture: file });
      setProfilePicturePreview(URL.createObjectURL(file));
    }
  };

  const triggerFileInput = () => {
    if (isUpdatingPicture) {
      fileInputRef.current.click();
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteUserAccount();
      window.location = "/home";
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  return (
    <div className="min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="mt-2 text-gray-600">
            Manage your personal information and account preferences
          </p>
        </div>

        {/* Settings Card */}
        <div className="overflow-hidden bg-white shadow-xl rounded-xl">
          {/* Profile Picture Section */}
          <div className="px-6 py-8 border-b border-gray-200">
            <div className="flex flex-col items-center sm:flex-row sm:items-start">
              <div className="relative mb-4 sm:mb-0 sm:mr-6">
                <div
                  className={`w-24 h-24 rounded-full overflow-hidden border-4 ${
                    isUpdatingPicture ? "border-blue-500" : "border-white"
                  } shadow-md cursor-pointer`}
                  onClick={triggerFileInput}
                >
                  <img
                    src={profilePicturePreview}
                    alt="Profile"
                    className="object-cover w-full h-full"
                  />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {isUpdatingPicture && (
                  <div className="absolute bottom-0 right-0 p-2 text-white bg-blue-600 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-xl font-semibold text-gray-800">
                  {formData.name || "Your Name"}
                </h2>
                <p className="text-gray-600">{formData.purpose || "Purpose"}</p>
                <div className="flex mt-3 space-x-2">
                  {!isEditing ? (
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setIsUpdatingPicture(false);
                      }}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 rounded-md bg-blue-50 hover:bg-blue-100"
                    >
                      <FiEdit2 className="mr-2" />
                      Update Profile
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setIsUpdatingPicture(false);
                          // Reset form data if cancelled
                          const fullProfilePictureUrl =
                            getImageUrl(profilePicture);
                          setFormData({
                            name: userData.Name,
                            age: userData.Age,
                            purpose: userData.PurposeOfUse,
                            profilePicture: fullProfilePictureUrl,
                          });
                          setProfilePicturePreview(fullProfilePictureUrl);
                        }}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                      >
                        <FiX className="mr-2" />
                        Cancel
                      </button>
                      <button
                        onClick={() => setIsUpdatingPicture(!isUpdatingPicture)}
                        className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                          isUpdatingPicture
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                        }`}
                      >
                        {isUpdatingPicture
                          ? "Click profile to upload"
                          : "Update Picture"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="px-6 py-6">
            <div className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="flex items-center block mb-1 text-sm font-medium text-gray-700">
                  <FiUser className="mr-2 text-gray-500" />
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="px-3 py-2 text-gray-900">{formData.name}</p>
                )}
              </div>

              {/* Age Field */}
              <div>
                <label className="flex items-center block mb-1 text-sm font-medium text-gray-700">
                  <FiCalendar className="mr-2 text-gray-500" />
                  Age
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="px-3 py-2 text-gray-900">{formData.age}</p>
                )}
              </div>

              {/* Purpose Field */}
              <div>
                <label className="flex items-center block mb-1 text-sm font-medium text-gray-700">
                  <FiTarget className="mr-2 text-gray-500" />
                  Purpose of Use
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="px-3 py-2 text-gray-900">{formData.purpose}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex flex-col justify-between mt-8 space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className={`flex-1 inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    "Saving..."
                  ) : (
                    <>
                      <FiSave className="mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-8 overflow-hidden bg-white shadow-xl rounded-xl">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-red-600">Danger Zone</h2>
          </div>
          <div className="px-6 py-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-600 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <RiDeleteBin6Line className="mr-2" />
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-red-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
                    <RiDeleteBin6Line className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Delete account
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete your account? All of
                        your data will be permanently removed. This action
                        cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
