import { useState } from "react";
import { useNavigate } from "react-router";
import { useWardrobe } from "../context/WardrobeContext";
import { ClothingCategory } from "../types";
import { Upload as UploadIcon, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { toast } from "sonner";

export function Upload() {
  const navigate = useNavigate();
  const { addItem } = useWardrobe();
  const [preview, setPreview] = useState<string>("");
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ClothingCategory>("상의");
  const [color, setColor] = useState("");
  const [season, setSeason] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSeason = (s: string) => {
    setSeason((prev) =>
      prev.includes(s) ? prev.filter((item) => item !== s) : [...prev, s]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!preview) {
      toast.error("옷 사진을 업로드해주세요");
      return;
    }

    if (!name.trim()) {
      toast.error("옷 이름을 입력해주세요");
      return;
    }

    addItem({
      id: Date.now().toString(),
      image: preview,
      category,
      name: name.trim(),
      color: color.trim(),
      season: season.length > 0 ? season : ["봄", "여름", "가을", "겨울"],
    });

    toast.success("옷이 추가되었습니다!");
    
    // Reset form
    setPreview("");
    setName("");
    setColor("");
    setSeason([]);
    
    // Navigate to wardrobe after a short delay
    setTimeout(() => navigate("/"), 500);
  };

  const seasons = ["봄", "여름", "가을", "겨울"];

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>새 옷 추가하기</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label>옷 사진</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                {preview ? (
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-64 object-contain rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setPreview("")}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center cursor-pointer">
                    <UploadIcon className="w-12 h-12 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">클릭하여 사진 업로드</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">옷 이름</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 흰색 티셔츠"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">카테고리</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as ClothingCategory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="상의">상의</SelectItem>
                  <SelectItem value="하의">하의</SelectItem>
                  <SelectItem value="아우터">아우터</SelectItem>
                  <SelectItem value="신발">신발</SelectItem>
                  <SelectItem value="액세서리">액세서리</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Color */}
            <div className="space-y-2">
              <Label htmlFor="color">색상 (선택사항)</Label>
              <Input
                id="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="예: 흰색, 검정, 파랑"
              />
            </div>

            {/* Season */}
            <div className="space-y-2">
              <Label>계절 (선택사항)</Label>
              <div className="flex flex-wrap gap-2">
                {seasons.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSeason(s)}
                    className={`px-4 py-2 rounded-full border transition-colors ${
                      season.includes(s)
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-300"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full">
              옷 추가하기
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
