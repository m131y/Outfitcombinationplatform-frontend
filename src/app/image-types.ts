export interface ImageItem {
  id: string;
  url: string;
  title: string;
  category: string;
  tags: string[];
  author?: string;
  liked?: boolean;
}

export interface SearchHistory {
  query: string;
  timestamp: number;
}
