import { Component, EventEmitter, Output } from '@angular/core';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'head-line',
  templateUrl: './head-line.component.html',
  styleUrls: ['./head-line.component.css'],
})
export class HeadLineComponent {
  @Output() toggleMobileMenu = new EventEmitter<void>();

  mobileSearchActive = false;

  constructor(private recipeService: RecipeService) {}

  performSearch(query: string): void {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      return;
    }

    this.recipeService.searchRecipes(trimmedQuery);
    if (this.mobileSearchActive) {
      this.toggleMobileSearch();
    }
  }

  toggleMobileSearch(): void {
    this.mobileSearchActive = !this.mobileSearchActive;
  }
}
