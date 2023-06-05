
export interface Recipe {
    id: number
    title: string;
    image: string;
    cheap: boolean;
    healthScore: number;
    instructions: string;
    summary: string;
    readyInMinutes: number;
    sourceUrl: string;
}
export interface ExtendedIngredient {
    name: string;
    image: string;
}

export interface RecipeId {
    title: string;
    image: string;
    Vegeterian: boolean;
    vegan: boolean;
    healthScore: number;
    readyInMinutes: number;
    sourceUrl: string;
    price: string;
    instructions: string;
    extendedIngredients: ExtendedIngredient[];
}

