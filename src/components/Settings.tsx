import { useState } from "react";
import { useAuth } from "../context/auth/useAuthContext";
import { connectWithPartner } from "../utils/connectWithPartner";
import { disconnectFromPartner } from "../utils/disconnectWithPartner";
import { toast } from "react-toastify";

const Settings = () => {
  const { currentUser } = useAuth();
  const [partnerCode, setPartnerCode] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);

  const handleShareCode = () => {
    if (!currentUser) return;
    navigator.clipboard.writeText(currentUser.partnerCode || "")
      .then(() => toast.success("Partner code copied to clipboard!"))
      .catch(() => toast.error("Failed to copy code."));
  };

  const handleConnect = async () => {
    if (!partnerCode.trim()) {
      toast.error("Please enter a valid partner code.");
      return;
    }

    try {
      setIsConnecting(true);
      await connectWithPartner(currentUser?.uid || "", partnerCode);
      toast.success("Connected with partner successfully!");
      setPartnerCode(""); // Clear input after successful connection
    } catch (error) {
      toast.error("Failed to connect with partner. Please try again.");
      console.error("Error connecting with partner:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectFromPartner(currentUser?.uid || "");
      toast.success("Disconnected from partner.");
    } catch (error) {
      toast.error("Failed to disconnect from partner.");
      console.error("Error disconnecting from partner:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>

      {/* Partner Management Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Partner Management</h2>

        {/* Share Partner Code */}
        <div className="mb-4">
          <p className="text-gray-700">
            Share this code with your partner to connect your accounts:
          </p>
          <div className="flex flex-wrap items-center mt-4 max-w-full">
            
        {/* Input Field */}
        <div className="flex flex-wrap sm:flex-nowrap items-center mt-4 max-w-full">
            <input
                type="text"
                readOnly
                value={currentUser?.partnerCode || "Loading..."}
                className="w-full sm:flex-grow p-2 border border-gray-300 rounded-t-lg sm:rounded-l-lg sm:rounded-t-none focus:outline-none bg-gray-100"
            />
            <button
                onClick={handleShareCode}
                className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white font-medium rounded-b-lg sm:rounded-r-lg sm:rounded-b-none hover:bg-blue-700 focus:outline-none whitespace-nowrap"
            >
                Copy Code
            </button>
            </div>
        </div>

        </div>

        {/* Connect with Partner */}
        {!currentUser?.partnerUid && (
          <div className="mb-4 mt-8">
            <p className="text-gray-700">Enter your partner's code to connect:</p>
            <div className="flex items-center mt-2">
              <input
                type="text"
                value={partnerCode}
                onChange={(e) => setPartnerCode(e.target.value)}
                placeholder="Enter partner code"
                className="w-full p-2 border border-gray-300 rounded-l-lg focus:outline-none"
              />
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className={`px-4 py-2 ${
                  isConnecting ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                } text-white font-medium rounded-r-lg focus:outline-none`}
              >
                {isConnecting ? "Connecting..." : "Connect"}
              </button>
            </div>
          </div>
        )}

        {/* Disconnect from Partner */}
        {currentUser?.partnerUid && (
          <div className="mb-4 mt-8">
            <p className="text-gray-700">You are currently connected with a partner.</p>
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:outline-none mt-2"
            >
              Disconnect Partner
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
