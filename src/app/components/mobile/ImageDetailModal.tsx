import { X, Heart, Bookmark, Share2 } from "lucide-react";
import { ImageItem } from "../../image-types";
import { useImages } from "../../context/ImageContext";
import { Dialog, DialogContent } from "../ui/dialog";
import { toast } from "sonner";

interface ImageDetailModalProps {
  image: ImageItem | null;
  open: boolean;
  onClose: () => void;
}

export function ImageDetailModal({ image, open, onClose }: ImageDetailModalProps) {
  const { likedImages, savedImages, toggleLike, saveImage, unsaveImage } = useImages();

  if (!image) return null;

  const isLiked = likedImages.some((img) => img.id === image.id);
  const isSaved = savedImages.some((img) => img.id === image.id);

  const handleLike = () => {
    toggleLike(image);
    toast.success(isLiked ? "Removed from likes" : "Added to likes");
  };

  const handleSave = () => {
    if (isSaved) {
      unsaveImage(image.id);
      toast.success("Removed from saved");
    } else {
      saveImage(image);
      toast.success("Saved successfully");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: image.title,
        url: image.url,
      });
    } else {
      navigator.clipboard.writeText(image.url);
      toast.success("Link copied to clipboard");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 gap-0 bg-transparent border-none">
        <div className="relative bg-white rounded-2xl overflow-hidden shadow-2xl">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-md hover:bg-white transition-all"
          >
            <X className="w-5 h-5 text-gray-700" />
          </button>

          {/* Image */}
          <div className="relative bg-gray-100">
            <img
              src={image.url}
              alt={image.title}
              className="w-full max-h-[70vh] object-contain"
            />
          </div>

          {/* Bottom Area */}
          <div className="p-6 space-y-4">
            {/* Title and metadata */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{image.title}</h3>
              {image.author && (
                <p className="text-sm text-gray-500 mt-1">by {image.author}</p>
              )}
              {image.tags && image.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {image.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${
                  isLiked
                    ? "bg-red-50 border-red-200 text-red-600"
                    : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${isLiked ? "fill-red-600" : ""}`}
                  strokeWidth={2}
                />
                <span className="font-medium">Like</span>
              </button>

              <button
                onClick={handleSave}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all ${
                  isSaved
                    ? "bg-cyan-50 border-cyan-200 text-cyan-600"
                    : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                }`}
              >
                <Bookmark
                  className={`w-5 h-5 ${isSaved ? "fill-cyan-600" : ""}`}
                  strokeWidth={2}
                />
                <span className="font-medium">Save</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 border-gray-200 text-gray-700 hover:border-gray-300 transition-all"
              >
                <Share2 className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
