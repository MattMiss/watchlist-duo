import { useState, useEffect } from "react";
import { useMyList } from "../context/myList/useMyListContext";
import { useDuoPartnerList } from "../context/duoPartnerList/useDuoPartnerListContext";
import MediaResultCard from "./MediaResultCard";
import Spinner from "./Spinner";
import { Movie, TV } from "../types/tmdb";
import { useAuth } from "../context/auth/useAuthContext";

const MediaLists = () => {
  const { currentUser } = useAuth();
  const { myList, refreshMyList, isLoadingMyList } = useMyList();
  const { duoPartnerList, refreshDuoPartnerList, isLoadingDuoPartnerList } = useDuoPartnerList();
  const [activeTab, setActiveTab] = useState<"myList" | "partnerList" | "ourList">("myList");
  const [displayList, setDisplayList] = useState<(Movie | TV)[]>([]);

  useEffect(() => {
    // Refresh both lists when the component mounts
    refreshMyList();
    refreshDuoPartnerList();
  }, []);

  useEffect(() => {
    // Determine which list to display based on the active tab
    if (activeTab === "myList") {
      setDisplayList(myList);
    } else if (activeTab === "partnerList") {
      setDisplayList(duoPartnerList);
    } else if (activeTab === "ourList") {
      // Find common items between myList and partnerList based on `id` and `media_type`
      const commonItems = myList.filter((myItem) =>
        duoPartnerList.some(
          (partnerItem) =>
            partnerItem.id === myItem.id && partnerItem.media_type === myItem.media_type
        )
      );
      setDisplayList(commonItems);
    }
  }, [activeTab, myList, duoPartnerList]);

  if (isLoadingMyList || isLoadingDuoPartnerList) {
    return <Spinner />;
  }

  return (
    <div>
      {/* Tabs for My List, Partner's List, and Our List */}
      <div className="flex justify-center mb-4">
        <button
            className={`px-4 py-2 mx-2 rounded ${
                activeTab === "myList" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setActiveTab("myList")}
        >
            My List
        </button>
        {currentUser?.partnerUid && (
            <>
                <button
                    className={`px-4 py-2 mx-2 rounded ${
                        activeTab === "partnerList" ? "bg-blue-500 text-white" : "bg-gray-200"
                    }`}
                    onClick={() => setActiveTab("partnerList")}
                >
                    Duo Partner's List
                </button>
                <button
                    className={`px-4 py-2 mx-2 rounded ${
                        activeTab === "ourList" ? "bg-blue-500 text-white" : "bg-gray-200"
                    }`}
                    onClick={() => setActiveTab("ourList")}
                >
                    Our List
                </button>
            </>
        )}
        
        
      </div>

      {/* Display List */}
      {displayList.length === 0 ? (
        <p>No items to display in this list.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {displayList.map((media) => (
                <MediaResultCard
                    key={media.id}
                    media={media}
                    type={media.media_type} // Use the type from media
                    actionLabel="Remove from My List"
                    actionBtnColor="bg-red-500"
                    actionBtnHoverColor="hover:bg-red-700"
                    onActionClick={() => console.log(`Removed ${media.media_type}: ${media.id}`)}
                />
            ))}
        </div>
      )}
    </div>
  );
};

export default MediaLists;