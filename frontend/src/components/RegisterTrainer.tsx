"use client";
import { useState } from "react";

export default function TrainerRegistration() {
  const [resume, setResume] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 flex justify-center items-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl">

        <h2 className="text-3xl font-bold text-center mb-6">
          Become a Trainer
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Submit your application and our team will reach out soon.
        </p>

        <form className="space-y-5">

          {/* Resume Upload */}
          <div>
            <label className="block font-semibold mb-1">Resume (PDF/DOC)</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              // onChange={(e) => setResume(e.target.files[                                                             0])}
              className="w-full border border-gray-300 p-3 rounded-md bg-gray-50"
            />
          </div>

          {/* Full Name */}
          <div>
            <label className="block font-semibold mb-1">Full Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 p-3 rounded-md"
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block font-semibold mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 p-3 rounded-md"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block font-semibold mb-1">Phone</label>
            <input
              type="text"
              className="w-full border border-gray-300 p-3 rounded-md"
              placeholder="Enter your phone number"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block font-semibold mb-1">Location</label>
            <input
              type="text"
              className="w-full border border-gray-300 p-3 rounded-md"
              placeholder="Your city or area"
              required
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block font-semibold mb-1">
              LinkedIn URL (Optional)
            </label>
            <input
              type="url"
              className="w-full border border-gray-300 p-3 rounded-md"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>

          {/* Instagram */}
          <div>
            <label className="block font-semibold mb-1">
              Instagram URL (Optional)
            </label>
            <input
              type="url"
              className="w-full border border-gray-300 p-3 rounded-md"
              placeholder="https://instagram.com/username"
            />
          </div>

          {/* Twitter */}
          <div>
            <label className="block font-semibold mb-1">
              Twitter URL (Optional)
            </label>
            <input
              type="url"
              className="w-full border border-gray-300 p-3 rounded-md"
              placeholder="https://twitter.com/username"
            />
          </div>

          {/* Personal Website */}
          <div>
            <label className="block font-semibold mb-1">
              Personal Website (Optional)
            </label>
            <input
              type="url"
              className="w-full border border-gray-300 p-3 rounded-md"
              placeholder="https://yourwebsite.com"
            />
          </div>

          {/* Additional Info */}
          <div>
            <label className="block font-semibold mb-1">
              Additional Information
            </label>
            <textarea
              rows={4}
              className="w-full border border-gray-300 p-3 rounded-md"
              placeholder="Tell us about your experience, certifications, or specialties..."
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-md font-semibold text-lg hover:bg-red-700"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
}
