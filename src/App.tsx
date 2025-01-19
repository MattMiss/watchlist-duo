import { useState, useEffect, useRef } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { signOut } from "firebase/auth";
import { auth } from "./firebase"; 
import Login from "./components/Login";
import Search from "./components/Search";
import MediaLists from "./components/MediaLists";
import Discover from "./components/Discover";
import { FaBars } from "react-icons/fa";
import "./tailwind.css";
import { useAuth } from "./context/auth/useAuthContext";
import Spinner from "./components/Spinner";
import Settings from "./components/Settings";

const App = () => {
    const { currentUser, isAuthorizing } = useAuth();
    const [activeTab, setActiveTab] = useState("list");
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setMenuOpen(false);
            }
        };

        if (menuOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuOpen]);

    if (isAuthorizing){
        return <Spinner />
    }

    if (!currentUser) {
        return <Login />;
    }

    const firstName = currentUser.displayName?.split(" ")[0] || "User";

    const handleLogout = async () => {
        try {
        await signOut(auth);
        console.log("User signed out successfully");
        } catch (error) {
        console.error("Error signing out:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Navbar */}
            <nav className="bg-gray-800 text-white p-4 flex items-center justify-between">
                {/* Navigation Tabs */}
                <div className="flex gap-4">
                    <button
                        className={`px-4 py-2 rounded ${
                        activeTab === "list" ? "bg-gray-600" : "hover:bg-gray-700"
                        }`}
                        onClick={() => setActiveTab("list")}
                    >
                        Media Lists
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${
                        activeTab === "search" ? "bg-gray-600" : "hover:bg-gray-700"
                        }`}
                        onClick={() => setActiveTab("search")}
                    >
                        Search
                    </button>
                    <button
                        className={`px-4 py-2 rounded ${
                        activeTab === "discover" ? "bg-gray-600" : "hover:bg-gray-700"
                        }`}
                        onClick={() => setActiveTab("discover")}
                    >
                        Discover
                    </button>
                </div>

                {/* User Info and Hamburger Menu */}
                <div className="flex items-center gap-2 relative" ref={menuRef}>
                    <div className="flex items-center gap-2">
                        <img
                        src={currentUser.photoURL || "https://via.placeholder.com/32"}
                        alt={firstName}
                        className="w-8 h-8 rounded-full"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                        />
                        <span className="text-sm">{firstName}</span>
                    </div>

                    {/* Hamburger Button */}
                    <button
                        className="text-white p-2 hover:bg-gray-700 rounded-full focus:outline-none"
                        onClick={() => setMenuOpen((prev) => !prev)}
                    >
                        <FaBars size={24} />
                    </button>

                    {/* Dropdown Menu */}
                    {menuOpen && (
                        <div className="absolute right-0 mt-32 w-48 bg-white text-gray-800 shadow-lg rounded-md">
                        <button
                            className="w-full text-left px-4 py-2 hover:bg-gray-100"
                            onClick={() => {
                            setActiveTab("settings"); // Placeholder for future settings
                            setMenuOpen(false);
                            }}
                        >
                            Settings
                        </button>
                        <button
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                        </div>
                    )}
                </div>
            </nav>
            
            {/* Toast Container */}
            <ToastContainer />

            {/* Main Content */}
            <div className="p-4">
                {activeTab === "list" && <MediaLists />}
                {activeTab === "search" && <Search />}
                {activeTab === "settings" && <Settings />}
                {activeTab === "discover" && <Discover />}
            </div>
        </div>
    );
};

export default App;
