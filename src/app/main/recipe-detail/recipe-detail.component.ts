import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeId } from 'src/app/services/Irecipe';
import { RecipeService } from 'src/app/services/recipe.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipeById!: RecipeId;
  id!: number;
  imageUrls: string[] = [];

  constructor(
    private recipeService: RecipeService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.getRecipeById(this.id);
  }

  getRecipeById(id: number): void {
    this.recipeService.getRecipeById(id).subscribe(response => {
      this.recipeById = response;
      this.loadIngredientImages();
    });
  }

  loadIngredientImages(): void {
    const requests = this.recipeById.extendedIngredients.map(ingredient => this.recipeService.getImageUrl(ingredient.image));
    forkJoin(requests).subscribe(imageUrls => {
      this.imageUrls = imageUrls;
    });
  }
}
