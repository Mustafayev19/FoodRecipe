import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main/main.component';
import { RecipeDetailComponent } from './main/recipe-detail/recipe-detail.component';

const routes: Routes = [
  { path: "main", component: MainComponent },
  { path: "recipe-detail/:id", component: RecipeDetailComponent },
  { path: "", redirectTo: '/main', pathMatch: 'full' },
  { path: "**", redirectTo: '/main' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
