import { useState } from "react";
import { RiDeleteBinLine } from "react-icons/ri";
import { FiPlus } from "react-icons/fi";
import { BsCheck2All } from "react-icons/bs";

const TodoGuest = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // For potential future API calls

  const addTask = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    // Simulate async operation
    setTimeout(() => {
      const newTask = {
        id: Date.now(),
        task: input.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setInput("");
      setIsLoading(false);
    }, 300);
  };

  const removeTask = (id) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
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
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"} total
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
              {isLoading ? (
                "Adding..."
              ) : (
                <>
                  <FiPlus className="mr-1" />
                  Add
                </>
              )}
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
                <span className="px-2 py-1 ml-auto text-sm text-gray-500 bg-gray-100 rounded-full">
                  {incompleteTasks.length}
                </span>
              </h2>
              <ul className="space-y-3">
                {incompleteTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    removeTask={removeTask}
                    toggleComplete={toggleComplete}
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
                <span className="px-2 py-1 ml-auto text-sm text-gray-500 bg-gray-100 rounded-full">
                  {completeTasks.length}
                </span>
              </h2>
              <ul className="space-y-3">
                {completeTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    removeTask={removeTask}
                    toggleComplete={toggleComplete}
                  />
                ))}
              </ul>
            </div>
          )}

          {/* Empty State */}
          {tasks.length === 0 && (
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

const TaskItem = ({ task, removeTask, toggleComplete }) => {
  return (
    <li className="flex items-start justify-between group">
      <div className="flex items-start">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleComplete(task.id)}
          className={`mt-1 h-5 w-5 rounded border-gray-300 ${
            task.completed
              ? "text-green-600 focus:ring-green-500"
              : "text-blue-600 focus:ring-blue-500"
          } cursor-pointer transition-colors`}
        />
        <div className="ml-3">
          <p
            className={`text-base ${
              task.completed ? "text-gray-500 line-through" : "text-gray-800"
            }`}
          >
            {task.task}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Added: {new Date(task.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <button
        onClick={() => removeTask(task.id)}
        className="text-gray-400 transition-opacity opacity-0 group-hover:opacity-100 hover:text-red-500"
        aria-label="Delete task"
      >
        <RiDeleteBinLine className="w-5 h-5" />
      </button>
    </li>
  );
};

export default TodoGuest;
