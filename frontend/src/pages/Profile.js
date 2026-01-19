import { useEffect, useState } from "react";
import { useUser } from "../components/UserContext";
import { getStreak } from "../api/apiUser";
import { FiCalendar, FiTarget, FiMail, FiAward } from "react-icons/fi";

const Profile = () => {
  const { profilePicture, userData } = useUser();
  const [userInfo, setUserInfo] = useState(null);
  const [streak, setStreak] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUserInfo(userData);

    const fetchStreak = async () => {
      try {
        setIsLoading(true);
        const data = await getStreak();
        setStreak(data);
      } catch (error) {
        console.error("Error fetching streak:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStreak();
  }, [userData]);

  const getImageUrl = (profilePicture) => {
    if (!profilePicture) {
      return "http://localhost:5000/uploads/user.png";
    }
    if (profilePicture.startsWith("http")) {
      return profilePicture;
    }
    return `http://localhost:5000${profilePicture}?t=${Date.now()}`;
  };

  const imageUrl = getImageUrl(profilePicture);

  return (
    <div className="min-h-screen px-4 py-12 bg-gradient-to-br from-gray-50 to-gray-100 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="overflow-hidden bg-white shadow-lg rounded-xl">
          <div className="md:flex">
            {/* Profile Picture */}
            <div className="flex justify-center p-8 md:w-1/3 md:justify-end">
              <div className="relative">
                <img
                  className="object-cover w-48 h-48 border-4 border-white rounded-full shadow-lg"
                  src={imageUrl}
                  alt="Profile"
                />
                {streak?.streak_count > 0 && (
                  <div className="absolute flex items-center px-3 py-1 text-sm font-semibold text-white transform -translate-x-1/2 rounded-full shadow-md -bottom-4 left-1/2 bg-amber-500">
                    <FiAward className="mr-1" />
                    {streak.streak_count} day streak
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="p-8 md:w-2/3">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    {userInfo?.Name || "User"}
                  </h1>
                  <p className="mt-1 text-gray-600">
                    {userInfo?.PurposeOfUse || "Learning enthusiast"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mt-6 md:grid-cols-2">
                <div className="flex items-center p-4 rounded-lg bg-gray-50">
                  <div className="p-3 mr-4 text-blue-600 bg-blue-100 rounded-full">
                    <FiCalendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="font-medium text-gray-800">
                      {userInfo?.Age || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-4 rounded-lg bg-gray-50">
                  <div className="p-3 mr-4 text-purple-600 bg-purple-100 rounded-full">
                    <FiTarget className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Purpose</p>
                    <p className="font-medium text-gray-800">
                      {userInfo?.PurposeOfUse || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center p-4 rounded-lg bg-gray-50 md:col-span-2">
                  <div className="p-3 mr-4 text-green-600 bg-green-100 rounded-full">
                    <FiMail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-800">
                      {userInfo?.Email || "email@example.com"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-1">
          {/* Streak Card */}
          <div className="p-6 bg-white shadow-lg rounded-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Study Streak
              </h3>
              <div className="p-2 rounded-full bg-amber-100 text-amber-600">
                <FiAward className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-24">
                  <div className="animate-pulse">Loading streak...</div>
                </div>
              ) : (
                <>
                  <div className="flex items-center text-4xl font-bold text-gray-800">
                    {streak?.streak_count || 0}
                    <span className="ml-2 text-2xl text-amber-500">🔥</span>
                  </div>
                  <p className="mt-2 text-gray-500">
                    {streak?.streak_date
                      ? `Last active: ${new Date(
                          streak.streak_date
                        ).toLocaleDateString()}`
                      : "No recent activity"}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
