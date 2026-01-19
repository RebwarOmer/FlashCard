import API from "./axios"; // Import axios instance

// Create a new Task
export const createTask = async (userId, task) => {
  try {
    const requestBody = { task, userId };

    const response = await API.post("/createTodo", requestBody);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    return { error: "Failed to create task" };
  }
};

// Get all Todos for the user
export const getTodos = async () => {
  try {
    const response = await API.get("/getAllTodos");
    return response.data;
  } catch (error) {
    console.error("Error getting todos:", error);
    return { error: "Failed to fetch todos" };
  }
};

// Update a Todo
export const updateTodo = async (id, updates) => {
  try {
    const response = await API.put(`/updateTodo/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    return { error: "Failed to update task" };
  }
};

// Delete a Todo
export const deleteTodo = async (id) => {
  try {
    const response = await API.delete(`/deleteTodo/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting task:", error);
    return { error: "Failed to delete task" };
  }
};
