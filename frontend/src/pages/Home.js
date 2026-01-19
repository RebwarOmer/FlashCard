import { MdCenterFocusStrong, MdSchool, MdLibraryBooks } from "react-icons/md";
import { RiTodoFill, RiLightbulbFlashLine } from "react-icons/ri";
import { SiConvertio } from "react-icons/si";
import { useState } from "react";
import IMagemath from "../img/Math.jpg";

const Home = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative w-full px-6 py-24 overflow-hidden text-white bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        </div>

        <div className="container relative flex flex-col items-center justify-between mx-auto md:flex-row">
          {/* Left Section */}
          <div className="flex flex-col items-start justify-start w-full mb-16 md:w-1/2 md:pr-12 md:mb-0">
            <h1 className="w-full mb-6 text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              Smarter Studying Starts Here
            </h1>
            <p className="w-full mb-8 text-lg text-blue-100 md:text-xl">
              Transform your learning with AI-powered flashcards. Create, study,
              and master any subject with our intuitive platform designed for
              academic success.
            </p>
            <div className="w-full mb-8 space-y-6">
              <div className="flex items-start">
                <div className="flex items-center justify-center p-3 mr-4 text-blue-600 bg-white rounded-lg shadow-md">
                  <MdSchool className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-white">Proven Methodology</p>
                  <p className="text-blue-100">
                    Spaced repetition algorithm enhances memory retention
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex items-center justify-center p-3 mr-4 text-blue-600 bg-white rounded-lg shadow-md">
                  <MdLibraryBooks className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-white">Comprehensive Library</p>
                  <p className="text-blue-100">
                    Access millions of user-generated flashcards across all
                    subjects
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex items-center justify-center p-3 mr-4 text-blue-600 bg-white rounded-lg shadow-md">
                  <RiLightbulbFlashLine className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-white">Smart Analytics</p>
                  <p className="text-blue-100">
                    Track your progress and identify areas needing improvement
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
              <button className="px-8 py-3 text-lg font-medium text-white transition-all rounded-lg shadow-lg bg-amber-500 hover:bg-amber-600 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-opacity-50">
                Get Started - It's Free
              </button>
              <button className="px-8 py-3 text-lg font-medium text-white transition-all bg-transparent border-2 border-white rounded-lg hover:bg-white hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
                See How It Works
              </button>
            </div>
          </div>

          {/* Right Section - Image */}
          <div className="flex items-center justify-center w-full md:w-1/2">
            <div className="relative w-full max-w-lg">
              <div className="absolute w-full h-full border-4 -top-6 -left-6 border-amber-400 rounded-xl"></div>
              <div className="relative overflow-hidden shadow-2xl rounded-xl">
                <img
                  className="object-cover w-full h-auto"
                  src={IMagemath}
                  alt="Student using FlashMind app"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent">
                  <p className="text-lg font-medium text-white">
                    "FlashMind helped me ace my finals!"
                  </p>
                  <p className="text-blue-200">- Sarah, Biology Student</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Card Section */}
      <section className="w-full px-6 py-24 bg-white">
        <div className="container flex flex-col mx-auto md:flex-row md:items-center md:justify-between">
          <div className="relative flex justify-center w-full mb-16 md:w-1/2 md:mb-0">
            <div className="w-full max-w-md perspective-1000">
              <div
                className={`relative w-full h-80 transition-transform duration-700 transform-style-preserve-3d cursor-pointer ${
                  isFlipped ? "rotate-y-180" : ""
                }`}
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <div className="absolute flex flex-col items-center justify-center w-full h-full p-8 text-gray-700 bg-white border border-gray-100 shadow-lg rounded-xl backface-hidden">
                  <div className="absolute font-medium text-blue-500 top-4 left-4">
                    Question
                  </div>
                  <p className="text-2xl font-medium text-center">
                    What is the capital of France?
                  </p>
                </div>
                <div className="absolute flex flex-col items-center justify-center w-full h-full p-8 text-white shadow-lg bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl backface-hidden rotate-y-180">
                  <div className="absolute font-medium text-blue-100 top-4 left-4">
                    Answer
                  </div>
                  <p className="text-2xl font-medium text-center">Paris</p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="px-6 py-2 text-sm font-medium text-blue-600 transition-colors bg-blue-100 rounded-lg hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                  {isFlipped ? "Show Question" : "Show Answer"}
                </button>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/2 md:pl-16">
            <div className="inline-block px-4 py-1 mb-4 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
              Interactive Learning
            </div>
            <h2 className="mb-6 text-3xl font-bold text-gray-800 md:text-4xl">
              Experience the Power of Active Recall
            </h2>
            <p className="mb-6 text-lg text-gray-600">
              Our flashcards utilize proven cognitive science techniques to
              enhance your learning efficiency. Engage with material actively
              rather than passively reading, leading to better retention and
              understanding.
            </p>
            <ul className="space-y-4 text-gray-600">
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 mt-1 mr-3 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>
                  Spaced repetition algorithm schedules reviews at optimal
                  intervals
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 mt-1 mr-3 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>
                  Rich text formatting and image support for comprehensive cards
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  className="w-5 h-5 mt-1 mr-3 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
                <span>
                  Detailed progress tracking and performance analytics
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full px-6 py-24 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-block px-4 py-1 mb-4 text-sm font-medium text-blue-600 bg-blue-100 rounded-full">
              Features
            </div>
            <h2 className="mb-6 text-3xl font-bold text-gray-800 md:text-4xl">
              Everything You Need to Study Smarter
            </h2>
            <p className="mb-12 text-lg text-gray-600">
              FlashMind combines powerful learning tools with an intuitive
              interface to help you achieve your academic goals.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-8 transition-all bg-white shadow-sm rounded-xl hover:shadow-md hover:-translate-y-1">
              <div className="flex items-center justify-center w-16 h-16 mb-6 text-blue-600 bg-blue-100 rounded-lg">
                <SiConvertio className="w-8 h-8" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-800">
                Smart Conversion
              </h3>
              <p className="text-gray-600">
                Automatically transform your notes and tasks into optimized
                flashcards with AI assistance.
              </p>
            </div>

            <div className="p-8 transition-all bg-white shadow-sm rounded-xl hover:shadow-md hover:-translate-y-1">
              <div className="flex items-center justify-center w-16 h-16 mb-6 text-blue-600 bg-blue-100 rounded-lg">
                <RiTodoFill className="w-8 h-8" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-800">
                Integrated Task Management
              </h3>
              <p className="text-gray-600">
                Seamlessly organize your study schedule with built-in task
                tracking and reminders.
              </p>
            </div>

            <div className="p-8 transition-all bg-white shadow-sm rounded-xl hover:shadow-md hover:-translate-y-1">
              <div className="flex items-center justify-center w-16 h-16 mb-6 text-blue-600 bg-blue-100 rounded-lg">
                <MdCenterFocusStrong className="w-8 h-8" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-800">
                Focus Mode
              </h3>
              <p className="text-gray-600">
                Eliminate distractions with timed study sessions and
                concentration analytics.
              </p>
            </div>

            <div className="p-8 transition-all bg-white shadow-sm rounded-xl hover:shadow-md hover:-translate-y-1">
              <div className="flex items-center justify-center w-16 h-16 mb-6 text-blue-600 bg-blue-100 rounded-lg">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  ></path>
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-800">
                Confidence-Based Learning
              </h3>
              <p className="text-gray-600">
                Rate your confidence on each card to customize your study path
                and focus on weak areas.
              </p>
            </div>

            <div className="p-8 transition-all bg-white shadow-sm rounded-xl hover:shadow-md hover:-translate-y-1">
              <div className="flex items-center justify-center w-16 h-16 mb-6 text-blue-600 bg-blue-100 rounded-lg">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-800">
                Collaborative Learning
              </h3>
              <p className="text-gray-600">
                Share decks with classmates, form study groups, and track
                collective progress.
              </p>
            </div>

            <div className="p-8 transition-all bg-white shadow-sm rounded-xl hover:shadow-md hover:-translate-y-1">
              <div className="flex items-center justify-center w-16 h-16 mb-6 text-blue-600 bg-blue-100 rounded-lg">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  ></path>
                </svg>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-800">
                Advanced Analytics
              </h3>
              <p className="text-gray-600">
                Visualize your learning patterns with detailed statistics and
                personalized insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full px-6 py-24 text-white bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="container mx-auto text-center">
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">
            Ready to Transform Your Learning?
          </h2>
          <p className="max-w-2xl mx-auto mb-8 text-xl text-blue-100">
            Join thousands of students who are studying smarter and achieving
            more with FlashMind.
          </p>
          <div className="flex flex-col justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <button className="px-8 py-4 text-lg font-medium text-blue-600 transition-all bg-white rounded-lg shadow-lg hover:bg-gray-100 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
              Create Free Account
            </button>
            <button className="px-8 py-4 text-lg font-medium text-white transition-all bg-transparent border-2 border-white rounded-lg hover:bg-white hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
              See Pricing Plans
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
