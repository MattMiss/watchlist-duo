import { getFirestore, doc, setDoc, getDoc, deleteDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { Movie, TV } from "../types/tmdb";

const db = getFirestore();

/**
 * Add media to the user's list in Firestore.
 */
export const addToMyList = async (
    userId: string,
    media: Movie | TV,
    type: "movie" | "tv"
): Promise<void> => {
    try {
        const userRef = doc(db, "users", userId);
        const collectionName = type === "movie" ? "movies" : "tv";
        const mediaRef = doc(userRef, collectionName, media.id.toString());

        // Check if the media already exists in Firestore
        const mediaSnap = await getDoc(mediaRef);
            if (mediaSnap.exists()) {
                toast.error(`${type === "movie" ? "Movie" : "TV Show"} is already on your list!`);
                //console.log("Media already exists in the list.");
            return;
        }

        // Type narrowing for Movie or TV
        const name = type === "movie" ? (media as Movie).title : (media as TV).name;
        const year = type === "movie"
            ? (media as Movie).release_date?.slice(0, 4)
            : (media as TV).first_air_date?.slice(0, 4);

        // Save the media to Firestore
        await setDoc(mediaRef, {
            id: media.id,
            type,
            name: name || "Unknown",
            year: year || "Unknown",
            rating: media.vote_average,
            poster_path: media.poster_path,
            updatedDate: new Date().toISOString().split("T")[0], // Save only the date
        });

        toast.success(`${type === "movie" ? "Movie" : "TV Show"} added to your list!`);
    } catch (error) {
        toast.error("Error fetching results. Please refresh and try again.");
        console.error("Error adding media to list:", error);
    }
};

/**
 * Delete media from the user's list in Firestore.
 */
export const deleteFromMyList = async (
    userId: string,
    mediaId: string,
    type: "movie" | "tv"
): Promise<void> => {
try {
    const userRef = doc(db, "users", userId);
    const collectionName = type === "movie" ? "movies" : "tv";
    const mediaRef = doc(userRef, collectionName, mediaId);

    // Check if the media exists in Firestore
    const mediaSnap = await getDoc(mediaRef);
    if (!mediaSnap.exists()) {
        toast.error(`${type === "movie" ? "Movie" : "TV Show"} not found in list!`);
        return;
    }

    // Delete the media from Firestore
    await deleteDoc(mediaRef);

    toast.success(`${type === "movie" ? "Movie" : "TV Show"} removed successfully!`);
} catch (error) {
    toast.error("Failed to add to your list. Please try again.");
    console.error("Error removing media from list:", error);
}
};



