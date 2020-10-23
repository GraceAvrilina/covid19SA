import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { IonicModule } from '@ionic/angular'
import { RouterModule } from '@angular/router'
import { IonicSelectableModule } from 'ionic-selectable'
import { WidgetModule } from '../widgets/widgets.module'

import {LaporanLingkunganComponent} from './laporan-lingkungan.component'

@NgModule({
  imports: [
    WidgetModule,
    CommonModule,
    FormsModule,
    IonicModule,
    IonicSelectableModule,
    RouterModule.forChild([
      {
        path: '',
        component: LaporanLingkunganComponent
      }
    ])
  ],
  declarations: [
    LaporanLingkunganComponent
  ]
})
export class LaporanLingkunganModule { }
