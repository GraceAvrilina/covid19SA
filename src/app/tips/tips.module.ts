import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DetailComponent } from './detail/detail.component';
import { TipsComponent } from './tips.component';

const routes: Routes = [
  {
    path: '',
    component: TipsComponent
  },
  {
    path: 'detail',
    component: DetailComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    TipsComponent,
    DetailComponent
  ]
})
export class TipsPageModule {}
