import { createContext } from "react";

export interface SelectionContextType {
  selection?: string;
  setSelection: (selection: string) => void;
}

export const SelectionContext = createContext<SelectionContextType|null>(null);
