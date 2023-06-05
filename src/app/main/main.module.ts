import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadLineComponent } from './head-line/head-line.component';
import { MainComponent } from './main/main.component';
import { ServicesModule } from '../services/services.module';
import { RecipeDetailComponent } from './recipe-detail/recipe-detail.component';
import { MenuComponent } from './menu/menu.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    HeadLineComponent,
    MenuComponent,
    MainComponent,
    RecipeDetailComponent,


  ],
  imports: [
    CommonModule,
    ServicesModule,
    RouterModule
  ],
  exports: [HeadLineComponent, MainComponent, MenuComponent, RecipeDetailComponent]
})
export class MainModule { }
