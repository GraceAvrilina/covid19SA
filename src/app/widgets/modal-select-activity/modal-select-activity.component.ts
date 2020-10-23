import { Component, OnInit } from '@angular/core'
import { Platform, NavParams, ModalController } from '@ionic/angular'
import { Helper } from '../../helper'
import { GlobalService } from '../../api/global.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-modal-select-activity',
  templateUrl: './modal-select-activity.component.html',
  styleUrls: ['./modal-select-activity.component.scss']
})
export class ModalSelectActivityComponent implements OnInit {
  public keyword: String = ''
  public subscription: Subscription
  public listAct: any = []
  public tempData: any = []
  public firstload = true
  constructor(private modalCtrl: ModalController, private globalService: GlobalService) {}

  ngOnInit() {
    this.getTypeActivity()
  }
  close() {
    this.modalCtrl.dismiss()
  }
  getTypeActivity() {
    this.subscription = this.globalService.getTypeActivity(this.keyword).subscribe(res => {
      let resp: any = res
      if (resp.status) {
        this.listAct = resp.data
        if (this.firstload) this.tempData = resp.data
        this.firstload = false
      }
    })
  }

  searching(event) {
    this.keyword = event.detail.value
    if (this.subscription) {
      this.subscription.unsubscribe()
    }

    if (this.keyword != '') {
      // Close any running subscription.
      if (this.subscription) {
        this.subscription.unsubscribe()
      }
      this.getTypeActivity()
    } else {
      this.listAct = this.tempData
    }
  }
  select(item) {
    this.modalCtrl.dismiss(item)
  }
}
