import { createContext } from "react";

export interface SearchContextType {
  currCategory?: string;
  currSubcategory?: string;
  setCategory: (category: string) => void;
  setSubcategory: (subcategory: string) => void;
}

export interface ProductContextType {
  productDelete?: boolean;
  setDelete: () => void;
}

export const SearchContext = createContext<SearchContextType|null>(null);
export const ProductContext = createContext<ProductContextType|null>(null);