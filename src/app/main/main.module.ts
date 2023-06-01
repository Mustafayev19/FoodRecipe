import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadLineComponent } from './head-line/head-line.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { MainComponent } from './main/main.component';
import { ServicesModule } from '../services/services.module';



@NgModule({
  declarations: [
    HeadLineComponent,
    SidebarComponent,
    MainComponent,

  ],
  imports: [
    CommonModule,
    ServicesModule
  ],
  exports: [HeadLineComponent, MainComponent]
})
export class MainModule { }
