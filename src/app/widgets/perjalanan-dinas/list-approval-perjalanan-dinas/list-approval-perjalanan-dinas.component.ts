import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core'
import { DetailApprovalDinasComponent } from '../../../widgets/perjalanan-dinas/detail-approval-dinas/detail-approval-dinas.component'
import { ModalController } from '@ionic/angular'

@Component({
  selector: 'app-list-approval-perjalanan-dinas',
  templateUrl: './list-approval-perjalanan-dinas.component.html',
  styleUrls: ['./list-approval-perjalanan-dinas.component.scss']
})
export class ListApprovalPerjalananDinasComponent implements OnChanges {
  @Input() data: any
  @Output()
  reload: EventEmitter<string> = new EventEmitter()
  constructor(public modalController: ModalController) {}

  ngOnChanges() {}

  async showDetail(data) {
    const modal = await this.modalController.create({
      component: DetailApprovalDinasComponent,
      componentProps: { data: data }
    })
    modal.onDidDismiss().then(res => {
      let resp: any = res
      if (resp.data.reload) this.reload.emit()
    })
    return await modal.present()
  }
}
