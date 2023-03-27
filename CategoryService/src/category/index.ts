
export interface Category{
    id: string,
    name: string,
}

export interface CategoryList {
    category: Category,
    subcategories: Subcategory[]
  }

export interface CategoryInput {
    name: string;
    subcategories: SubcategoryInput[]
  }
export interface SubcategoryInput {
    name: string,
    attributes: string,
}
export interface Subcategory {
    id: string,
    name: string,
    attributes: string,
}

export interface CategoryDetail {
    category: Category,
    subcategory: Subcategory
}
