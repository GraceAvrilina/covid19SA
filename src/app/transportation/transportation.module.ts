import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { IonicModule } from '@ionic/angular'
import { RouterModule } from '@angular/router'

import { TransportationComponent } from './transportation.component'
import { TransportDetailComponent } from './transport-detail/transport-detail.component'
import { TransportSearchingComponent } from './transport-searching/transport-searching.component'
import { TransportSearchResultComponent } from './transport-search-result/transport-search-result.component'
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
        component: TransportationComponent
      },
      {
        path: 'detail',
        component: TransportDetailComponent
      },
      {
        path: 'search',
        component: TransportSearchingComponent
      },
      {
        path: 'search/result',
        component: TransportSearchResultComponent
      }
    ])
  ],
  declarations: [
    TransportationComponent,
    TransportDetailComponent,
    TransportSearchingComponent,
    TransportSearchResultComponent
  ]
})
export class TransportationPageModule {}
