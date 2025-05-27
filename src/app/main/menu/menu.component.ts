import { Component, OnInit, OnDestroy } from '@angular/core';
import { RecipeService } from 'src/app/services/recipe.service';

@Component({
  selector: 'menu',
  templateUrl: './menu.component.html',
  // styleUrls: ['./menu.component.css'] // Əgər bu fayl varsa və istifadə edirsinizsə, şərhdən çıxarın
})
export class MenuComponent implements OnInit, OnDestroy {
  menuList: string[] = [
    "main course", "side dish", "dessert", "appetizer", "salad", "bread",
    "breakfast", "soup", "beverage", "sauce", "marinade", "drink",
    "fingerfood", "snack"
  ];

  currentCategory: string | null = null;

  constructor(private recipeService: RecipeService) {
    this.menuList = [...new Set(this.menuList.map(item => item.toLowerCase()))].sort();
  }

  ngOnInit(): void {
    // Bu komponentin ngOnInit-də xüsusi bir yükləmə və ya abunəlik məntiqinə ehtiyacı yoxdur.
  }

  selectCategory(category: string): void {
    const lowerCaseCategory = category.toLowerCase();
    this.currentCategory = lowerCaseCategory;

    // RecipeService-dəki getRecipesByCategory metodunu çağırırıq.
    // Bu metod, seçilmiş kateqoriya üçün ilk səhifənin məlumatlarını yükləyəcək
    // və nəticəni öz daxilindəki searchedMenuRecipes$ BehaviorSubject-inə ötürəcək.
    // MainComponent bu dəyişikliyi qəbul edib göstərəcək.
    this.recipeService.getRecipesByCategory(this.currentCategory);
  }

  isActiveCategory(category: string): boolean {
    return this.currentCategory === category.toLowerCase();
  }
  clearCurrentCategorySelection(): void {
    this.currentCategory = null; // Yan panelde aktiv kateqoriya seçimini vizual olaraq ləğv edir
    // routerLink="/main" artıq MainComponent-in yenidən yüklənməsini və
    // loadInitialRecipes() metodunun çağırılmasını təmin edəcək.
    // Bu da MainComponent-in currentDisplayMode-unu 'random'-a dəyişəcək.
    // RecipeService-ə xüsusi bir "təmizləmə" siqnalı göndərməyə ehtiyac yoxdur,
    // çünki MainComponent yeni vəziyyəti özü idarə edəcək.
    console.log('Category selection cleared, navigating to main.');
  }

  ngOnDestroy(): void {
    // Bu komponentdə birbaşa idarə olunan RxJS abunəlikləri olmadığı üçün,
    // ngOnDestroy içində xüsusi bir unsubscribe məntiqinə ehtiyac yoxdur.
  }
}