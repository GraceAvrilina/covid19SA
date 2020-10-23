import { Component, OnInit } from '@angular/core'
import { Platform, NavParams, ModalController, LoadingController } from '@ionic/angular'
import { Helper } from '../../helper'
import { GlobalService } from '../../api/global.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-modal-search-leader',
  templateUrl: './modal-search-leader.component.html',
  styleUrls: ['./modal-search-leader.component.scss']
})
export class ModalSearchLeaderComponent implements OnInit {
  public keyword: String = ''
  public subscription: Subscription
  public leaders: any = []
  public tempData: any = []
  public firstload = true
  public delayLoading = false
  constructor(
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private globalService: GlobalService
  ) {}

  ngOnInit() {
    this.getLeader()
  }

  close() {
    this.modalCtrl.dismiss()
  }

  getLeader() {
    let params = {
      first_name: this.keyword,
      startPage: 0,
      endPage: 10,
      username: localStorage.getItem('username')
    }
    this.delayLoading = false
    setTimeout(() => {
      if (this.delayLoading) {
        this.presentLoadingWithOptions()
        this.delayLoading = false
      }
    }, 5000)
    this.delayLoading = true
    this.subscription = this.globalService.getListLeader(params).subscribe(res => {
      let resp: any = res
      if (resp.status) {
        this.delayLoading = false
        this.leaders = resp.data
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
      this.getLeader()
    } else {
      this.leaders = this.tempData
    }
  }
  select(item) {
    this.modalCtrl.dismiss(item)
  }

  async presentLoadingWithOptions() {
    let helper = new Helper()
    let config_loading = helper.getConfigLoading()
    const loading = await this.loadingCtrl.create(config_loading)
    return await loading.present()
  }
}
