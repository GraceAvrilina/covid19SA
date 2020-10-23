import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { IonicModule } from '@ionic/angular'
import { RouterModule } from '@angular/router'

import { PerjalananDinasPageComponent } from './perjalanan-dinas-page/perjalanan-dinas-page.component'
import { DetailPerjalananDinasPageComponent } from './detail-perjalanan-dinas-page/detail-perjalanan-dinas-page.component'
import { ApprovalPageComponent } from './approval-page/approval-page.component'
import { SearchPdPageComponent } from './search-pd-page/search-pd-page.component'
import { SearchDetailPdPageComponent } from './search-detail-pd-page/search-detail-pd-page.component'
import { ApprovalPdSearchPageComponent } from './approval-page/approval-pd-search-page/approval-pd-search-page.component'
import { ApprovalPdSearchResultPageComponent } from './approval-page/approval-pd-search-result-page/approval-pd-search-result-page.component'
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
        component: PerjalananDinasPageComponent
      },
      {
        path: 'detail',
        component: DetailPerjalananDinasPageComponent
      },
      {
        path: 'search',
        component: SearchPdPageComponent
      },
      {
        path: 'search-detail',
        component: SearchDetailPdPageComponent
      },
      {
        path: 'approval',
        component: ApprovalPageComponent
      },
      {
        path: 'approval/search',
        component: ApprovalPdSearchPageComponent
      },
      {
        path: 'approval/search/result',
        component: ApprovalPdSearchResultPageComponent
      }
    ])
  ],
  declarations: [
    PerjalananDinasPageComponent,
    ApprovalPageComponent,
    DetailPerjalananDinasPageComponent,
    SearchPdPageComponent,
    SearchDetailPdPageComponent,
    ApprovalPdSearchPageComponent,
    ApprovalPdSearchResultPageComponent
  ],
  exports: []
})
export class PerjalananDinasPageModule {}
