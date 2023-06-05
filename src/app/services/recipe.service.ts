import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { ExtendedIngredient, Recipe, RecipeId } from './Irecipe';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  randomRecipeUrl = 'https://api.spoonacular.com/recipes/random?'; // random recipes
  imageUrl: string = "https://spoonacular.com/cdn/ingredients_100x100/" // +Image.jpg
  recipeUrl: string = "https://api.spoonacular.com/recipes/"//Recipe with Id
  apiKey: string = "2411f54aa6a44458a36089857f47254c"

  constructor(private http: HttpClient) { }

  getImageUrl(imageName: string): Observable<string> {
    const imageUrl = `https://spoonacular.com/cdn/ingredients_100x100/${imageName}?apiKey=${this.apiKey}`;
    return of(imageUrl); // Örnek olarak, hemen tamamlandı diyelim (of operatörü ile bir Observable döndürüyoruz)
  }

  // getRandomRecipes
  getRandomRecipes(rendomRecipeNumber: number): Observable<Recipe[]> {
    return this.http.get<any>(`${this.randomRecipeUrl}&apiKey=${this.apiKey}&number=${rendomRecipeNumber}`).pipe(
      map(response => response.recipes.map((data: any) => this.mapToRandomRecipe(data)))
    );
  }
  private mapToRandomRecipe(data: any): Recipe {
    return {
      id: data.id,
      cheap: data.cheap,
      healthScore: data.healthScore,
      title: data.title,
      sourceUrl: data.sourceUrl,
      image: data.image,
      instructions: data.instructions,
      summary: data.summary,
      readyInMinutes: data.readyInMinutes
    };
  }
  // getRecipeById
  getRecipeById(id: number): Observable<RecipeId> {
    return this.http.get<any>(`${this.recipeUrl}${id}/information?apiKey=${this.apiKey}`).pipe(
      map((response: any) => this.mapToRecipe(response))
    );
  }

  private mapToRecipe(data: any): RecipeId {
    const extendedIngredients: ExtendedIngredient[] = data.extendedIngredients.map((ingredient: any) => ({
      name: ingredient.name,
      image: ingredient.image
    }));

    const recipeId: RecipeId = {
      title: data.title,
      image: data.image,
      Vegeterian: data.Vegeterian,
      vegan: data.vegan,
      healthScore: data.healthScore,
      readyInMinutes: data.readyInMinutes,
      sourceUrl: data.sourceUrl,
      price: data.price,
      instructions: data.instructions,
      extendedIngredients: extendedIngredients
    };

    return recipeId;
  }





}
