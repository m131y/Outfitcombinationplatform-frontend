import { useState } from "react";
import { Search, ImageOff } from "lucide-react";
import { useNavigate } from "react-router";
import { useImages } from "../../context/ImageContext";
import { ImageItem } from "../../image-types";
import { ImageDetailModal } from "./ImageDetailModal";

export function SavedScreen() {
  const navigate = useNavigate();
  const { savedImages } = useImages();
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Search Bar */}
      <div className="sticky top-0 bg-white border-b border-gray-100 z-10 px-4 py-4">
        <div
          onClick={() => navigate("/search")}
          className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl cursor-pointer"
        >
          <Search className="w-5 h-5 text-gray-400" />
          <span className="text-gray-400">Search in saved...</span>
        </div>
      </div>

      {/* Saved Items */}
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Saved items</h2>
          <span className="text-sm text-gray-500">{savedImages.length} items</span>
        </div>

        {savedImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <ImageOff className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No saved images yet
            </h3>
            <p className="text-gray-500 max-w-xs mb-6">
              Start exploring and save your favorite images to see them here
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium hover:from-cyan-600 hover:to-blue-600 transition-all"
            >
              Explore Images
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {savedImages.map((image) => (
              <div
                key={image.id}
                onClick={() => setSelectedImage(image)}
                className="relative group cursor-pointer overflow-hidden rounded-xl bg-gray-100"
                style={{ aspectRatio: "3/4" }}
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white transform translate-y-full group-hover:translate-y-0 transition-transform">
                  <p className="text-sm font-medium truncate">{image.title}</p>
                  {image.category && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded text-xs">
                      {image.category}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ImageDetailModal
        image={selectedImage}
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      />
    </div>
  );
}
