import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { IonicModule } from '@ionic/angular'
import { FormsModule } from '@angular/forms'
import { IonicSelectableModule } from 'ionic-selectable'
import { CalendarModule } from 'ion2-calendar'

import { ModalUploadBymediaPage } from './modal-upload-bymedia/modal-upload-bymedia.component'
import { ModalLupaPasswordComponent } from './modal-lupa-password/modal-lupa-password.component'
import { ModalDetailFormComponent } from './modal-detail-form/modal-detail-form.component'
import { ModalSelectActivityComponent } from './modal-select-activity/modal-select-activity.component'
import { ModalSelectActivitynameComponent } from './modal-select-activityname/modal-select-activityname.component'
import { ModalFormInputBiayaComponent } from './perjalanan-dinas/modal-form-input-biaya/modal-form-input-biaya.component'
import { ModalSelectUnitComponent } from './modal-select-unit/modal-select-unit.component'
import {ModalRegSuccessComponent} from './modal-reg-success/modal-reg-success.component'
import {ModalDetailHllsComponent} from './modal-detail-hlls/modal-detail-hlls.component'
import {ModalDetailHAComponent} from './modal-detail-ha/modal-detail-ha.component'
import {ResultAssComponent} from './result-ass/result-ass.component'
import { ModalCorrectionComponent } from './perjalanan-dinas/modal-correction/modal-correction.component'
// import { ModalPrevImageComponent } from './modal-prev-image/modal-prev-image.component'
import { ModalSearchLeaderComponent } from './modal-search-leader/modal-search-leader.component'
import { AdditemComponent } from './popover/additem/additem.component'
import { ListDraftComponent } from './list-draft/list-draft.component'
import { ListSentComponent } from './list-sent/list-sent.component'
import { ListApprovalComponent } from './list-approval/list-approval.component'
import { ListDraftPerjalananDinasComponent } from './perjalanan-dinas/list-draft-perjalanan-dinas/list-draft-perjalanan-dinas.component'
import { ListSentPerjalananDinasComponent } from './perjalanan-dinas/list-sent-perjalanan-dinas/list-sent-perjalanan-dinas.component'
import { ListApprovalPerjalananDinasComponent } from './perjalanan-dinas/list-approval-perjalanan-dinas/list-approval-perjalanan-dinas.component'
import { FormReimburseComponent } from './form-reimburse/form-reimburse.component'
import { FormTransportComponent } from './form-transport/form-transport.component'
import { FormLingkunganComponent } from './form-lingkungan/form-lingkungan.component'
import {FormAssassmentComponent} from './form-assassment/form-assassment.component'
import {FormAssassmentp2Component} from './form-assassmentp2/form-assassmentp2.component'
import { FormPerjalananDinasComponent } from './perjalanan-dinas/form-perjalanan-dinas/form-perjalanan-dinas.component'
import { DetailApprovalDinasComponent } from './perjalanan-dinas/detail-approval-dinas/detail-approval-dinas.component'
import { PipesModule } from './../pipe/pipe-module'
@NgModule({
  declarations: [
    ModalLupaPasswordComponent,
    ModalUploadBymediaPage,
    ModalSelectActivityComponent,
    ModalDetailFormComponent,
    ModalSelectActivitynameComponent,
    ModalFormInputBiayaComponent,
    ModalSelectUnitComponent,
    ModalRegSuccessComponent,
    ModalDetailHllsComponent,
    ModalDetailHAComponent,
    ResultAssComponent,
    ModalCorrectionComponent,
    ModalSearchLeaderComponent,
    AdditemComponent,
    ListDraftComponent,
    ListSentComponent,
    ListApprovalComponent,
    ListDraftPerjalananDinasComponent,
    ListSentPerjalananDinasComponent,
    ListApprovalPerjalananDinasComponent,
    FormReimburseComponent,
    FormTransportComponent,
    FormLingkunganComponent,
    FormAssassmentp2Component,
    FormAssassmentComponent,
    FormPerjalananDinasComponent,
    DetailApprovalDinasComponent
    // ModalPrevImageComponent
  ],
  imports: [IonicModule, CommonModule, FormsModule, IonicSelectableModule, PipesModule, CalendarModule],
  exports: [
    ModalLupaPasswordComponent,
    ModalUploadBymediaPage,
    ModalSelectActivityComponent,
    ModalSelectActivitynameComponent,
    ModalDetailFormComponent,
    ModalFormInputBiayaComponent,
    ModalSelectUnitComponent,
    ModalRegSuccessComponent,
    ModalDetailHllsComponent,
    ModalDetailHAComponent,
    ResultAssComponent,
    ModalCorrectionComponent,
    ModalSearchLeaderComponent,
    AdditemComponent,
    ListDraftComponent,
    ListSentComponent,
    ListApprovalComponent,
    ListDraftPerjalananDinasComponent,
    ListSentPerjalananDinasComponent,
    ListApprovalPerjalananDinasComponent,
    FormReimburseComponent,
    FormTransportComponent,
    FormLingkunganComponent,
    FormAssassmentp2Component,
    FormAssassmentComponent,
    FormPerjalananDinasComponent,
    DetailApprovalDinasComponent
  ],
  entryComponents: [
    ModalLupaPasswordComponent,
    ModalUploadBymediaPage,
    ModalSelectActivityComponent,
    ModalSelectActivitynameComponent,
    ModalDetailFormComponent,
    ModalFormInputBiayaComponent,
    ModalSelectUnitComponent,
    ModalRegSuccessComponent,
    ModalDetailHllsComponent,
    ModalDetailHAComponent,
    ResultAssComponent,
    ModalCorrectionComponent,
    // ModalPrevImageComponent,
    ModalSearchLeaderComponent,
    AdditemComponent,
    ListDraftComponent,
    ListSentComponent,
    ListApprovalComponent,
    ListDraftPerjalananDinasComponent,
    ListSentPerjalananDinasComponent,
    ListApprovalPerjalananDinasComponent,
    FormReimburseComponent,
    FormTransportComponent,
    FormLingkunganComponent,
    FormAssassmentComponent,
    FormAssassmentp2Component,
    FormPerjalananDinasComponent,
    DetailApprovalDinasComponent
  ]
})
export class WidgetModule {}
