import { createBrowserRouter } from "react-router";
import { MobileLayout } from "./components/mobile/MobileLayout";
import { HomeFeed } from "./components/mobile/HomeFeed";
import { SearchScreen } from "./components/mobile/SearchScreen";
import { CategoryScreen } from "./components/mobile/CategoryScreen";
import { SavedScreen } from "./components/mobile/SavedScreen";
import { UploadScreen } from "./components/mobile/UploadScreen";

export const imageRouter = createBrowserRouter([
  {
    path: "/",
    Component: MobileLayout,
    children: [
      { index: true, Component: HomeFeed },
      { path: "search", Component: SearchScreen },
      { path: "category", Component: CategoryScreen },
      { path: "saved", Component: SavedScreen },
      { path: "upload", Component: UploadScreen },
    ],
  },
]);
