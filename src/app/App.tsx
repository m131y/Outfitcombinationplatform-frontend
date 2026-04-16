import { RouterProvider } from "react-router";
import { ImageProvider } from "./context/ImageContext";
import { imageRouter } from "./image-routes";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  return (
    <ImageProvider>
      <RouterProvider router={imageRouter} />
      <Toaster />
    </ImageProvider>
  );
}