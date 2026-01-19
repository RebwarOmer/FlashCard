import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyEmail } from "../api/apiUser";
import { FiCheckCircle, FiXCircle, FiArrowRight } from "react-icons/fi";

const VerifyEmail = () => {
  const [status, setStatus] = useState("verifying");
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await verifyEmail(token);
        setStatus("verified");
        window.location = "/ProfileSetup";
      } catch (err) {
        setStatus("failed");
        setError(err.message || "Verification failed. Please try again.");
      }
    };

    if (token) {
      verifyToken();
    } else {
      setStatus("failed");
      setError("Missing verification token");
    }
  }, [token]);

  if (status === "verifying") {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-center">
            Verifying Your Email
          </h2>
          <p className="text-center">
            Please wait while we verify your email address...
          </p>
        </div>
      </div>
    );
  }

  if (status === "verified") {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <FiCheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
          <h2 className="mb-4 text-2xl font-bold text-center">
            Email Verified Successfully!
          </h2>
          <p className="mb-6 text-center">
            Your account has been activated. You can now sign in.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="flex items-center justify-center w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            <FiArrowRight className="mr-2" />
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <FiXCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
        <h2 className="mb-4 text-2xl font-bold text-center">
          Verification Failed
        </h2>
        <p className="mb-4 text-center text-red-500">{error}</p>
        <button
          onClick={() => navigate("/resend-verification")}
          className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Resend Verification Email
        </button>
      </div>
    </div>
  );
};

export default VerifyEmail;
