import { Component, Input } from '@angular/core';
import { Recipe } from 'src/app/interfaces/Irecipe';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.css'],
})
export class RecipeCardComponent {
  @Input() recipe!: Recipe;

  constructor() {}

  getInstructionSnippet(
    instructions: string | null | undefined,
    maxLength: number = 100
  ): string {
    if (!instructions) return 'No instructions available.';
    const plainText = instructions
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength).trim() + '...';
  }
}
