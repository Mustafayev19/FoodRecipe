import { Component, OnInit, OnDestroy } from '@angular/core';
import { RecipeService } from 'src/app/services/recipe.service';
import { Subscription } from 'rxjs';
import { PaginatedRecipesResponse, Recipe } from 'src/app/interfaces/Irecipe';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit, OnDestroy {
  recipesToDisplay: Recipe[] = [];
  pageTitle: string = 'Discover Recipes';
  isLoading: boolean = false;
  currentDisplayMode: 'random' | 'search' | 'menu' = 'random';

  // Pagination properties
  itemsPerPage: number = 12;
  currentPage: number = 1;
  totalResults: number = 0;
  public readonly Math = Math;
  private lastSearchQuery: string | null = null;
  private lastSelectedCategory: string | null = null;

  private subscriptions = new Subscription();

  constructor(private recipeService: RecipeService) {}

  ngOnInit() {
    this.loadInitialRecipes();

    this.subscriptions.add(
      this.recipeService.searchedRecipes$.subscribe(
        (response: PaginatedRecipesResponse | null) => {
          this.isLoading = true;
          if (response) {
            this.recipesToDisplay = response.recipes;
            this.totalResults = response.totalResults;
            this.currentPage = response.page || 1;
            this.itemsPerPage = response.itemsPerPage || this.itemsPerPage;
            this.lastSearchQuery = response.query || null;
            this.pageTitle = response.query
              ? `Search Results for "${response.query}"`
              : 'Search Results';
            this.currentDisplayMode = 'search';
            if (response.recipes.length === 0) {
              this.pageTitle = response.query
                ? `No Results Found for "${response.query}"`
                : 'No Results Found';
            }
          } else if (this.currentDisplayMode === 'search') {
            this.recipesToDisplay = [];
            this.totalResults = 0;
            this.pageTitle = this.lastSearchQuery
              ? `No Results Found for "${this.lastSearchQuery}"`
              : 'No Search Results';
          }
          this.isLoading = false;
        }
      )
    );

    this.subscriptions.add(
      this.recipeService.searchedMenuRecipes$.subscribe(
        (response: PaginatedRecipesResponse | null) => {
          this.isLoading = true;
          if (response) {
            this.recipesToDisplay = response.recipes;
            this.totalResults = response.totalResults;
            this.currentPage = response.page || 1;
            this.itemsPerPage = response.itemsPerPage || this.itemsPerPage;
            this.lastSelectedCategory = response.category || null;
            this.pageTitle = response.category
              ? `Category: ${this.capitalizeFirstLetter(response.category)}`
              : 'Category Results';
            this.currentDisplayMode = 'menu';
            if (response.recipes.length === 0) {
              this.pageTitle = response.category
                ? `No Recipes in ${this.capitalizeFirstLetter(
                    response.category
                  )}`
                : 'No Recipes in this Category';
            }
          } else if (this.currentDisplayMode === 'menu') {
            this.recipesToDisplay = [];
            this.totalResults = 0;
            this.pageTitle = this.lastSelectedCategory
              ? `No Recipes in ${this.capitalizeFirstLetter(
                  this.lastSelectedCategory
                )}`
              : 'No Category Results';
          }
          this.isLoading = false;
        }
      )
    );
  }

  loadInitialRecipes(page: number = 1): void {
    this.isLoading = true;
    this.currentDisplayMode = 'random';
    this.currentPage = page;
    const offset = (this.currentPage - 1) * this.itemsPerPage;

    this.subscriptions.add(
      this.recipeService.randomRecipes$.subscribe(
        (response: PaginatedRecipesResponse | null) => {
          this.isLoading = true; // Will be set to false when data arrives or fails
          if (response) {
            this.recipesToDisplay = response.recipes;
            this.totalResults = response.totalResults;
            this.currentPage = response.page || 1;
            this.itemsPerPage = response.itemsPerPage || this.itemsPerPage;
            this.pageTitle = 'Featured Recipes';
            if (response.recipes.length === 0 && this.currentPage === 1) {
              this.pageTitle = 'No Featured Recipes Available';
            }
          } else if (this.currentDisplayMode === 'random') {
            this.recipesToDisplay = [];
            this.totalResults = 0;
            this.pageTitle = 'Could Not Load Featured Recipes';
          }
          this.isLoading = false;
        }
      )
    );
    this.recipeService.getRandomRecipes(this.itemsPerPage, offset);
  }

  onPageChange(page: number | string): void {
    // Səhifə nömrəsi string ('...') də ola bilər deyə, amma biz onu number-ə çevirəcəyik
    const pageNumber = +page; // string-i number-ə çevirir; '...' NaN olacaq
    if (
      isNaN(pageNumber) ||
      pageNumber < 1 ||
      pageNumber > this.totalPages ||
      pageNumber === this.currentPage ||
      this.isLoading
    ) {
      return;
    }

    this.currentPage = pageNumber;
    const offset = (this.currentPage - 1) * this.itemsPerPage;

    if (this.currentDisplayMode === 'search' && this.lastSearchQuery) {
      this.recipeService.searchRecipes(
        this.lastSearchQuery,
        offset,
        this.itemsPerPage
      );
    } else if (
      this.currentDisplayMode === 'menu' &&
      this.lastSelectedCategory
    ) {
      this.recipeService.getRecipesByCategory(
        this.lastSelectedCategory,
        offset,
        this.itemsPerPage
      );
    } else if (this.currentDisplayMode === 'random') {
      this.recipeService.getRandomRecipes(this.itemsPerPage, offset);
    }
  }

  get totalPages(): number {
    if (
      !this.totalResults ||
      this.totalResults === 0 ||
      this.itemsPerPage === 0
    )
      return 0;
    return Math.ceil(this.totalResults / this.itemsPerPage);
  }

  // Pagination üçün səhifə nömrələrini generasiya edən metod
  getPaginationPages(): (number | string)[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 1; // Cari səhifədən əvvəl və sonra göstəriləcək səhifə sayı (ümumilikdə 3-5 səhifə göstərmək üçün)
    const range = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    if (total <= 1) {
      // Əgər cəmi 1 səhifə varsa və ya heç yoxdursa, boş array qaytar
      return [];
    }

    range.push(1); // Həmişə ilk səhifəni əlavə et

    let leftBound = Math.max(2, current - delta);
    let rightBound = Math.min(total - 1, current + delta);

    for (let i = leftBound; i <= rightBound; i++) {
      range.push(i);
    }
    range.push(total); // Həmişə son səhifəni əlavə et (əgər 1-dən fərqlidirsə)

    // Unikal və sıralanmış səhifə nömrələrini al
    const uniqueSortedRange = [...new Set(range)].sort((a, b) => a - b);

    for (let i of uniqueSortedRange) {
      if (l !== undefined) {
        if (i - l === 2) {
          // Arada bir səhifə buraxılıbsa
          rangeWithDots.push(l + 1);
        } else if (i - l > 2) {
          // Arada birdən çox səhifə buraxılıbsa
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(i);
      l = i;
    }

    return rangeWithDots;
  }

  capitalizeFirstLetter(string: string | null | undefined): string {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
