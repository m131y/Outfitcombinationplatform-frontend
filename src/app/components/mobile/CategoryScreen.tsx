import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router";
import Masonry from "react-responsive-masonry";
import { ImageItem } from "../../image-types";
import { ImageDetailModal } from "./ImageDetailModal";
import { useImages } from "../../context/ImageContext";

const filters = {
  style: ["Minimalist", "Vintage", "Modern", "Classic"],
  color: ["Warm", "Cool", "Monochrome", "Vibrant"],
  mood: ["Calm", "Energetic", "Dark", "Bright"],
};

const categoryImages: ImageItem[] = [
  {
    id: "c1",
    url: "https://images.unsplash.com/photo-1545805453-e95c05f330dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwbW9kZXJuJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzc2MzI4OTk4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Modern Interior",
    category: "Architecture",
    tags: ["minimalist", "modern"],
  },
  {
    id: "c2",
    url: "https://images.unsplash.com/photo-1598439473183-42c9301db5dc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBsYW5kc2NhcGUlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzc2MjUyMzQzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Mountain Landscape",
    category: "Nature",
    tags: ["landscape", "nature"],
  },
  {
    id: "c3",
    url: "https://images.unsplash.com/photo-1705254613735-1abb457f8a60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGNvbG9yZnVsJTIwYXJ0fGVufDF8fHx8MTc3NjI1MzQyMHww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Abstract Art",
    category: "Art",
    tags: ["abstract", "colorful"],
  },
  {
    id: "c4",
    url: "https://images.unsplash.com/photo-1719464636416-97cbe2f8a172?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBtb3JuaW5nJTIwbGlmZXN0eWxlfGVufDF8fHx8MTc3NjMwMDg5MXww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Morning Coffee",
    category: "Food",
    tags: ["coffee", "lifestyle"],
  },
  {
    id: "c5",
    url: "https://images.unsplash.com/photo-1623715537851-8bc15aa8c145?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwd29ya3NwYWNlfGVufDF8fHx8MTc3NjIzNTAxOHww&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Tech Workspace",
    category: "Technology",
    tags: ["technology", "workspace"],
  },
  {
    id: "c6",
    url: "https://images.unsplash.com/photo-1530209161355-285a3184f9b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cmF2ZWwlMjBhZHZlbnR1cmUlMjBvY2VhbnxlbnwxfHx8fDE3NzYyODAzMDd8MA&ixlib=rb-4.1.0&q=80&w=1080",
    title: "Ocean Adventure",
    category: "Travel",
    tags: ["ocean", "adventure"],
  },
];

export function CategoryScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get("filter");
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(false);
  const { likedImages, toggleLike } = useImages();

  const toggleFilter = (category: string, value: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      [category]: prev[category] === value ? "" : value,
    }));
  };

  const handleImageClick = (image: ImageItem) => {
    setSelectedImage(image);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 z-10 px-4 py-4 space-y-3">
        <div
          onClick={() => navigate("/search")}
          className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl cursor-pointer"
        >
          <Search className="w-5 h-5 text-gray-400" />
          <span className="text-gray-400">Search for images...</span>
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-50 to-blue-50 text-cyan-700 rounded-xl text-sm font-medium border border-cyan-200"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>

        {/* Filters */}
        {showFilters && (
          <div className="space-y-3 pt-2">
            {Object.entries(filters).map(([category, options]) => (
              <div key={category}>
                <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">
                  {category}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {options.map((option) => (
                    <button
                      key={option}
                      onClick={() => toggleFilter(category, option)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        activeFilters[category] === option
                          ? "bg-cyan-500 text-white border-cyan-500"
                          : "bg-white text-gray-600 border border-gray-200 hover:border-cyan-300"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Masonry Grid */}
      <div className="px-4 py-6">
        <h3 className="text-sm text-gray-500 mb-4">
          {filterParam ? `Exploring ${filterParam}` : "Explore images"}
        </h3>
        <Masonry columnsCount={2} gutter="12px">
          {categoryImages.map((image) => {
            const isLiked = likedImages.some((img) => img.id === image.id);
            return (
              <div
                key={image.id}
                onClick={() => handleImageClick(image)}
                className="relative group cursor-pointer overflow-hidden rounded-xl"
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(image);
                  }}
                  className="absolute top-2 right-2 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                >
                  <svg
                    className={`w-4 h-4 ${
                      isLiked ? "fill-red-500 text-red-500" : "text-gray-700"
                    }`}
                    fill={isLiked ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
            );
          })}
        </Masonry>
      </div>

      <ImageDetailModal
        image={selectedImage}
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
}
