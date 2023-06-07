import { Component, OnInit } from '@angular/core';
import { Recipe, SearchedRecipe } from 'src/app/services/Irecipe';
import { RecipeService } from 'src/app/services/recipe.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'head-line',
  templateUrl: './head-line.component.html',
  styleUrls: ['./head-line.component.css']
})
export class HeadLineComponent implements OnInit {
  search: boolean = false;
  searchedRecipes: Recipe[] = [];
  Ids: SearchedRecipe[] = [];

  constructor(private recipeService: RecipeService) { }

  ngOnInit() {
    this.searchedRecipes = this.recipeService.searchedRecipes.getValue();
  }

  getRecipeIds(query: string) {
    this.recipeService.getSearchedRecipes(query).subscribe(response => {
      this.Ids = response;
      this.getRecipesByIds();
    });
  }

  getRecipesByIds() {
    const recipeObservables = this.Ids.map(searchedRecipe => this.recipeService.getRecipeById(searchedRecipe.id));
    forkJoin(recipeObservables).subscribe(recipes => {
      this.searchedRecipes = recipes;
      this.recipeService.searchedRecipes.next(this.searchedRecipes); // Değişikliği bildir
    });
  }

  issearch(): void {
    this.search = !this.search;
  }
}
