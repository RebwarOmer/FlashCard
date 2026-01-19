import { useState, useEffect } from "react";
import { useUser } from "../components/UserContext";
import { createTask, getTodos, updateTodo, deleteTodo } from "../api/apiTodo";
import { formatDistanceToNow } from "date-fns";
import {
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiCheck,
  FiCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { BsCheck2All } from "react-icons/bs";

const Todo = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [editId, setEditId] = useState(null);
  const [editInput, setEditInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { userData } = useUser();

  useEffect(() => {
    const fetchTodos = async () => {
      setIsLoading(true);
      try {
        const todos = await getTodos();
        if (todos) setTasks(todos);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTodos();
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    try {
      const newTask = await createTask(userData.UserID, input.trim());
      setTasks((prev) => [...prev, newTask]);
      setInput("");
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeTask = async (id) => {
    try {
      await deleteTodo(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const editTask = (id) => {
    setEditId(id);
    const taskToEdit = tasks.find((task) => task.id === id);
    setEditInput(taskToEdit.task);
  };

  const saveEditedTask = async (id) => {
    if (!editInput.trim()) return;

    try {
      await updateTodo(id, { task: editInput.trim() });
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, task: editInput.trim() } : task
        )
      );
      setEditId(null);
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const toggleComplete = async (taskId, currentStatus) => {
    try {
      const newStatus = !currentStatus;
      await updateTodo(taskId, { completed: newStatus });
      setTasks((prev) =>
        prev.map((task) =>
          task.id === taskId ? { ...task, completed: newStatus } : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const incompleteTasks = tasks.filter((task) => !task.completed);
  const completeTasks = tasks.filter((task) => task.completed);

  return (
    <div className="flex items-start justify-center min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
      <div className="w-full max-w-md overflow-hidden bg-white shadow-lg rounded-xl">
        {/* Header */}
        <div className="p-6 text-white bg-gradient-to-r from-blue-600 to-blue-800">
          <h1 className="text-2xl font-bold">Task Manager</h1>
          <p className="mt-1 text-blue-100">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"} total •{" "}
            {incompleteTasks.length} pending
          </p>
        </div>

        {/* Add Task Form */}
        <form onSubmit={addTask} className="p-6 border-b border-gray-200">
          <div className="flex rounded-md shadow-sm">
            <input
              type="text"
              className="flex-1 block w-full min-w-0 px-4 py-3 border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Add a new task..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-r-md text-white ${
                isLoading || !input.trim()
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              }`}
            >
              {isLoading ? "Adding..." : <FiPlus className="w-5 h-5" />}
            </button>
          </div>
        </form>

        {/* Tasks List */}
        <div className="divide-y divide-gray-200">
          {/* Incomplete Tasks */}
          {incompleteTasks.length > 0 && (
            <div className="p-6">
              <h2 className="flex items-center mb-3 text-lg font-medium text-gray-900">
                <span className="w-2 h-2 mr-2 bg-blue-600 rounded-full"></span>
                Pending Tasks
                <span className="px-2 py-1 ml-auto text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                  {incompleteTasks.length}
                </span>
              </h2>
              <ul className="space-y-3">
                {incompleteTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    editId={editId}
                    editInput={editInput}
                    setEditInput={setEditInput}
                    saveEditedTask={saveEditedTask}
                    toggleComplete={toggleComplete}
                    removeTask={removeTask}
                    editTask={editTask}
                    setEditId={setEditId}
                  />
                ))}
              </ul>
            </div>
          )}

          {/* Completed Tasks */}
          {completeTasks.length > 0 && (
            <div className="p-6 bg-gray-50">
              <h2 className="flex items-center mb-3 text-lg font-medium text-gray-900">
                <BsCheck2All className="mr-2 text-green-500" />
                Completed Tasks
                <span className="px-2 py-1 ml-auto text-xs font-medium text-green-800 bg-green-100 rounded-full">
                  {completeTasks.length}
                </span>
              </h2>
              <ul className="space-y-3">
                {completeTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    editId={editId}
                    editInput={editInput}
                    setEditInput={setEditInput}
                    saveEditedTask={saveEditedTask}
                    toggleComplete={toggleComplete}
                    removeTask={removeTask}
                    editTask={editTask}
                    setEditId={setEditId}
                  />
                ))}
              </ul>
            </div>
          )}

          {/* Empty State */}
          {tasks.length === 0 && !isLoading && (
            <div className="p-12 text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-blue-100 rounded-full">
                <FiPlus className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No tasks yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by adding a new task above.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TaskItem = ({
  task,
  editId,
  editInput,
  setEditInput,
  saveEditedTask,
  toggleComplete,
  removeTask,
  editTask,
  setEditId,
}) => {
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true })
      .replace("about ", "")
      .replace("less than a minute", "just now")
      .replace("minute", "min");
  };

  return (
    <li className="group">
      {editId === task.id ? (
        <div className="flex items-center gap-2 p-3 rounded-md bg-blue-50">
          <input
            type="text"
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={editInput}
            onChange={(e) => setEditInput(e.target.value)}
            autoFocus
          />
          <div className="flex gap-1">
            <button
              onClick={() => saveEditedTask(task.id)}
              className="p-2 text-white bg-green-600 rounded-md hover:bg-green-700"
              aria-label="Save changes"
            >
              <FiCheck className="w-4 h-4" />
            </button>
            <button
              onClick={() => setEditId(null)}
              className="p-2 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200"
              aria-label="Cancel edit"
            >
              ×
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start justify-between">
          <div className="flex items-start flex-1 min-w-0">
            <button
              onClick={() => toggleComplete(task.id, task.completed)}
              className="mt-1 mr-3 text-gray-300 hover:text-blue-600"
              aria-label={
                task.completed ? "Mark as incomplete" : "Mark as complete"
              }
            >
              {task.completed ? (
                <FiCheckCircle className="w-5 h-5 text-green-500" />
              ) : (
                <FiCircle className="w-5 h-5" />
              )}
            </button>
            <div className="flex-1 min-w-0">
              <p
                className={`text-base truncate ${
                  task.completed
                    ? "text-gray-500 line-through"
                    : "text-gray-800"
                }`}
                title={task.task}
              >
                {task.task}
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                {task.createdat && (
                  <span className="text-xs text-gray-400">
                    Created: {formatTime(task.createdat)}
                  </span>
                )}
                {task.updatedat && task.updatedat !== task.createdat && (
                  <span className="text-xs text-gray-400">
                    Updated: {formatTime(task.updatedat)}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100">
            {!task.completed && (
              <button
                onClick={() => editTask(task.id)}
                className="p-1 text-gray-400 rounded-md hover:text-blue-600 hover:bg-blue-50"
                aria-label="Edit task"
              >
                <FiEdit2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => removeTask(task.id)}
              className="p-1 text-gray-400 rounded-md hover:text-red-600 hover:bg-red-50"
              aria-label="Delete task"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </li>
  );
};

export default Todo;
