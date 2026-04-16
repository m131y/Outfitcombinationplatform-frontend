import { useState } from "react";
import { useWardrobe } from "../context/WardrobeContext";
import { ClothingCategory } from "../types";
import { Trash2, Filter } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

export function Wardrobe() {
  const { items, removeItem } = useWardrobe();
  const [selectedCategory, setSelectedCategory] = useState<ClothingCategory | "전체">("전체");

  const categories: (ClothingCategory | "전체")[] = [
    "전체",
    "상의",
    "하의",
    "아우터",
    "신발",
    "액세서리",
  ];

  const filteredItems =
    selectedCategory === "전체"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`"${name}"을(를) 삭제하시겠습니까?`)) {
      removeItem(id);
      toast.success("옷이 삭제되었습니다");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">내 옷장</h2>
          <p className="text-gray-600 mt-1">총 {items.length}개의 옷이 있습니다</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full border whitespace-nowrap transition-colors ${
              selectedCategory === cat
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">
            {items.length === 0
              ? "아직 추가된 옷이 없습니다. 옷을 추가해보세요!"
              : `${selectedCategory} 카테고리에 옷이 없습니다.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="group relative overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item.id, item.name)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      삭제
                    </Button>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                    {item.color && (
                      <Badge variant="outline" className="text-xs">
                        {item.color}
                      </Badge>
                    )}
                  </div>
                  {item.season.length > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {item.season.join(", ")}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
