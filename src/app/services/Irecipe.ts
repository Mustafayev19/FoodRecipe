
export interface Recipe {
    id: number
    title: string;
    image: string;
    cheap: boolean;
    healthScore: number;
    instructions: string;
    readyInMinutes: number;
    sourceUrl: string;
    extendedIngredients: ExtendedIngredient[];
}
export interface ExtendedIngredient {
    name: string;
    image: string;
    amount: number;
}
export interface randomJoke {
    text: string
}
export interface SearchedRecipe {
    id: number

}



