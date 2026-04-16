import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { ClothingItem, Outfit } from "../types";

interface WardrobeContextType {
  items: ClothingItem[];
  outfits: Outfit[];
  addItem: (item: ClothingItem) => void;
  removeItem: (id: string) => void;
  addOutfit: (outfit: Outfit) => void;
  removeOutfit: (id: string) => void;
}

const WardrobeContext = createContext<WardrobeContextType | undefined>(undefined);

export function WardrobeProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ClothingItem[]>(() => {
    const saved = localStorage.getItem("wardrobe-items");
    return saved ? JSON.parse(saved) : [];
  });

  const [outfits, setOutfits] = useState<Outfit[]>(() => {
    const saved = localStorage.getItem("wardrobe-outfits");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("wardrobe-items", JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem("wardrobe-outfits", JSON.stringify(outfits));
  }, [outfits]);

  const addItem = (item: ClothingItem) => {
    setItems((prev) => [...prev, item]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const addOutfit = (outfit: Outfit) => {
    setOutfits((prev) => [...prev, outfit]);
  };

  const removeOutfit = (id: string) => {
    setOutfits((prev) => prev.filter((outfit) => outfit.id !== id));
  };

  return (
    <WardrobeContext.Provider
      value={{ items, outfits, addItem, removeItem, addOutfit, removeOutfit }}
    >
      {children}
    </WardrobeContext.Provider>
  );
}

export function useWardrobe() {
  const context = useContext(WardrobeContext);
  if (!context) {
    throw new Error("useWardrobe must be used within WardrobeProvider");
  }
  return context;
}
