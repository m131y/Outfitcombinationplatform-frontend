import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Wardrobe } from "./components/Wardrobe";
import { Outfits } from "./components/Outfits";
import { Upload } from "./components/Upload";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Wardrobe },
      { path: "outfits", Component: Outfits },
      { path: "upload", Component: Upload },
    ],
  },
]);
