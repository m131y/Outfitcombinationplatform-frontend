import { Heart } from "lucide-react";
import { ImageItem } from "../../image-types";
import { useImages } from "../../context/ImageContext";
import { useState } from "react";

interface ImageCardProps {
  image: ImageItem;
  onClick: () => void;
}

export function ImageCard({ image, onClick }: ImageCardProps) {
  const { likedImages, toggleLike } = useImages();
  const [imageLoaded, setImageLoaded] = useState(false);
  const isLiked = likedImages.some((img) => img.id === image.id);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike(image);
  };

  return (
    <div
      onClick={onClick}
      className="relative group cursor-pointer overflow-hidden rounded-xl bg-gray-100"
      style={{ aspectRatio: "3/4" }}
    >
      {!imageLoaded && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
      )}
      <img
        src={image.url}
        alt={image.title}
        className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setImageLoaded(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <button
        onClick={handleLikeClick}
        className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white transition-all z-10"
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            isLiked ? "fill-red-500 text-red-500" : "text-gray-700"
          }`}
        />
      </button>
    </div>
  );
}
