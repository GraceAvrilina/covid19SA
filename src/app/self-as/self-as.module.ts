import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { IonicModule } from '@ionic/angular'
import { RouterModule, Routes } from '@angular/router'
import { IonicSelectableModule } from 'ionic-selectable'
import { WidgetModule } from '../widgets/widgets.module'

import {SelfAsComponent} from './self-as.component'

const routes: Routes = [
  {
    path: '',
    component: SelfAsComponent
  },
  {
    path: 'FormIsiEskalasi',
    loadChildren: '../form-eskalasi/form-eskalasi.module#FormEskalasiModule'
  },
  {
    path: 'EskWaspada',
    loadChildren: '../form-eskalasi-waspada/form-eskalasi-waspada.module#FormEskalasiWaspadaModule'
  },
  {
    path: 'EskBahaya',
    loadChildren: '../form-eskalasi-bahaya/form-eskalasi-bahaya.module#FormEskalasiBahayaModule'
  },
  {
    path: 'EskPositif',
    loadChildren: '../form-eskalasi-positif/form-eskalasi-positif.module#FormEskalasiPositifModule'
  },
  {
    path: 'QDDdaily',
    loadChildren: '../qdd-daily/qdd-daily.module#QDDDailyModule'
  },
]
@NgModule({
  declarations: [SelfAsComponent],
  imports: [
    WidgetModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ]
})
export class SelfAsModule { }
