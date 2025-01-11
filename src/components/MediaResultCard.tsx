import { Movie, TV } from "../types/tmdb";
import { FaFilm, FaTv } from "react-icons/fa";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w200";

interface MediaResultCardProps {
    media: Movie | TV;
    type: "movie" | "tv";
    actionLabel?: string; // Label for the action button
    actionBtnColor?: string; // Button Color for the action button
    actionBtnHoverColor?: string; // Button Hover Color for the action button
    onActionClick?: () => void; // Handler for the button click
}

const MediaResultCard = ({
    media,
    type,
    actionLabel = "Add to List",
    actionBtnColor = "bg-green-600",
    actionBtnHoverColor = "hover:bg-green-700",
    onActionClick,
}: MediaResultCardProps) => {
    console.log(media);
    return (
    <div className="relative border rounded-lg shadow-md overflow-hidden mb-6 p-4">
        {/* Two-Column Layout */}
        <div className="flex">
            {/* Poster Image */}
            <img
                src={
                    media.poster_path
                    ? `${IMAGE_BASE_URL}${media.poster_path}`
                    : "https://via.placeholder.com/200x300?text=No+Image"
                }
                alt={type === "movie" ? (media as Movie).title : (media as TV).name}
                className="w-32 h-48 object-cover border rounded-md flex-shrink-0 mr-4"
            />

            {/* Text Content */}
            <div className="flex flex-col flex-1">
            <h3 className="text-lg font-bold">
                {type === "movie" ? (media as Movie).title : (media as TV).name}
            </h3>
            <p className="text-gray-600 font-semibold">
                {(type === "movie"
                ? (media as Movie).release_date
                : (media as TV).first_air_date
                )?.slice(0, 4) || "Unknown"}
            </p>
            <p><span className="text-yellow-500">★</span> <span className="text-sm">{media.vote_average?.toFixed(1)}</span></p>
            </div>
        </div>

        {/* Type Label */}
        <span
            className={`absolute bottom-16 right-4 flex gap-1 min-w-20 text-xs font-medium px-2 py-1 items-center justify-center rounded-full ${
            type === "movie" ? "bg-red-400" : "bg-blue-400"
            }`}
        >
            {type === "movie" && (
            <>
                <FaFilm size={16} />
                Movie
            </>
            )}
            {type === "tv" && (
            <>
                <FaTv size={16} />
                TV
            </>
            )}
        </span>

        {/* Action Button */}
        {(!media.owner || media.owner == "self") && (
        <button
            onClick={onActionClick}
            className={`w-full mt-4 px-4 py-2 ${actionBtnColor} text-white rounded-lg ${actionBtnHoverColor} focus:outline-none`}
        >
            {actionLabel}
        </button>
        )}
    </div>
  );
};

export default MediaResultCard;
