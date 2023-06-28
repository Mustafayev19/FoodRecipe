import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { ExtendedIngredient, Recipe, SearchedRecipe, randomJoke } from './Irecipe';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  randomRecipeUrl = 'https://api.spoonacular.com/recipes/random?'; // random recipes
  imageUrl: string = "https://spoonacular.com/cdn/ingredients_100x100/" // +Image.jpg
  recipeUrl: string = "https://api.spoonacular.com/recipes/"//Recipe with Id
  searchRecipeUrl: string = 'https://api.spoonacular.com/recipes/autocomplete?number=9&query=';//search recipes
  randomJokeUrl: string = "https://api.spoonacular.com/food/jokes/random"//random jokes
  menuSearchesUrl: string = "https://api.spoonacular.com/recipes/complexSearch"//menu searches
  apiKey: string = "2411f54aa6a44458a36089857f47254c"

  constructor(private http: HttpClient) { }

  getMenuSearches(type: string): Observable<SearchedRecipe[]> {
    return this.http.get<any>(`${this.menuSearchesUrl}?type=${type}&apiKey=${this.apiKey}`)
      .pipe(
        map(response => response.results.map((data: any) => this.mapSearchedRecipe(data)))
      );
  }

  // get searched recipes
  getSearchedRecipes(query: string): Observable<SearchedRecipe[]> {
    return this.http.get<any>(`${this.searchRecipeUrl}${query}&apiKey=${this.apiKey}`).pipe(
      map(response => response.map((data: any) => this.mapSearchedRecipe(data)))
    );
  }

  private mapSearchedRecipe(data: any): SearchedRecipe {
    return {
      id: data.id,
    };
  }
  searchedRecipes: BehaviorSubject<Recipe[]> = new BehaviorSubject<Recipe[]>([]);
  searchedMenuRecipes: BehaviorSubject<Recipe[]> = new BehaviorSubject<Recipe[]>([]);


  setSearchedRecipes(recipes: Recipe[]) {
    this.searchedRecipes.next(recipes);
  }

  setSearchedMenuRecipes(recipes: Recipe[]) {
    this.searchedMenuRecipes.next(recipes);
  }

  // getImage
  getImageUrl(imageName: string): Observable<string> {
    const imageUrl = `https://spoonacular.com/cdn/ingredients_100x100/${imageName}?apiKey=${this.apiKey}`;
    return of(imageUrl);
  }

  // getRandomRecipes
  getRandomRecipes(randomRecipeNumber: number): Observable<Recipe[]> {
    return this.http.get<any>(`${this.randomRecipeUrl}&apiKey=${this.apiKey}&number=${randomRecipeNumber}`).pipe(
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
      readyInMinutes: data.readyInMinutes,
      extendedIngredients: data.extendedIngredients
    };
  }
  // getRecipeById
  getRecipeById(id: number): Observable<Recipe> {
    return this.http.get<any>(`${this.recipeUrl}${id}/information?apiKey=${this.apiKey}`).pipe(
      map((response: any) => this.mapToRecipe(response))
    );
  }


  private mapToRecipe(data: any): Recipe {
    const extendedIngredients: ExtendedIngredient[] = data.extendedIngredients.map((ingredient: any) => ({
      name: ingredient.name,
      image: ingredient.image,
      amount: ingredient.amount
    }));

    const recipe: Recipe = {
      cheap: data.cheap,
      id: data.id,
      title: data.title,
      image: data.image,
      healthScore: data.healthScore,
      readyInMinutes: data.readyInMinutes,
      sourceUrl: data.sourceUrl,
      instructions: data.instructions,
      extendedIngredients: extendedIngredients
    };

    return recipe;
  }
  getRandomJoke(): Observable<randomJoke> {
    return this.http.get<any>(`${this.randomJokeUrl}?apiKey=${this.apiKey}`).pipe(map((response: any) => this.mapToRandomJoke(response)))
  }
  private mapToRandomJoke(data: any) {
    const randomJoke: randomJoke = {
      text: data.text
    }
    return randomJoke
  }
}
