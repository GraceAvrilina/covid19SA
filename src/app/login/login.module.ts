import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { IonicModule } from '@ionic/angular'
import { RouterModule } from '@angular/router'

import { LoginComponent } from './login.component'
import { LoginRoutingModule } from './login-routing.module'
import { WidgetModule } from '../widgets/widgets.module'
@NgModule({
  imports: [
    WidgetModule,
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: LoginComponent
      },
      {
        path: 'register',
        loadChildren: '../form-registrasi/form-registrasi.module#FormRegistrasiModule'
      }
    ]),
    LoginRoutingModule
  ],
  declarations: [LoginComponent]
})
export class LoginPageModule {}
