import { useState } from "react";
import { Search, TrendingUp, X, Clock } from "lucide-react";
import { useImages } from "../../context/ImageContext";
import { ImageItem } from "../../image-types";
import { ImageCard } from "./ImageCard";
import { ImageDetailModal } from "./ImageDetailModal";

const trendingKeywords = [
  "Minimalist",
  "Nature",
  "Architecture",
  "Food Photography",
  "Abstract Art",
  "Travel",
  "Portrait",
  "Landscape",
];

const mockSearchResults: ImageItem[] = [
  {
    id: "s1",
    url: "https://images.unsplash.com/photo-1598439473183-42c9301db5dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBsYW5kc2NhcGUlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzc2MjUyMzQzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Mountain Vista",
    category: "Nature",
    tags: ["mountains", "landscape"],
  },
  {
    id: "s2",
    url: "https://images.unsplash.com/photo-1545805453-e95c05f330dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwbW9kZXJuJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzc2MzI4OTk4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Clean Space",
    category: "Architecture",
    tags: ["minimalist", "interior"],
  },
  {
    id: "s3",
    url: "https://images.unsplash.com/photo-1705254613735-1abb457f8a60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGNvbG9yZnVsJTIwYXJ0fGVufDF8fHx8MTc3NjI1MzQyMHww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Color Splash",
    category: "Art",
    tags: ["abstract", "colorful"],
  },
  {
    id: "s4",
    url: "https://images.unsplash.com/photo-1719464636416-97cbe2f8a172?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBtb3JuaW5nJTIwbGlmZXN0eWxlfGVufDF8fHx8MTc3NjMwMDg5MXww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Coffee Break",
    category: "Food",
    tags: ["coffee", "lifestyle"],
  },
  {
    id: "s5",
    url: "https://images.unsplash.com/photo-1530209161355-285a3184f9b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBhZHZlbnR1cmUlMjBvY2VhbnxlbnwxfHx8fDE3NzYyODAzMDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Beach View",
    category: "Travel",
    tags: ["ocean", "travel"],
  },
  {
    id: "s6",
    url: "https://images.unsplash.com/photo-1712898281123-6124b26eb35b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3R5bGUlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzYzMjkwMDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Style Shot",
    category: "Fashion",
    tags: ["fashion", "portrait"],
  },
];

export function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ImageItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const { searchHistory, addSearchHistory } = useImages();

  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    addSearchHistory(query);
    setSearchQuery(query);
    setSearchResults(mockSearchResults);
  };

  const handleKeywordClick = (keyword: string) => {
    setSearchQuery(keyword);
    handleSearch(keyword);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Search Bar */}
      <div className="sticky top-0 bg-white border-b border-gray-100 z-10 px-4 py-4">
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(searchQuery)}
            placeholder="Search for images..."
            className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-400"
          />
          {searchQuery && (
            <button onClick={clearSearch} className="p-1 hover:bg-gray-200 rounded-full">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {searchResults.length === 0 ? (
        <div className="px-4 py-6 space-y-6">
          {/* Recent Searches */}
          {searchHistory.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <h3 className="font-medium text-gray-900">Recent searches</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {searchHistory.slice(0, 6).map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleKeywordClick(item.query)}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-cyan-300 hover:text-cyan-600 transition-all"
                  >
                    {item.query}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending Keywords */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-5 h-5 text-cyan-500" />
              <h3 className="font-medium text-gray-900">Trending</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {trendingKeywords.map((keyword) => (
                <button
                  key={keyword}
                  onClick={() => handleKeywordClick(keyword)}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 rounded-full text-sm font-medium hover:from-cyan-100 hover:to-blue-100 transition-all border border-cyan-200"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="px-4 py-6">
          <h3 className="text-sm text-gray-500 mb-4">
            {searchResults.length} results for "{searchQuery}"
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {searchResults.map((image) => (
              <ImageCard
                key={image.id}
                image={image}
                onClick={() => setSelectedImage(image)}
              />
            ))}
          </div>
        </div>
      )}

      <ImageDetailModal
        image={selectedImage}
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
}
