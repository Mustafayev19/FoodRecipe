// recipe-detail.component.ts (Sadələşdirilmiş)
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from 'src/app/services/recipe.service';
import { Subscription, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Recipe } from 'src/app/interfaces/Irecipe';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  // styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  recipe: Recipe | null = null;
  // ingredientImageUrls massivi və loadIngredientImages metodu artıq lazım deyil
  isLoading: boolean = true;
  errorLoading: string | null = null;

  private subscriptions = new Subscription();

  constructor(
    private recipeService: RecipeService,
    private activatedRoute: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private router: Router
  ) {}

  ngOnInit(): void {
    const routeSub = this.activatedRoute.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        const recipeId = +idParam;
        if (isNaN(recipeId)) {
          this.handleErrorState('Invalid Recipe ID format.');
        } else {
          this.getRecipeDetails(recipeId);
        }
      } else {
        this.handleErrorState('Recipe ID not provided in URL.');
      }
    });
    this.subscriptions.add(routeSub);
  }

  private handleErrorState(message: string): void {
    this.isLoading = false;
    this.errorLoading = message;
    this.recipe = null;
  }

  getRecipeDetails(id: number): void {
    this.isLoading = true;
    this.errorLoading = null;
    this.recipe = null;

    const recipeSub = this.recipeService
      .getRecipeById(id)
      .pipe(
        catchError((err) => {
          console.error('Error fetching recipe details:', err);
          this.handleErrorState(
            'Could not load recipe details. Please try again later.'
          );
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response) {
          this.recipe = response; // this.recipe.extendedIngredients[i].image artıq düzgün URL-i saxlayır
        } else if (!this.errorLoading) {
          this.handleErrorState('Recipe not found.');
        }
        this.isLoading = false; // Yüklənməni burada bitiririk
      });
    this.subscriptions.add(recipeSub);
  }

  // loadIngredientImages() metodu tamamilə silindi.

  getSanitizedInstructions(): SafeHtml | string {
    if (this.recipe && this.recipe.instructions) {
      return this.sanitizer.bypassSecurityTrustHtml(this.recipe.instructions);
    }
    return 'No instructions provided for this recipe.';
  }

  // Placeholder şəklini yoxlamaq üçün köməkçi metod (HTML-də istifadə üçün)
  isPlaceholderImage(imageUrl: string | null | undefined): boolean {
    return imageUrl === 'assets/images/placeholder-ingredient.png';
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
