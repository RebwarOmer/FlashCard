import API from "./axios";

export const editUserInfo = async (formData) => {
  try {
    const { data } = await API.put("/edit-user-info", formData);
    return data;
  } catch (error) {
    throw new Error("Failed to edit user info");
  }
};

export const logoutUser = async () => {
  try {
    const response = await API.post("/logout");

    if (response.data.message === "Logged out successfully") {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Logout failed:", error.response?.data || error.message);
    return false;
  }
};

export const deleteUserAccount = async () => {
  try {
    await API.delete("/delete-account");
    return true;
  } catch {
    return false;
  }
};

// Streak-related functions
export const getStreak = async () => {
  try {
    const { data } = await API.get("/streak/current");

    return data; // Returns streak data { streak_count, streak_date }
  } catch (error) {
    throw new Error("Failed to fetch streak data");
  }
};

export const updateStreak = async () => {
  try {
    const { data } = await API.post("/streak/update"); // Post request to update streak
    return data; // Returns updated streak data
  } catch (error) {
    throw new Error("Failed to update streak data");
  }
};

export const register = async (name, email, password) => {
  try {
    const response = await API.post("/register", {
      Name: name,
      Email: email,
      Password: password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Registration failed");
  }
};

export const login = async (email, password) => {
  try {
    const response = await API.post("/login", {
      Email: email,
      Password: password,
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.needsVerification) {
      throw new Error("EMAIL_NOT_VERIFIED");
    }
    throw new Error(error.response?.data?.error || "Login failed");
  }
};

export const checkLoginStatus = async () => {
  try {
    const { data } = await API.get("/check-login");
    return data;
  } catch (error) {
    console.error(
      "checkLoginStatus error:",
      error.response?.data || error.message
    );
    return null;
  }
};

export const verifyEmail = async (token) => {
  try {
    const response = await API.get(`/verify-email?token=${token}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Email verification failed");
  }
};

export const resendVerificationEmail = async (email) => {
  try {
    const response = await API.post("/resend-verification", { email });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to resend verification email."
    );
  }
};
