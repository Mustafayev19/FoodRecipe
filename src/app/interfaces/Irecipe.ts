export interface Measurement {
  amount: number;
  unitShort: string;
  unitLong: string;
}

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
  extendedIngredients: SpoonacularApiExtendedIngredient[];
}

export interface ExtendedIngredient {
  id: number;
  name: string;
  image: string | null;
  amount: number;
  unit: string;
  original?: string;
}

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
  extendedIngredients: ExtendedIngredient[];
}

export interface SpoonacularComplexSearchResponse {
  results: SpoonacularApiRecipe[];
  offset: number;
  number: number;
  totalResults: number;
}

export interface PaginatedRecipesResponse {
  recipes: Recipe[];
  totalResults: number;
  query?: string;
  category?: string;
  page?: number;
  itemsPerPage?: number;
}

export interface SearchedRecipe {
  id: number;
  title?: string;
}
