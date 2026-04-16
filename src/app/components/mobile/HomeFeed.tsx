import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router";
import { ImageItem } from "../../image-types";
import { ImageCard } from "./ImageCard";
import { ImageDetailModal } from "./ImageDetailModal";

const categories = ["Nature", "Architecture", "Food", "Travel", "Art", "Technology"];

const recommendedImages: ImageItem[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1545805453-e95c05f330dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwbW9kZXJuJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzc2MzI4OTk4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Modern Interior",
    category: "Architecture",
    tags: ["minimalist", "modern", "interior"],
    author: "Spacejoy",
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1598439473183-42c9301db5dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBsYW5kc2NhcGUlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzc2MjUyMzQzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Mountain Landscape",
    category: "Nature",
    tags: ["mountains", "landscape", "nature"],
    author: "John Doe",
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1705254613735-1abb457f8a60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGNvbG9yZnVsJTIwYXJ0fGVufDF8fHx8MTc3NjI1MzQyMHww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Abstract Art",
    category: "Art",
    tags: ["abstract", "colorful", "art"],
    author: "Creative Studio",
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1719464636416-97cbe2f8a172?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBtb3JuaW5nJTIwbGlmZXN0eWxlfGVufDF8fHx8MTc3NjMwMDg5MXww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Morning Coffee",
    category: "Food",
    tags: ["coffee", "lifestyle", "morning"],
    author: "Cafe Lover",
  },
  {
    id: "5",
    url: "https://images.unsplash.com/photo-1623715537851-8bc15aa8c145?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwd29ya3NwYWNlfGVufDF8fHx8MTc3NjIzNTAxOHww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Tech Workspace",
    category: "Technology",
    tags: ["technology", "workspace", "modern"],
    author: "Tech Pro",
  },
  {
    id: "6",
    url: "https://images.unsplash.com/photo-1530209161355-285a3184f9b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBhZHZlbnR1cmUlMjBvY2VhbnxlbnwxfHx8fDE3NzYyODAzMDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Ocean Adventure",
    category: "Travel",
    tags: ["travel", "ocean", "adventure"],
    author: "Wanderlust",
  },
  {
    id: "7",
    url: "https://images.unsplash.com/photo-1757358953842-cab880127fff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcGhvdG9ncmFwaHklMjBnb3VybWV0fGVufDF8fHx8MTc3NjMyOTAwMXww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Gourmet Food",
    category: "Food",
    tags: ["food", "gourmet", "photography"],
    author: "Food Artist",
  },
  {
    id: "8",
    url: "https://images.unsplash.com/photo-1712898281123-6124b26eb35b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwc3R5bGUlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzYzMjkwMDF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Fashion Portrait",
    category: "Art",
    tags: ["fashion", "style", "portrait"],
    author: "Style Magazine",
  },
];

export function HomeFeed() {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

  const handleCategoryClick = (category: string) => {
    navigate(`/category?filter=${category.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Search Bar */}
      <div className="sticky top-0 bg-white border-b border-gray-100 z-10 px-4 py-4">
        <div
          onClick={() => navigate("/search")}
          className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors"
        >
          <Search className="w-5 h-5 text-gray-400" />
          <span className="text-gray-400">Search for images...</span>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-4 border-b border-gray-100">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className="px-4 py-2 bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 rounded-full text-sm font-medium whitespace-nowrap hover:from-cyan-100 hover:to-blue-100 transition-all border border-cyan-200"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Recommended Photos Section */}
      <div className="px-4 py-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recommended photos</h2>
        <div className="grid grid-cols-2 gap-3">
          {recommendedImages.map((image) => (
            <ImageCard
              key={image.id}
              image={image}
              onClick={() => setSelectedImage(image)}
            />
          ))}
        </div>
      </div>

      {/* Image Detail Modal */}
      <ImageDetailModal
        image={selectedImage}
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
}
