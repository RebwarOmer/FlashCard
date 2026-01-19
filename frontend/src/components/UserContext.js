import React, { createContext, useState, useContext, useEffect } from "react";
import { checkLoginStatus } from "../api/apiUser"; // Import API function

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userInfo = await checkLoginStatus();

        if (userInfo && userInfo.isLoggedIn) {
          setIsLoggedIn(true);
          setUserData(userInfo);

          setProfilePicture(userInfo.profilePictureUrl);
        } else {
          setIsLoggedIn(false);
          setUserData(null);
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        setIsLoggedIn(false);
        setUserData(null);
        setProfilePicture("http://localhost:5000/uploads/user.png"); // Default image
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
        profilePicture,
        setProfilePicture,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
