import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { RecipeService } from 'src/app/services/recipe.service'; // Düzgün yolu yoxlayın
// Artıq Recipe, SearchedRecipe, forkJoin, Subscription kimi importlara
// HeadLineComponent daxilində birbaşa ehtiyac yoxdur.

@Component({
  selector: 'head-line',
  templateUrl: './head-line.component.html',
  // styleUrls: ['./head-line.component.css'] // Əgər Tailwind xaricində xüsusi stilləriniz varsa
})
export class HeadLineComponent implements OnInit, OnDestroy {
  @Output() toggleMobileMenu = new EventEmitter<void>();

  mobileSearchActive = false; // Mobil axtarış inputunun görünüşünü idarə edir

  // Lokal dəyişənlərə (idsFromSearch, localSearchedRecipes) və
  // recipeServiceSubscription-a artıq ehtiyac yoxdur.

  constructor(private recipeService: RecipeService) { }

  ngOnInit() {
    // ngOnInit içində RecipeService-in searchedRecipes observable-na birbaşa abunəliyə ehtiyac yoxdur,
    // çünki nəticələrin göstərilməsi MainComponent tərəfindən idarə olunur.
  }

  performSearch(query: string): void {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      // Axtarış sorğusu boşdursa, RecipeService-dəki searchedRecipes$ observable-nı
      // təmizləmək (null və ya boş PaginatedRecipesResponse ilə .next() etmək) olar.
      // Bu, MainComponent-in "boş axtarış" vəziyyətini göstərməsinə imkan verər.
      // Məsələn, RecipeService-də belə bir metod ola bilər: this.recipeService.clearSearchResults();
      // Və ya birbaşa null emit edə bilərik (əgər servisdə belə bir funksiya varsa):
      // this.recipeService.searchedRecipes$.next(null); 
      // Yaxud da, istifadəçi boş axtarış etdikdə, random reseptlərə qayıtmaq üçün MainComponent-də məntiq ola bilər.
      // Hələlik, sadəcə konsola mesaj çıxaraq və servis metodunu çağırmayaq.
      console.log('Search query is empty.');
      // Opsional: Aktiv axtarış nəticələrini təmizləmək üçün servisə müraciət.
      // this.recipeService.clearSearchResults(); // Bu metod RecipeService-də yaradılmalıdır.
      return;
    }

    console.log('Performing search in HeadLineComponent for:', trimmedQuery);

    // RecipeService-dəki searchRecipes metodunu çağırırıq.
    // Bu metod API-yə sorğu göndərəcək (default olaraq ilk səhifə üçün, yəni offset=0)
    // və nəticəni öz daxilindəki searchedRecipes$ BehaviorSubject-inə .next() edəcək.
    // MainComponent bu BehaviorSubject-ə abunə olduğu üçün yeni məlumatları alacaq.
    // MainComponent həmçinin currentPage-i 1-ə sıfırlayacaq, çünki yeni bir axtarış edilib.
    this.recipeService.searchRecipes(trimmedQuery /*, offset, pageSize - bunlar MainComponent tərəfindən idarə olunur */);

    // Mobil axtarış aktiv idisə, axtarışdan sonra onu bağlaya bilərik
    if (this.mobileSearchActive) {
      this.toggleMobileSearch();
    }
  }

  toggleMobileSearch(): void {
    this.mobileSearchActive = !this.mobileSearchActive;
  }

  ngOnDestroy(): void {
    // Bu komponentdə birbaşa idarə olunan RxJS abunəlikləri olmadığı üçün,
    // ngOnDestroy içində xüsusi bir unsubscribe məntiqinə ehtiyac yoxdur.
  }
}