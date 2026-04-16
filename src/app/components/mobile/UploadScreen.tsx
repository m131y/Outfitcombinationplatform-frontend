import { useState } from "react";
import { Upload, X, Check } from "lucide-react";
import { useNavigate } from "react-router";
import { useImages } from "../../context/ImageContext";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

export function UploadScreen() {
  const navigate = useNavigate();
  const { saveImage } = useImages();
  const [preview, setPreview] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [uploading, setUploading] = useState(false);

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

  const handleUpload = async () => {
    if (!preview) {
      toast.error("Please select an image");
      return;
    }

    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    setUploading(true);

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newImage = {
      id: Date.now().toString(),
      url: preview,
      title: title.trim(),
      category: category.trim() || "Uncategorized",
      tags: description
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    saveImage(newImage);
    toast.success("Image uploaded successfully!");

    setUploading(false);
    navigate("/saved");
  };

  const clearPreview = () => {
    setPreview("");
    setTitle("");
    setDescription("");
    setCategory("");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-100 z-10 px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900">Upload Image</h1>
          <button
            onClick={() => navigate("/")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="px-4 py-6 space-y-6">
        {/* Image Upload Area */}
        <div>
          <Label className="text-sm font-medium text-gray-900">Image</Label>
          <div className="mt-2 border-2 border-dashed border-gray-300 rounded-2xl overflow-hidden">
            {preview ? (
              <div className="relative bg-gray-100">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-80 object-contain"
                />
                <button
                  onClick={clearPreview}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-700" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-80 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-cyan-600" />
                </div>
                <p className="text-gray-900 font-medium mb-1">
                  Tap to upload image
                </p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
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

        {/* Title */}
        <div>
          <Label htmlFor="title" className="text-sm font-medium text-gray-900">
            Title
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter image title"
            className="mt-2 h-12 rounded-xl border-gray-200"
          />
        </div>

        {/* Category */}
        <div>
          <Label htmlFor="category" className="text-sm font-medium text-gray-900">
            Category (optional)
          </Label>
          <Input
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g. Nature, Art, Travel"
            className="mt-2 h-12 rounded-xl border-gray-200"
          />
        </div>

        {/* Description/Tags */}
        <div>
          <Label htmlFor="description" className="text-sm font-medium text-gray-900">
            Tags (optional)
          </Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add tags separated by commas"
            rows={3}
            className="mt-2 rounded-xl border-gray-200 resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            Example: landscape, mountains, sunset
          </p>
        </div>

        {/* Upload Button */}
        <Button
          onClick={handleUpload}
          disabled={uploading || !preview || !title.trim()}
          className="w-full h-12 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Uploading...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5" />
              Upload Image
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}
