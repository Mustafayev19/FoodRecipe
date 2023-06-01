import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { Recipe } from './Irecipe';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  randomRecipeUrl = 'https://api.spoonacular.com/recipes/random?';//random recipes
  imageUrl: string = "https://spoonacular.com/cdn/ingredients_100x100/"//+Image.jpg
  apiKey: string = "2411f54aa6a44458a36089857f47254c"
  constructor(private http: HttpClient) { }


  getRandomRecipe(): Observable<Recipe> {
    return this.http.get<any>(`${this.randomRecipeUrl}&apiKey=${this.apiKey}&number=1`).pipe(
      map(response => this.mapToRandomRecipe(response.recipes[0]))
    );

  }

  private mapToRandomRecipe(data: any): Recipe {
    return {
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
}

