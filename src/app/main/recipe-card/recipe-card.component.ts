import { Component, Input } from '@angular/core';
import { Recipe } from 'src/app/interfaces/Irecipe';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  // styleUrls: ['./recipe-card.component.css'] // Əgər xüsusi stillər varsa
})
export class RecipeCardComponent {
  @Input() recipe!: Recipe; // Definite assignment assertion

  constructor() {}

  // Təlimatların qısa bir hissəsini təhlükəsiz göstərmək üçün köməkçi metod
  getInstructionSnippet(
    instructions: string | null | undefined,
    maxLength: number = 100
  ): string {
    if (!instructions) return 'No instructions available.';
    // HTML teqlərini təmizləmək üçün sadə bir üsul (daha mürəkkəb təmizləmə üçün kitabxana istifadə edilə bilər)
    const plainText = instructions
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength).trim() + '...';
  }
}
