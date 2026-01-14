import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function TrainerRegistration() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      
      // Register user with role "trainer"
      await signUp({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: "trainer",
      });

      // Signal will automatically create TrainerProfile
      // Redirect to complete profile
      alert("Registration successful! Please complete your trainer profile.");
      navigate("/login?mode=signin");
      
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 flex justify-center items-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-center mb-6">
          Register as a Trainer
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Create your account to start training clients
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block font-semibold mb-1">Username *</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Choose a username"
              required
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-semibold mb-1">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Enter your email"
              required
              disabled={loading}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block font-semibold mb-1">Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Create a password (min 6 characters)"
              required
              disabled={loading}
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block font-semibold mb-1">Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Confirm your password"
              required
              disabled={loading}
            />
          </div>

          {/* Info Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-800">
              📝 After registration, you'll be able to complete your profile with additional details like experience, rates, certifications, and more.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md font-semibold text-lg transition-colors ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 text-white hover:bg-red-700"
            }`}
          >
            {loading ? "Creating Account..." : "Create Trainer Account"}
          </button>

          {/* Login Link */}
          <p className="text-center text-gray-600 text-sm mt-4">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login?mode=signin")}
              className="text-red-600 hover:underline font-semibold"
            >
              Sign In
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
