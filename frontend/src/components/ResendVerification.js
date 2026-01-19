import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { resendVerificationEmail } from "../api/apiUser";
import { FiCheckCircle, FiArrowLeft } from "react-icons/fi";

const ResendVerification = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Pre-fill email if coming from login page
  useState(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await resendVerificationEmail(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Failed to resend verification email");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
        <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
          <FiCheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
          <h2 className="mb-4 text-2xl font-bold text-center">
            Verification Email Sent
          </h2>
          <p className="mb-6 text-center">
            We've sent a new verification link to <strong>{email}</strong>.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center mb-4 text-blue-600"
        >
          <FiArrowLeft className="mr-1" /> Back
        </button>

        <h2 className="mb-6 text-2xl font-bold text-center">
          Resend Verification Email
        </h2>

        {error && <div className="mb-4 text-center text-red-500">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-gray-700">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Resend Verification Email"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResendVerification;
