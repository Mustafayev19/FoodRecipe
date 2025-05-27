import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  Recipe,
  ExtendedIngredient, // Bu, mapToAppExtendedIngredient-də istifadə olunur
  SpoonacularApiRecipe,
  SpoonacularComplexSearchResponse,
  PaginatedRecipesResponse,
  SpoonacularApiExtendedIngredient, // Bu, mapToAppRecipe-də istifadə olunur
} from '../interfaces/Irecipe'; // Import yolunuz './Irecipe' idi, əgər fərqlidirsə düzəldin

import { environment } from '../../environments/environment'; // <--- API AÇARI ÜÇÜN BUNU ƏLAVƏ EDİRİK

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  // Bütün URL-lər artıq HTTPS istifadə edir, bu əladır.
  private baseUrl = 'https://api.spoonacular.com/recipes';

  // API açarı artıq environment faylından gələcək
  // private apiKey: string = '2411f54aa6a44458a36089857f47254c'; // <--- BU SƏTRİ SİLİRİK
  private apiKey: string = environment.spoonacularApiKey; // <--- BUNUNLA ƏVƏZ EDİRİK

  public searchedRecipes$ =
    new BehaviorSubject<PaginatedRecipesResponse | null>(null);
  public searchedMenuRecipes$ =
    new BehaviorSubject<PaginatedRecipesResponse | null>(null);
  public randomRecipes$ = new BehaviorSubject<PaginatedRecipesResponse | null>(
    null
  );

  constructor(private http: HttpClient) {}

  // Başlıqdakı axtarış üçün
  public searchRecipes(
    query: string,
    offset: number = 0,
    pageSize: number = 12
  ): void {
    const params = new HttpParams()
      .set('apiKey', this.apiKey) // Artıq environment-dən gələn açarı istifadə edəcək
      .set('query', query)
      .set('addRecipeInformation', 'true')
      .set('fillIngredients', 'true')
      .set('number', pageSize.toString())
      .set('offset', offset.toString());

    this.http
      .get<SpoonacularComplexSearchResponse>(`${this.baseUrl}/complexSearch`, {
        params,
      })
      .pipe(
        map(
          (
            response: SpoonacularComplexSearchResponse
          ): PaginatedRecipesResponse => ({
            recipes: response.results.map((apiRecipe) =>
              this.mapToAppRecipe(apiRecipe)
            ),
            totalResults: response.totalResults,
            query: query,
            page: offset / pageSize + 1,
            itemsPerPage: pageSize,
          })
        ),
        catchError((error) => {
          console.error('Error searching recipes:', error);
          this.searchedRecipes$.next(null);
          return of(null);
        })
      )
      .subscribe((paginatedResponse) => {
        if (paginatedResponse) {
          this.searchedRecipes$.next(paginatedResponse);
        }
      });
  }

  // Menyudan kateqoriya seçimi üçün
  public getRecipesByCategory(
    category: string,
    offset: number = 0,
    pageSize: number = 12
  ): void {
    const params = new HttpParams()
      .set('apiKey', this.apiKey) // Artıq environment-dən gələn açarı istifadə edəcək
      .set('type', category.toLowerCase())
      .set('addRecipeInformation', 'true')
      .set('fillIngredients', 'true')
      .set('number', pageSize.toString())
      .set('offset', offset.toString());

    this.http
      .get<SpoonacularComplexSearchResponse>(`${this.baseUrl}/complexSearch`, {
        params,
      })
      .pipe(
        map(
          (
            response: SpoonacularComplexSearchResponse
          ): PaginatedRecipesResponse => ({
            recipes: response.results.map((apiRecipe) =>
              this.mapToAppRecipe(apiRecipe)
            ),
            totalResults: response.totalResults,
            category: category,
            page: offset / pageSize + 1,
            itemsPerPage: pageSize,
          })
        ),
        catchError((error) => {
          console.error(
            `Error fetching recipes for category "${category}":`,
            error
          );
          this.searchedMenuRecipes$.next(null);
          return of(null);
        })
      )
      .subscribe((paginatedResponse) => {
        if (paginatedResponse) {
          this.searchedMenuRecipes$.next(paginatedResponse);
        }
      });
  }

  // Təsadüfi/Əsas səhifə reseptləri üçün
  public getRandomRecipes(pageSize: number = 12, offset: number = 0): void {
    const params = new HttpParams()
      .set('apiKey', this.apiKey) // Artıq environment-dən gələn açarı istifadə edəcək
      .set('sort', 'popularity')
      .set('sortDirection', 'desc')
      .set('addRecipeInformation', 'true')
      .set('fillIngredients', 'true')
      .set('number', pageSize.toString())
      .set('offset', offset.toString());

    this.http
      .get<SpoonacularComplexSearchResponse>(`${this.baseUrl}/complexSearch`, {
        params,
      })
      .pipe(
        map(
          (
            response: SpoonacularComplexSearchResponse
          ): PaginatedRecipesResponse => ({
            recipes: response.results.map((apiRecipe) =>
              this.mapToAppRecipe(apiRecipe)
            ),
            totalResults: response.totalResults,
            page: offset / pageSize + 1,
            itemsPerPage: pageSize,
          })
        ),
        catchError((error) => {
          console.error('Error fetching featured recipes:', error);
          this.randomRecipes$.next(null);
          return of(null);
        })
      )
      .subscribe((paginatedResponse) => {
        if (paginatedResponse) {
          this.randomRecipes$.next(paginatedResponse);
        }
      });
  }

  // ID ilə tək resept almaq
  public getRecipeById(id: number): Observable<Recipe | null> {
    const params = new HttpParams()
      .set('apiKey', this.apiKey) // Artıq environment-dən gələn açarı istifadə edəcək
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

  // İnqredient şəkil URL-i (API açarı olmadan və birbaşa string qaytarır)
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

  // Mapper metodları
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
