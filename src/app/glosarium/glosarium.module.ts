import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import {NgxPaginationModule} from 'ngx-pagination';

import { IonicModule } from '@ionic/angular';

import { GlosariumComponent } from './glosarium.component';

const routes: Routes = [
  {
    path: '',
    component: GlosariumComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgxPaginationModule,
    RouterModule.forChild(routes)
  ],
  declarations: [GlosariumComponent]
})
export class GlosariumPageModule {}
