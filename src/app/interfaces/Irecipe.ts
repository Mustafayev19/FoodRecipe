// src/app/services/Irecipe.ts

// Measurement interfeysi
export interface Measurement {
  amount: number;
  unitShort: string;
  unitLong: string;
}

// Spoonacular API-dən birbaşa gələn inqredient obyektinin strukturu
export interface SpoonacularApiExtendedIngredient {
  id: number;
  aisle?: string;
  image?: string | null; // filename like 'apple.jpg'
  consistency?: string;
  name: string;
  nameClean?: string;
  original?: string;
  originalName?: string;
  amount: number;
  unit: string;
  meta?: string[];
  measures?: {
    us: Measurement;
    metric: Measurement;
  };
}

// Spoonacular API-dən birbaşa gələn resept obyektinin strukturu
export interface SpoonacularApiRecipe {
  id: number;
  title: string;
  image: string;
  imageType?: string;
  cheap: boolean;
  healthScore: number;
  instructions: string | null;
  readyInMinutes: number;
  sourceUrl?: string;
  summary?: string;
  servings?: number;
  dishTypes?: string[];
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
  dairyFree?: boolean;
  extendedIngredients: SpoonacularApiExtendedIngredient[]; // Yuxarıda təyin edilən SpoonacularApiExtendedIngredient istifadə olunur
}

// Bizim tətbiqdaxili istifadə edəcəyimiz ExtendedIngredient interfeysi
export interface ExtendedIngredient {
  id: number;
  name: string;
  image: string | null; // İnqredient üçün tam şəkil URL-i (servisdə formalaşacaq)
  amount: number;
  unit: string;
  original?: string;
}

// Bizim tətbiqdaxili istifadə edəcəyimiz Recipe interfeysi
export interface Recipe {
  id: number;
  title: string;
  image: string;
  cheap: boolean;
  healthScore: number;
  instructions: string | null;
  readyInMinutes: number;
  sourceUrl?: string;
  summary?: string;
  servings?: number;
  dishTypes?: string[];
  vegetarian?: boolean;
  vegan?: boolean;
  glutenFree?: boolean;
  dairyFree?: boolean;
  extendedIngredients: ExtendedIngredient[]; // Yuxarıda təyin edilən ExtendedIngredient istifadə olunur
}

// Spoonacular-dan /recipes/complexSearch endpoint-indən gələn cavabın ümumi strukturu
export interface SpoonacularComplexSearchResponse {
  results: SpoonacularApiRecipe[]; // API-dən gələn xam SpoonacularApiRecipe obyektləri
  offset: number;
  number: number;
  totalResults: number;
}

// MainComponent-in və servisin pagination üçün istifadə edəcəyi ümumi məlumat strukturu
export interface PaginatedRecipesResponse {
  recipes: Recipe[]; // Bizim standartlaşdırılmış Recipe interfeysimiz
  totalResults: number;
  query?: string;
  category?: string;
  page?: number;
  itemsPerPage?: number;
}

// SearchedRecipe interfeysi (əgər hələ də /recipes/autocomplete istifadə olunursa)
export interface SearchedRecipe {
  id: number;
  title?: string;
}

// RandomJoke interfeysi artıq qaldırılıb.
