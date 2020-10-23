import { Component, OnInit } from '@angular/core'
import { ModalController } from '@ionic/angular'

import { GlobalService } from '../../api/global.service'
import { Subscription } from 'rxjs'
@Component({
  selector: 'app-modal-select-unit',
  templateUrl: './modal-select-unit.component.html',
  styleUrls: ['./modal-select-unit.component.scss']
})
export class ModalSelectUnitComponent implements OnInit {
  public keyword: String = ''
  public subscription: Subscription
  public listData: any = []
  public tempData: any = []
  public firstload = true
  public itemByInput = {
    id: 0,
    unit: this.keyword
  }
  constructor(private modalCtrl: ModalController, private globalService: GlobalService) {}

  ngOnInit() {
    this.getData()
  }
  close() {
    this.modalCtrl.dismiss()
  }
  getData() {
    this.subscription = this.globalService.getUnit(this.keyword).subscribe(res => {
      let resp: any = res
      if (resp.status) {
        this.listData = resp.data
        if (this.firstload) this.tempData = resp.data
        this.firstload = false
      }
    })
  }

  searching(event) {
    this.keyword = event.detail.value
    this.itemByInput.unit = this.keyword
    if (this.subscription) {
      this.subscription.unsubscribe()
    }

    if (this.keyword != '') {
      // Close any running subscription.
      if (this.subscription) {
        this.subscription.unsubscribe()
      }
      this.getData()
    } else {
      this.listData = this.tempData
    }
  }
  select(item) {
    this.modalCtrl.dismiss(item)
  }
}
