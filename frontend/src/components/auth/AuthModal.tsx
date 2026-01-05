import React from "react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  provider: "google" | "facebook" | null;
}

const providerUrls = {
  google: "https://accounts.google.com/o/oauth2/v2/auth",
  facebook: "https://www.facebook.com/v10.0/dialog/oauth",
};

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, provider }) => {
  if (!isOpen || !provider) return null;

  const clientId = {
    google: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    facebook: import.meta.env.VITE_FACEBOOK_CLIENT_ID,
  };

  const redirectUri = import.meta.env.VITE_OAUTH_REDIRECT_URL;

  const loginUrl =
    provider === "google"
      ? `${providerUrls.google}?client_id=${clientId.google}&redirect_uri=${redirectUri}&response_type=token&scope=email profile`
      : `${providerUrls.facebook}?client_id=${clientId.facebook}&redirect_uri=${redirectUri}&response_type=token&scope=email`;

  const handleContinue = () => {
    // window.location.href = loginUrl; // Redirect to provider
      window.open(loginUrl, "_blank", "noopener,noreferrer");

  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl w-96 text-center">
        <h2 className="text-xl font-semibold mb-4">
          Continue with {provider === "google" ? "Google" : "Facebook"}
        </h2>

        <p className="text-gray-600 text-sm mb-6">
          You will be redirected to {provider} authorization page.
        </p>

        <button
          onClick={handleContinue}
          className="bg-blue-600 text-white w-full py-2 rounded-md mb-3"
        >
          Continue
        </button>

        <button
          className="border w-full py-2 rounded-md"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AuthModal;
