import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { IonicModule } from '@ionic/angular'
import { RouterModule } from '@angular/router'

import { SearchApprovalComponent } from './search-approval/search-approval.component'
import { SearchApprovalResultComponent } from './search-approval-result/search-approval-result.component'
import { ApproveLeaderComponent } from './approve-leader.component'
import { IonicSelectableModule } from 'ionic-selectable'
import { WidgetModule } from '../widgets/widgets.module'

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
        component: ApproveLeaderComponent
      },
      {
        path: 'search',
        component: SearchApprovalComponent
      },
      {
        path: 'search/result',
        component: SearchApprovalResultComponent
      }
    ])
  ],
  declarations: [ApproveLeaderComponent, SearchApprovalComponent, SearchApprovalResultComponent]
})
export class ApproveLeaderPageModule {}
