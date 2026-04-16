import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { ImageItem, SearchHistory } from "../image-types";

interface ImageContextType {
  savedImages: ImageItem[];
  likedImages: ImageItem[];
  searchHistory: SearchHistory[];
  saveImage: (image: ImageItem) => void;
  unsaveImage: (id: string) => void;
  toggleLike: (image: ImageItem) => void;
  addSearchHistory: (query: string) => void;
  clearSearchHistory: () => void;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export function ImageProvider({ children }: { children: ReactNode }) {
  const [savedImages, setSavedImages] = useState<ImageItem[]>(() => {
    const saved = localStorage.getItem("image-saved");
    return saved ? JSON.parse(saved) : [];
  });

  const [likedImages, setLikedImages] = useState<ImageItem[]>(() => {
    const saved = localStorage.getItem("image-liked");
    return saved ? JSON.parse(saved) : [];
  });

  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>(() => {
    const saved = localStorage.getItem("image-search-history");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("image-saved", JSON.stringify(savedImages));
  }, [savedImages]);

  useEffect(() => {
    localStorage.setItem("image-liked", JSON.stringify(likedImages));
  }, [likedImages]);

  useEffect(() => {
    localStorage.setItem("image-search-history", JSON.stringify(searchHistory));
  }, [searchHistory]);

  const saveImage = (image: ImageItem) => {
    setSavedImages((prev) => {
      const exists = prev.find((img) => img.id === image.id);
      if (exists) return prev;
      return [image, ...prev];
    });
  };

  const unsaveImage = (id: string) => {
    setSavedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const toggleLike = (image: ImageItem) => {
    setLikedImages((prev) => {
      const exists = prev.find((img) => img.id === image.id);
      if (exists) {
        return prev.filter((img) => img.id !== image.id);
      }
      return [image, ...prev];
    });
  };

  const addSearchHistory = (query: string) => {
    if (!query.trim()) return;
    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item.query !== query);
      return [{ query, timestamp: Date.now() }, ...filtered].slice(0, 10);
    });
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  return (
    <ImageContext.Provider
      value={{
        savedImages,
        likedImages,
        saveImage,
        unsaveImage,
        toggleLike,
        searchHistory,
        addSearchHistory,
        clearSearchHistory,
      }}
    >
      {children}
    </ImageContext.Provider>
  );
}

export function useImages() {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error("useImages must be used within ImageProvider");
  }
  return context;
}
