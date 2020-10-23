import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { IonicModule } from '@ionic/angular'
import { RouterModule } from '@angular/router'
import { WidgetModule } from '../widgets/widgets.module'
import { PipesModule } from './../pipe/pipe-module'

import { HomePage } from './home.page'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PipesModule,
    IonicModule,WidgetModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      },
      {
        path: 'selfassassment',
        loadChildren: '../assassment/assassment.module#AssassmentModule'
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
        // loadChildren: '../term-of-serv/term-of-serv.module#TermOfServModule'
        loadChildren: '../qdd-daily/qdd-daily.module#QDDDailyModule'
      },
      {
        path: 'FormIsiEskalasi',
        loadChildren: '../form-eskalasi/form-eskalasi.module#FormEskalasiModule'
      },
      {
        path: 'FormEskalasi',
        loadChildren: '../self-as/self-as.module#SelfAsModule'
      },
      {
        path: 'lingkungan',
        loadChildren: '../laporan-lingkungan/laporan-lingkungan.module#LaporanLingkunganModule'
      },
      {
        path: 'transportation',
        loadChildren: '../transportation/transportation.module#TransportationPageModule'
      },
      {
        path: 'reimburse',
        loadChildren: '../reimburse/reimburse.module#ReimbursePageModule'
      },
      {
        path: 'approval-leader',
        loadChildren: '../approve-leader/approve-leader.module#ApproveLeaderPageModule'
      },
      {
        path: 'perjalanan-dinas',
        loadChildren: '../perjalanan-dinas/perjalanan-dinas.module#PerjalananDinasPageModule'
      },
      {
        path: 'history',
        loadChildren: '../history/history.module#HistoryPageModule'
      },
      {
        path: 'faq',
        loadChildren: '../faq/faq.module#FaqPageModule'
      },
      {
        path: 'tips',
        loadChildren: '../tips/tips.module#TipsPageModule'
      },
      {
        path: 'glosarium',
        loadChildren: '../glosarium/glosarium.module#GlosariumPageModule'
      }
    ])
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
