import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { IonicModule } from '@ionic/angular'
import { RouterModule } from '@angular/router'

import { ReimburseComponent } from './reimburse.component'
import { ReimburseDetailComponent } from './reimburse-detail/reimburse-detail.component'
import { ReimburseSearchComponent } from './reimburse-search/reimburse-search.component'
import { ReimburseSearchResultComponent } from './reimburse-search-result/reimburse-search-result.component'
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
        component: ReimburseComponent
      },
      {
        path: 'detail',
        component: ReimburseDetailComponent
      },
      {
        path: 'search',
        component: ReimburseSearchComponent
      },
      {
        path: 'search/result',
        component: ReimburseSearchResultComponent 
      }
    ])
  ],
  declarations: [ReimburseComponent, ReimburseDetailComponent, ReimburseSearchComponent, ReimburseSearchResultComponent]
})
export class ReimbursePageModule {}
