import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { IonicModule } from '@ionic/angular'
import { RouterModule, Routes } from '@angular/router'
import { IonicSelectableModule } from 'ionic-selectable'
import { WidgetModule } from '../widgets/widgets.module'

import {FormEskalasiBahayaComponent} from './form-eskalasi-bahaya.component'
const routes: Routes = [
  {
    path: '',
    component: FormEskalasiBahayaComponent
  }
]
@NgModule({
  declarations: [FormEskalasiBahayaComponent],
  imports: [
    WidgetModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ]
})
export class FormEskalasiBahayaModule { }
