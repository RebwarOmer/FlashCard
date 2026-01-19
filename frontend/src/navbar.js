import { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { RiFlashlightFill } from "react-icons/ri";
import UserMenu from "./components/UserMenu";
import { useUser } from "../src/components/UserContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [, setMobileDropdownOpen] = useState(null);
  const { isLoggedIn } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
    setMobileDropdownOpen(null);
  };

  const navLinks = [
    {
      to: "/home",
      label: "Home",
      icon: <RiFlashlightFill className="w-5 h-5" />,
    },
    {
      to: "/sets",
      label: "Flashcards",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          ></path>
        </svg>
      ),
    },
    {
      to: isLoggedIn ? "/todo" : "/todo-guest",
      label: "Study Planner",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
          ></path>
        </svg>
      ),
    },
    ...(isLoggedIn
      ? [
          {
            to: "/quiz-select",
            label: "Quiz Mode",
            icon: (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
            ),
          },
        ]
      : []),
  ];

  const renderDesktopLinks = () => (
    <ul className="hidden lg:flex lg:items-center lg:space-x-1">
      {navLinks.map(({ to, label, icon }) => (
        <li key={to}>
          <NavLink
            to={to}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? "text-white bg-blue-600"
                  : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              }`
            }
          >
            <span className="mr-2">{icon}</span>
            {label}
          </NavLink>
        </li>
      ))}
    </ul>
  );

  const renderMobileLinks = () => (
    <ul className="px-2 pt-2 pb-4 space-y-1">
      {navLinks.map(({ to, label, icon }) => (
        <li key={to}>
          <NavLink
            to={to}
            onClick={() => {
              setIsOpen(false);
              setMobileDropdownOpen(null);
            }}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-base font-medium rounded-md ${
                isActive
                  ? "text-white bg-blue-600"
                  : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
              }`
            }
          >
            <span className="mr-3">{icon}</span>
            {label}
          </NavLink>
        </li>
      ))}
    </ul>
  );

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-sm"
      }`}
    >
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <button
              onClick={() => handleNavigation("/home")}
              className="flex items-center focus:outline-none"
            >
              <RiFlashlightFill className="w-6 h-6 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">
                Flash<span className="text-blue-600">Mind</span>
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:space-x-4">
            {renderDesktopLinks()}

            <div className="flex items-center ml-4 space-x-2">
              {!isLoggedIn ? (
                <>
                  <button
                    onClick={() => handleNavigation("/login")}
                    className="px-4 py-2 text-sm font-medium text-blue-600 transition-colors bg-transparent border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Log in
                  </button>
                  <button
                    onClick={() => handleNavigation("/register")}
                    className="px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Sign up free
                  </button>
                </>
              ) : (
                <UserMenu />
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <FiX className="block w-6 h-6" />
              ) : (
                <FiMenu className="block w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className={`lg:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="pt-2 pb-3 space-y-1">
          {renderMobileLinks()}

          <div className="px-5 pt-4 pb-2 border-t border-gray-200">
            {!isLoggedIn ? (
              <div className="space-y-3">
                <button
                  onClick={() => handleNavigation("/login")}
                  className="flex justify-center w-full px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md shadow-sm hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Log in
                </button>
                <button
                  onClick={() => handleNavigation("/register")}
                  className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Sign up free
                </button>
              </div>
            ) : (
              <div className="flex justify-center">
                <UserMenu mobile />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
