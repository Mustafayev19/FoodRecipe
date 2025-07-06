import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main/main.component';
import { RecipeDetailComponent } from './main/recipe-detail/recipe-detail.component';

const routes: Routes = [
  { path: '', component: MainComponent }, // "main" əvəzinə "" istifadə edirik
  { path: 'recipe-detail/:id', component: RecipeDetailComponent },
  { path: '**', redirectTo: '' }, // Səhv URL olarsa ana səhifəyə yönləndirir
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
