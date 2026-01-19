import API from "./axios"; // Import axios instance

export const createSet = async (setName, userId) => {
  try {
    const requestBody = { setName, userId };

    const response = await API.post("/createSet", requestBody);
    return response.data;
  } catch (error) {
    console.error("Error creating set:", error);
    return { error: "Failed to create set" };
  }
};

// Get all Sets for the user
export const getSets = async () => {
  try {
    const response = await API.get("/getAllSets");

    return response.data;
  } catch (error) {
    console.error("Error getting sets:", error);
    return { error: "Failed to fetch sets" };
  }
};

// Update a Set
export const updateSet = async (id, setName) => {
  try {
    const response = await API.put(`/updateSet/${id}`, { setName });
    return response.data;
  } catch (error) {
    console.error("Error updating set:", error);
    return { error: "Failed to update set" };
  }
};

// Delete a Set
export const deleteSet = async (setid) => {
  try {
    const response = await API.delete(`/deleteSet/${setid}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting set:", error);
    return { error: "Failed to delete set" };
  }
};
