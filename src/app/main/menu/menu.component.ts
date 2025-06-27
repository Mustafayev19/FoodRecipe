import { Component } from '@angular/core';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  menuList: string[] = [
    'main course',
    'side dish',
    'dessert',
    'appetizer',
    'salad',
    'bread',
    'breakfast',
    'soup',
    'beverage',
    'sauce',
    'marinade',
    'drink',
    'fingerfood',
    'snack',
  ];

  currentCategory: string | null = null;

  constructor(private recipeService: RecipeService) {
    this.menuList = [
      ...new Set(this.menuList.map((item) => item.toLowerCase())),
    ].sort();
  }

  selectCategory(category: string): void {
    const lowerCaseCategory = category.toLowerCase();
    this.currentCategory = lowerCaseCategory;

    this.recipeService.getRecipesByCategory(this.currentCategory);
  }

  isActiveCategory(category: string): boolean {
    return this.currentCategory === category.toLowerCase();
  }
  clearCurrentCategorySelection(): void {
    this.currentCategory = null;
  }
}
