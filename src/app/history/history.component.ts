import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular'
import { Router } from '@angular/router'
import { DeteksidiriService } from '../api/deteksidiri.service'
import { globalVariable } from '../globalVariable'
import { ModalController } from "@ionic/angular";
import {ModalDetailHAComponent} from '../widgets/modal-detail-ha/modal-detail-ha.component'
import {ModalDetailHllsComponent} from '../widgets/modal-detail-hlls/modal-detail-hlls.component'

import { Helper } from '../helper'

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent {
  public type_segment: String = 'assesment'
  public firstLoad = true
  public username 
  public imgurl = globalVariable.url
  loading: any
  constructor(
    private loadingController: LoadingController,  
    private router: Router,
    private modalController: ModalController,
    private deteksidiriService: DeteksidiriService
  ) { 
    this.getHistAss()
    this.getHistLLS()
    this.username = localStorage.getItem('full_name')
   }

  histlistass:any[]=[]
  histlistlls:any[]=[]

  async getHistAss(){
    let params = {
      username: localStorage.getItem('username'),
      type: 'assesment',
      code: localStorage.getItem('code')
    }

    this.presentLoadingWithOptions()

    this.deteksidiriService.getHistoryAssesment(params,params.code).subscribe( data=>{
      this.loadingController.dismiss()
      let res: any = data
    this.histlistass= res.data

    this.histlistass.forEach(val => {
      val.date = val.date.substr(0,10)
      val.jam = val.create_time.substr(11,5)
      val.image_status = this.imgurl + val.image_status
    });
    })
  }

  async presentLoadingWithOptions() {
    let helper = new Helper()
    let config_loading = helper.getConfigLoading()
    this.loading = await this.loadingController.create(config_loading)
    return await this.loading.present()
  }

  async getHistLLS(){
    let params = {
      username: localStorage.getItem('username'),
      type: 'laporan_lingkungan',
      code: localStorage.getItem('code')
    }

    // this.presentLoadingWithOptions()

    this.deteksidiriService.getHistoryAssesment(params,params.code).subscribe( data=>{
      let res: any = data
    this.histlistlls= res.data

    this.histlistlls.forEach(val => {
      val.create_time = val.create_time.slice(0, -8)
    });
    })
  }

  goToDrivePage(val){
    this.presentModalDetailAss(val)
  }

  gotoDetail(val){
    this.presentModalDetailLLS(val)
  }
 
  async presentModalDetailLLS(val) {
    const modal = await this.modalController.create({
      component: ModalDetailHllsComponent,
      componentProps: { item: val }
    });

    modal.onDidDismiss().then(res => {});

    return await modal.present();
  }
 
  async presentModalDetailAss(val) {
    const modal = await this.modalController.create({
      component: ModalDetailHAComponent,
      componentProps: { item: val },
      backdropDismiss: false
    },);

    modal.onDidDismiss().then(res => {});

    return await modal.present();
  }

  close() {
    this.router.navigate(['home'])
  }

  segmentChanged(type) {
    if (this.firstLoad) return false
    this.type_segment = type
  }

}
