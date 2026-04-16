import { useState, useEffect } from "react";
import { useWardrobe } from "../context/WardrobeContext";
import { ClothingItem, Outfit } from "../types";
import { Sparkles, Save, Shuffle, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

export function Outfits() {
  const { items, outfits, addOutfit, removeOutfit } = useWardrobe();
  const [currentOutfit, setCurrentOutfit] = useState<ClothingItem[]>([]);
  const [outfitName, setOutfitName] = useState("");

  const generateRandomOutfit = () => {
    if (items.length === 0) {
      toast.error("옷장에 옷이 없습니다. 먼저 옷을 추가해주세요!");
      return;
    }

    const categories = {
      상의: items.filter((item) => item.category === "상의"),
      하의: items.filter((item) => item.category === "하의"),
      아우터: items.filter((item) => item.category === "아우터"),
      신발: items.filter((item) => item.category === "신발"),
      액세서리: items.filter((item) => item.category === "액세서리"),
    };

    const outfit: ClothingItem[] = [];

    // Try to pick one from each category if available
    if (categories.상의.length > 0) {
      const randomTop = categories.상의[Math.floor(Math.random() * categories.상의.length)];
      outfit.push(randomTop);
    }

    if (categories.하의.length > 0) {
      const randomBottom = categories.하의[Math.floor(Math.random() * categories.하의.length)];
      outfit.push(randomBottom);
    }

    // Randomly decide to add outer, shoes, or accessories
    if (categories.아우터.length > 0 && Math.random() > 0.5) {
      const randomOuter = categories.아우터[Math.floor(Math.random() * categories.아우터.length)];
      outfit.push(randomOuter);
    }

    if (categories.신발.length > 0 && Math.random() > 0.3) {
      const randomShoes = categories.신발[Math.floor(Math.random() * categories.신발.length)];
      outfit.push(randomShoes);
    }

    if (categories.액세서리.length > 0 && Math.random() > 0.6) {
      const randomAccessory =
        categories.액세서리[Math.floor(Math.random() * categories.액세서리.length)];
      outfit.push(randomAccessory);
    }

    if (outfit.length === 0) {
      // If no specific categories, just pick random items
      const shuffled = [...items].sort(() => Math.random() - 0.5);
      outfit.push(...shuffled.slice(0, Math.min(3, items.length)));
    }

    setCurrentOutfit(outfit);
  };

  const saveOutfit = () => {
    if (currentOutfit.length === 0) {
      toast.error("저장할 코디가 없습니다");
      return;
    }

    const name = outfitName.trim() || `코디 ${outfits.length + 1}`;

    addOutfit({
      id: Date.now().toString(),
      name,
      items: currentOutfit,
      createdAt: new Date().toISOString(),
    });

    toast.success(`"${name}"이(가) 저장되었습니다!`);
    setOutfitName("");
  };

  const deleteOutfit = (id: string, name: string) => {
    if (confirm(`"${name}"을(를) 삭제하시겠습니까?`)) {
      removeOutfit(id);
      toast.success("코디가 삭제되었습니다");
    }
  };

  const loadOutfit = (outfit: Outfit) => {
    setCurrentOutfit(outfit.items);
    setOutfitName(outfit.name);
    toast.success(`"${outfit.name}"을(를) 불러왔습니다`);
  };

  // Generate initial outfit on mount
  useEffect(() => {
    if (items.length > 0 && currentOutfit.length === 0) {
      generateRandomOutfit();
    }
  }, [items]);

  return (
    <div className="space-y-8">
      {/* Current Outfit Recommendation */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-500" />
              추천 코디
            </CardTitle>
            <Button onClick={generateRandomOutfit} variant="outline" size="sm">
              <Shuffle className="w-4 h-4 mr-2" />
              다시 추천받기
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {currentOutfit.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                옷장에 옷을 추가하고 코디 추천을 받아보세요!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {currentOutfit.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <div className="aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900 truncate">
                        {item.name}
                      </p>
                      <Badge variant="secondary" className="text-xs mt-1">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-end gap-3 pt-4 border-t">
                <div className="flex-1">
                  <Label htmlFor="outfit-name">코디 이름 (선택사항)</Label>
                  <Input
                    id="outfit-name"
                    value={outfitName}
                    onChange={(e) => setOutfitName(e.target.value)}
                    placeholder="예: 캐주얼 데일리룩"
                    className="mt-1"
                  />
                </div>
                <Button onClick={saveOutfit}>
                  <Save className="w-4 h-4 mr-2" />
                  저장하기
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Saved Outfits */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">
          저장된 코디 ({outfits.length})
        </h2>

        {outfits.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">아직 저장된 코디가 없습니다</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {outfits.map((outfit) => (
              <Card key={outfit.id} className="group">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{outfit.name}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(outfit.createdAt).toLocaleDateString("ko-KR")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => loadOutfit(outfit)}
                      >
                        불러오기
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteOutfit(outfit.id, outfit.name)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                    {outfit.items.map((item) => (
                      <div key={item.id} className="space-y-1">
                        <div className="aspect-square rounded overflow-hidden border">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-xs text-gray-600 truncate">{item.name}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
