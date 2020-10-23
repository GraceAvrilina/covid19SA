import { Component, OnInit, Input, Output, OnChanges, EventEmitter, ViewChild, asNativeElements, ElementRef } from '@angular/core'
import { IonicSelectableComponent } from 'ionic-selectable'
import { Subscription } from 'rxjs'
import { ModalUploadBymediaPage } from '../modal-upload-bymedia/modal-upload-bymedia.component'
import { ModalSelectActivityComponent } from '../modal-select-activity/modal-select-activity.component'
import { ModalSelectActivitynameComponent } from '../modal-select-activityname/modal-select-activityname.component'
import { ModalPrevImageComponent } from '../modal-prev-image/modal-prev-image.component'
import { ModalSearchLeaderComponent } from '../modal-search-leader/modal-search-leader.component'
import { ModalController } from '@ionic/angular'
import { TransportationService } from '../../api/transportation.service'
import { GlobalService } from '../../api/global.service'
import { Helper } from '../../helper'

import { ToastController } from '@ionic/angular'
import { AlertController, LoadingController } from '@ionic/angular'
import { Router, NavigationExtras } from '@angular/router'
import { StorageService } from '../../api/storage.service'

import { CalendarModal, CalendarModalOptions, DayConfig, CalendarResult } from 'ion2-calendar'
import imageCompression from 'browser-image-compression'

class Leader {
  public username: string
  public name: string
}

class Transport {
  constructor(
    public nomor_laporan: string = '',
    public aktivitas: any = {
      id: 0,
      name: '',
      is_specify_bendera: 0
    },
    public klien: string = '',
    public project: string = '',
    public bendera_aktivitas: string = '',
    public jenis_transport: string = '',
    public jenis_bayar: string = '',
    public payment_options: any = {},
    public kode_voucher: string = '',
    public nominal: string = '',
    public keterangan: string = '',
    public waktu_tiba: string = '',
    public waktu_berangkat: string = '',
    public ke: string = '',
    public dari: string = ''
  ) {}
}
@Component({
  selector: 'app-form-assassmentp2',
  templateUrl: './form-assassmentp2.component.html',
  styleUrls: ['./form-assassmentp2.component.scss'],
})
export class FormAssassmentp2Component implements OnInit {
  leaders: Leader[]
  leader = { username: '', name: '' }
  transport = new Transport()
  subscription: Subscription
  list_img: any = []
  list_file: any = []
  img_idx
  type: string = ''
  type_transport_name: string = ''
  public eventFile: any
  loading: any
  placeholder_keterangan: string = ''
  minDate_report: string = ''
  config_min_date: string = ''
  payment_options: any = []
  public list_voucher: any = []
  
  public no11
  public no15
  public no19
  public no23
  public info_form: string = localStorage.getItem('info_transportasi')
  constructor(
    public modalController: ModalController,
    private transportService: TransportationService,
    private globalService: GlobalService,
    private storageService: StorageService,
    public toastController: ToastController,
    public alertCtrl: AlertController,
    private loadingController: LoadingController,
    private router: Router
  ) {
    let d = new Date()
    let helper = new Helper()
    this.config_min_date = localStorage.getItem('backdate_transportasi')
    let config_min_date: number = parseInt(localStorage.getItem('backdate_transportasi'))
    config_min_date = config_min_date * -1
    let fulldate = helper.convertMinDateCustom(d, config_min_date)
    this.minDate_report = fulldate.substr(0, 10)
    this.transport.payment_options.voucher_enabled = false
  }

  ngOnInit(){
     let params = {
      username: localStorage.getItem('username'),
      code: localStorage.getItem('code')
    }
    // this.globalService.getDataUser(params.username).subscribe(res => {
    //   let resp: any = res
    // })
  }

  changestatus(status){
    this.no11 = status
    console.log(this.no11)
  }

  changestatus15(status){
    this.no15 = status
  }

  changestatus19(status){
    this.no19 = status
  }

  changestatus23(status){
    this.no23 = status
  }

}
