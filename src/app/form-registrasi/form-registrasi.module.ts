import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { IonicModule } from '@ionic/angular'
import { RouterModule, Routes } from '@angular/router'
import { WidgetModule } from '../widgets/widgets.module'
import {FormRegistrasiComponent} from './form-registrasi.component'

const routes: Routes = [
  {
    path: '',
    component: FormRegistrasiComponent
  }
]
@NgModule({
  declarations: [FormRegistrasiComponent],
  imports: [
    WidgetModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ]
})
export class FormRegistrasiModule { }
