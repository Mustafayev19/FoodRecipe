import { Component, OnInit, OnDestroy } from '@angular/core';
import { RecipeService } from 'src/app/services/recipe.service';
import { Subscription } from 'rxjs';
import { PaginatedRecipesResponse, Recipe } from 'src/app/interfaces/Irecipe';
import { ActivatedRoute, Router } from '@angular/router';

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

  itemsPerPage: number = 12;
  currentPage: number = 1;
  totalResults: number = 0;
  public readonly Math = Math;
  private lastSearchQuery: string | null = null;
  private lastSelectedCategory: string | null = null;

  private subscriptions = new Subscription();

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute, // ActivatedRoute əlavə edilir
    private router: Router // Router əlavə edilir
  ) {}

  ngOnInit() {
    // URL-dəki parametrlərə (search, category, page) qulaq asırıq
    this.subscriptions.add(
      this.route.queryParams.subscribe((params) => {
        this.isLoading = true;
        const page = params['page'] ? +params['page'] : 1;
        const offset = (page - 1) * this.itemsPerPage;

        if (params['search']) {
          this.currentDisplayMode = 'search';
          this.lastSearchQuery = params['search'];
          this.lastSelectedCategory = null; // Kateqoriyanı sıfırlayırıq
          this.recipeService.searchRecipes(
            params['search'],
            offset,
            this.itemsPerPage
          );
        } else if (params['category']) {
          this.currentDisplayMode = 'menu';
          this.lastSelectedCategory = params['category'];
          this.lastSearchQuery = null; // Axtarışı sıfırlayırıq
          this.recipeService.getRecipesByCategory(
            params['category'],
            offset,
            this.itemsPerPage
          );
        } else {
          this.currentDisplayMode = 'random';
          this.lastSearchQuery = null;
          this.lastSelectedCategory = null;
          this.recipeService.getRandomRecipes(this.itemsPerPage, offset);
        }
      })
    );

    // Servisdən gələn cavablara qulaq asmağa davam edirik
    this.listenForRecipeUpdates();
  }

  listenForRecipeUpdates(): void {
    // Axtarış nəticələri
    this.subscriptions.add(
      this.recipeService.searchedRecipes$.subscribe((response) => {
        if (this.currentDisplayMode !== 'search' || !response) return;
        this.handleResponse(
          response,
          `Search Results for "${response.query}"`,
          `No Results Found for "${response.query}"`
        );
      })
    );

    // Kateqoriya nəticələri
    this.subscriptions.add(
      this.recipeService.searchedMenuRecipes$.subscribe((response) => {
        if (this.currentDisplayMode !== 'menu' || !response) return;
        this.handleResponse(
          response,
          `Category: ${this.capitalizeFirstLetter(response.category)}`,
          `No Recipes in ${this.capitalizeFirstLetter(response.category)}`
        );
      })
    );

    // Təsadüfi reseptlər
    this.subscriptions.add(
      this.recipeService.randomRecipes$.subscribe((response) => {
        if (this.currentDisplayMode !== 'random' || !response) return;
        this.handleResponse(
          response,
          'Featured Recipes',
          'No Featured Recipes Available'
        );
      })
    );
  }

  handleResponse(
    response: PaginatedRecipesResponse,
    successTitle: string,
    noResultsTitle: string
  ): void {
    this.recipesToDisplay = response.recipes;
    this.totalResults = response.totalResults;
    this.currentPage = response.page || 1;
    this.itemsPerPage = response.itemsPerPage || this.itemsPerPage;
    this.pageTitle =
      response.recipes.length > 0 ? successTitle : noResultsTitle;
    this.isLoading = false;
  }

  onPageChange(page: number | string): void {
    const pageNumber = +page;
    if (
      isNaN(pageNumber) ||
      pageNumber < 1 ||
      pageNumber > this.totalPages ||
      pageNumber === this.currentPage
    ) {
      return;
    }

    // Səhifəni dəyişmək üçün sadəcə URL-i yeniləyirik
    // ngOnInit-dəki subscription dəyişikliyi tutub datanı avtomatik yeniləyəcək
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page: pageNumber },
      queryParamsHandling: 'merge', // Digər parametrləri (search/category) qoruyur
    });
  }

  // get totalPages(), getPaginationPages(), capitalizeFirstLetter() metodları olduğu kimi qalır...

  get totalPages(): number {
    if (
      !this.totalResults ||
      this.totalResults === 0 ||
      this.itemsPerPage === 0
    )
      return 0;
    return Math.ceil(this.totalResults / this.itemsPerPage);
  }

  getPaginationPages(): (number | string)[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 1;
    const range = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;
    if (total <= 1) {
      return [];
    }
    range.push(1);
    let leftBound = Math.max(2, current - delta);
    let rightBound = Math.min(total - 1, current + delta);
    for (let i = leftBound; i <= rightBound; i++) {
      range.push(i);
    }
    range.push(total);
    const uniqueSortedRange = [...new Set(range)].sort((a, b) => a - b);
    for (let i of uniqueSortedRange) {
      if (l !== undefined) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l > 2) {
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
