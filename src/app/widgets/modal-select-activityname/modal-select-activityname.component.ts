import { Component, OnInit, Input } from '@angular/core'
import { Platform, NavParams, ModalController } from '@ionic/angular'
import { Helper } from '../../helper'
import { GlobalService } from '../../api/global.service'
import { Subscription } from 'rxjs'
@Component({
  selector: 'app-modal-select-activityname',
  templateUrl: './modal-select-activityname.component.html',
  styleUrls: ['./modal-select-activityname.component.scss']
})
export class ModalSelectActivitynameComponent implements OnInit {
  public keyword: String = ''
  public subscription: Subscription
  public listAct: any = []
  public tempData: any = []
  public firstload = true
  public itemByInput = {
    id: 0,
    is_specify_bendera: 0,
    proyek: this.keyword,
    sequence: 1,
    status: 1
  }
  type
  constructor(private navParams: NavParams, private modalCtrl: ModalController, private globalService: GlobalService) {}

  ngOnInit() {
    this.getNameActivity()
  }

  getNameActivity() {
    let code = localStorage.getItem('code')
    this.subscription = this.globalService.getRsRujukan(this.keyword, code).subscribe(res => {
      let resp: any = res
      if (resp.status) {
        this.listAct = resp.data
        if (this.firstload) this.tempData = resp.data
        this.firstload = false
      }
    })
  }

  close() {
    this.modalCtrl.dismiss()
  }

  searching(event) {
    this.keyword = event.detail.value
    this.itemByInput.proyek = this.keyword
    if (this.subscription) {
      this.subscription.unsubscribe()
    }

    if (this.keyword != '') {
      // Close any running subscription.
      if (this.subscription) {
        this.subscription.unsubscribe()
      }
      this.getNameActivity()
    } else {
      this.listAct = this.tempData
    }
  }
  select(item) {
    this.modalCtrl.dismiss(item)
  }
}
