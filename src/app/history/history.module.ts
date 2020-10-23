import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { HistoryComponent } from './history.component';
import { WidgetModule } from '../widgets/widgets.module'

const routes: Routes = [
  {
    path: '',
    component: HistoryComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WidgetModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HistoryComponent]
})
export class HistoryPageModule {}
