import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  Recipe,
  ExtendedIngredient,
  SpoonacularApiRecipe,
  SpoonacularComplexSearchResponse,
  PaginatedRecipesResponse,
  SpoonacularApiExtendedIngredient,
} from '../interfaces/Irecipe';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private baseUrl = environment.sponacularApi;
  private apiKey: string = environment.spoonacularApiKey;

  public searchedRecipes$ =
    new BehaviorSubject<PaginatedRecipesResponse | null>(null);
  public searchedMenuRecipes$ =
    new BehaviorSubject<PaginatedRecipesResponse | null>(null);
  public randomRecipes$ = new BehaviorSubject<PaginatedRecipesResponse | null>(
    null
  );

  constructor(private http: HttpClient) {}

  public searchRecipes(
    query: string,
    offset: number = 0,
    pageSize: number = 12
  ): void {
    const params = new HttpParams()
      .set('apiKey', this.apiKey)
      .set('query', query)
      .set('addRecipeInformation', 'true')
      .set('fillIngredients', 'true')
      .set('number', pageSize.toString())
      .set('offset', offset.toString());

    this._fetchAndMapRecipes(params, { query }).subscribe(
      (paginatedResponse) => {
        this.searchedRecipes$.next(paginatedResponse);
      }
    );
  }

  public getRecipesByCategory(
    category: string,
    offset: number = 0,
    pageSize: number = 12
  ): void {
    const params = new HttpParams()
      .set('apiKey', this.apiKey)
      .set('type', category.toLowerCase())
      .set('addRecipeInformation', 'true')
      .set('fillIngredients', 'true')
      .set('number', pageSize.toString())
      .set('offset', offset.toString());

    this._fetchAndMapRecipes(params, { category }).subscribe(
      (paginatedResponse) => {
        this.searchedMenuRecipes$.next(paginatedResponse);
      }
    );
  }

  public getRandomRecipes(pageSize: number = 12, offset: number = 0): void {
    const params = new HttpParams()
      .set('apiKey', this.apiKey)
      .set('sort', 'popularity')
      .set('sortDirection', 'desc')
      .set('addRecipeInformation', 'true')
      .set('fillIngredients', 'true')
      .set('number', pageSize.toString())
      .set('offset', offset.toString());

    this._fetchAndMapRecipes(params).subscribe((paginatedResponse) => {
      this.randomRecipes$.next(paginatedResponse);
    });
  }

  public getRecipeById(id: number): Observable<Recipe | null> {
    const params = new HttpParams()
      .set('apiKey', this.apiKey)
      .set('includeNutrition', 'false');

    return this.http
      .get<SpoonacularApiRecipe>(`${this.baseUrl}/${id}/information`, {
        params,
      })
      .pipe(
        map((apiRecipe) => this.mapToAppRecipe(apiRecipe)),
        catchError((error) => {
          console.error(`Error fetching recipe by ID ${id}:`, error);
          return of(null);
        })
      );
  }

  public getIngredientImageUrl(
    imageIdentifier: string | null | undefined
  ): string {
    const placeholder = 'assets/images/placeholder-ingredient.png';
    if (!imageIdentifier) {
      return placeholder;
    }
    if (
      imageIdentifier.startsWith('http://') ||
      imageIdentifier.startsWith('https://')
    ) {
      return imageIdentifier;
    }
    return `https://spoonacular.com/cdn/ingredients_100x100/${imageIdentifier}`;
  }

  private _fetchAndMapRecipes(
    params: HttpParams,
    context: { [key: string]: any } = {}
  ): Observable<PaginatedRecipesResponse | null> {
    return this.http
      .get<SpoonacularComplexSearchResponse>(`${this.baseUrl}/complexSearch`, {
        params,
      })
      .pipe(
        map(
          (response): PaginatedRecipesResponse => ({
            recipes: response.results.map((apiRecipe) =>
              this.mapToAppRecipe(apiRecipe)
            ),
            totalResults: response.totalResults,
            page: response.offset / response.number + 1,
            itemsPerPage: response.number,
            ...context,
          })
        ),
        catchError((error) => {
          console.error('Error fetching recipes:', error);
          return of(null);
        })
      );
  }

  private mapToAppRecipe(apiRecipe: SpoonacularApiRecipe): Recipe {
    return {
      id: apiRecipe.id,
      title: apiRecipe.title,
      image: apiRecipe.image,
      cheap: apiRecipe.cheap,
      healthScore: apiRecipe.healthScore,
      instructions: apiRecipe.instructions,
      readyInMinutes: apiRecipe.readyInMinutes,
      sourceUrl: apiRecipe.sourceUrl,
      summary: apiRecipe.summary,
      servings: apiRecipe.servings,
      dishTypes: apiRecipe.dishTypes,
      vegetarian: apiRecipe.vegetarian,
      vegan: apiRecipe.vegan,
      glutenFree: apiRecipe.glutenFree,
      dairyFree: apiRecipe.dairyFree,
      extendedIngredients:
        apiRecipe.extendedIngredients?.map((apiIng) =>
          this.mapToAppExtendedIngredient(apiIng)
        ) || [],
    };
  }

  private mapToAppExtendedIngredient(
    apiIngredient: SpoonacularApiExtendedIngredient
  ): ExtendedIngredient {
    return {
      id: apiIngredient.id,
      name: apiIngredient.nameClean || apiIngredient.name,
      image: this.getIngredientImageUrl(apiIngredient.image),
      amount: apiIngredient.amount,
      unit: apiIngredient.unit,
      original: apiIngredient.original,
    };
  }
}
