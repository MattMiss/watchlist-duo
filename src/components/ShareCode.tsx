import { toast } from "react-toastify";

const ShareCode = ({ userCode }: { userCode: string }) => {
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(userCode);
    toast.success("Code copied to clipboard!");
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-2">Your Share Code</h2>
      <p className="text-gray-700 text-center">{userCode}</p>
      <button
        onClick={handleCopyToClipboard}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
      >
        Copy Code
      </button>
    </div>
  );
};

export default ShareCode;
