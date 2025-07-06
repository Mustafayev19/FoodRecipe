import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router'; // Router import edilir

@Component({
  selector: 'head-line',
  templateUrl: './head-line.component.html',
  styleUrls: ['./head-line.component.css'],
})
export class HeadLineComponent {
  @Output() toggleMobileMenu = new EventEmitter<void>();

  mobileSearchActive = false;

  constructor(private router: Router) {} // RecipeService silinir, Router əlavə edilir

  performSearch(query: string): void {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      return;
    }

    // RecipeService çağırışı əvəzinə Router ilə yönləndirmə edilir
    this.router.navigate(['/'], { queryParams: { search: trimmedQuery } });

    if (this.mobileSearchActive) {
      this.toggleMobileSearch();
    }
  }

  toggleMobileSearch(): void {
    this.mobileSearchActive = !this.mobileSearchActive;
  }
}
