import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadLineComponent } from './head-line/head-line.component';



@NgModule({
  declarations: [
    HeadLineComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [HeadLineComponent]
})
export class MainModule { }
