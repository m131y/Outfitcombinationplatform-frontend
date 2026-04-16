export type ClothingCategory = "상의" | "하의" | "아우터" | "신발" | "액세서리";

export interface ClothingItem {
  id: string;
  image: string;
  category: ClothingCategory;
  name: string;
  color: string;
  season: string[];
}

export interface Outfit {
  id: string;
  name: string;
  items: ClothingItem[];
  createdAt: string;
}
