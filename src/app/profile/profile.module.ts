import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { IonicModule } from '@ionic/angular'
import { RouterModule } from '@angular/router'

import { ProfileComponent } from './profile.component'
import { UpdateDataComponent } from './update-data/update-data.component'
import { ChangePasswordComponent } from './change-password/change-password.component'
import { WidgetModule } from '../widgets/widgets.module'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WidgetModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProfileComponent
      },
      {
        path: 'update',
        component: UpdateDataComponent
      },
      {
        path: 'update/password',
        component: ChangePasswordComponent
      }
    ])
  ],
  declarations: [ProfileComponent, UpdateDataComponent, ChangePasswordComponent],
  entryComponents: []
})
export class ProfilePageModule {}
