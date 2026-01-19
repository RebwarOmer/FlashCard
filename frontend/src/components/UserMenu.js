import { useState, useRef, useEffect } from "react";
import { useUser } from "./UserContext";
import { logoutUser } from "../api/apiUser";
import { FiUser, FiSettings, FiSun, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const UserMenu = () => {
  const {
    setIsLoggedIn,
    setUserData,
    setProfilePicture,
    profilePicture,
    userData,
  } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      setIsLoggedIn(false);
      setUserData(null);
      setProfilePicture(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        aria-label="User menu"
        aria-expanded={isMenuOpen}
      >
        <img
          src={imageUrl}
          alt={`${userData?.Name || "User"} profile`}
          className="object-cover w-8 h-8 transition-colors border-2 border-gray-200 rounded-full hover:border-blue-500"
          onError={(e) => {
            e.target.src = "http://localhost:5000/uploads/user.png";
          }}
        />
      </button>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 z-20 w-56 mt-2 origin-top-right bg-white rounded-md shadow-lg max-sm:-right-24 ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
        >
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-medium text-gray-900 truncate">
              {userData?.Name}
            </p>
            <p className="text-sm text-gray-500 truncate">{userData?.Email}</p>
          </div>

          <div className="py-1" role="none">
            <a
              href="/profile"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              <FiUser className="mr-3" />
              Profile
            </a>
            <a
              href="/settings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              <FiSettings className="mr-3" />
              Settings
            </a>
            <button
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              <FiSun className="mr-3" />
              Light Mode
            </button>
          </div>

          <div className="py-1 border-t border-gray-100" role="none">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              <FiLogOut className="mr-3" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
