import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core'
import { ModalDetailFormComponent } from '../modal-detail-form/modal-detail-form.component'
import { ModalController } from '@ionic/angular'

@Component({
  selector: 'app-list-approval',
  templateUrl: './list-approval.component.html',
  styleUrls: ['./list-approval.component.scss']
})
export class ListApprovalComponent implements OnChanges {
  @Input() data: any
  @Output()
  reload: EventEmitter<string> = new EventEmitter()
  constructor(public modalController: ModalController) {}

  ngOnChanges() {}

  async showDetail(v) {
    const modal = await this.modalController.create({
      component: ModalDetailFormComponent,
      componentProps: { data: v }
    })
    modal.onDidDismiss().then(res => {
      let resp: any = res
      if (resp.data.reload) {
        this.reload.emit()
      }
    })
    return await modal.present()
  }
}
