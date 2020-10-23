import { Component, OnInit } from '@angular/core'
import { IonicSelectableComponent } from 'ionic-selectable'
import { Subscription } from 'rxjs'
import { ModalUploadBymediaPage } from '../widgets/modal-upload-bymedia/modal-upload-bymedia.component'
import { ModalController } from '@ionic/angular'
import { TransportationService } from '../api/transportation.service'
import { GlobalService } from '../api/global.service'
import { Helper } from '../helper'

import { ToastController, LoadingController } from '@ionic/angular'
import { Router, ActivatedRoute } from '@angular/router'
import { StorageService } from '../api/storage.service'
class Leader {
  public username: string
  public name: string
}

class Transport {
  constructor(
    public klien: string = '',
    public project: string = '',
    public jenis_transport: string = '',
    public jenis_bayar: string = 'voucher',
    public kode_voucher: string = '',
    public nominal: string = '',
    public keterangan: string = '',
    public waktu_tiba: string = '',
    public waktu_berangkat: string = ''
  ) {}
}

@Component({
  selector: 'app-transportation',
  templateUrl: './transportation.component.html',
  styleUrls: ['./transportation.component.scss']
})
export class TransportationComponent implements OnInit {
  type_segment: String = 'form'
  typeTransport: any = []
  listBendera: any = []
  start: number = 0
  list_sent: any = []
  list_draft: any = []
  load_more_sent: boolean = true
  placeholder_keterangan: string = ''
  loading_spinner = false
  total_draft = 0
  total_sent = 0
  firstLoad = true
  public loading: any
  isLoading: boolean = false
  reload: boolean = false
  getSubscribe: Subscription
  constructor(
    public modalController: ModalController,
    private transportService: TransportationService,
    private globalService: GlobalService,
    private storageService: StorageService,
    public toastController: ToastController,
    private loadingController: LoadingController,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.reload = this.router.getCurrentNavigation().extras.state.reload
        setTimeout(() => {
          if (this.reload) {
            this.firstLoad = false
            this.reloadData()
          }
        }, 1000)
      }
    })
  }

  ionViewWillEnter() {}

  ngOnInit() {
    this.firstLoad = false
    this.getTypeTransport(() => {
      this.getListBendera(() => {
        if (this.reload == false) {
          setTimeout(() => {
            this.reloadData()
          }, 2000)
        }
      })
    })
  }
  reloadData() {
    let _self = this
    this.list_draft = []
    this.list_sent = []
    this.getDataDraft()
    this.presentLoadingWithOptions()
    this.getDataSent(() => {
      this.loading_spinner = false
      setTimeout(() => {
        this.loadingController.dismiss()
      }, 1000);
    })
  }
  segmentChanged(type) {
    if (this.firstLoad) return false
    this.type_segment = type
    if (type == 'sent') {
      this.start = 0
      this.list_sent = []
      this.load_more_sent = true
      this.getDataSent(() => {
        this.loading_spinner = false
      })
    } else if (type == 'draft') {
      this.getDataDraft()
    }
  }

  getDataSent(callback = null) {
    let helper = new Helper()
    this.loading_spinner = true
    let params: any = {
      value: '',
      waktu_kirim: '',
      pembayaran: '',
      transportasi: '',
      status: '',
      created_by: localStorage.getItem('username'),
      startPage: this.start,
      endPage: 10,
      time: 'iso'
    }

    if (this.getSubscribe) this.getSubscribe.unsubscribe()
    this.getSubscribe = this.transportService.getListTransport(params).subscribe(
      res => {
        let resp: any = res

        if (resp.data.length != 0) {
          this.total_sent = resp.totalData
          resp.data.forEach(v => {
            let strDate = v.waktu_kirim
            v.custom_date = strDate.substr(0, 10) + ' ' + strDate.substr(11, 8)
            v.custom_nominal = helper.convertToRupiah(v.nominal)

            if (v.nominal_koreksi == null || v.nominal_koreksi == '') {
              v.custom_nominal_koreksi = 0
            } else {
              v.custom_nominal_koreksi = helper.convertToRupiah(v.nominal_koreksi)
            }

            if (v.status == 'waiting') {
              v.status_text = 'Tunggu persetujuan'
            } else if (v.status == 'rejected') {
              v.status_text = 'Ditolak'
            } else if (v.status == 'approved') {
              v.status_text = 'Disetujui'
            } else if (v.status == 'done') {
              v.status_text = 'Selesai'
            }
            this.list_sent.push(v)
          })
        } else if (resp.data.length == 0) {
          this.load_more_sent = false
        }
        callback()
      },
      error => {}
    )
  }

  loadMoreData() {
    this.start = this.list_sent.length
    this.getDataSent(e => {
      this.loading_spinner = false
    })
  }

  getTypeTransport(callback = null) {
    this.transportService.getTypeTransportation().subscribe(res => {
      let response: any = res
      if (response.status) {
        this.typeTransport = response.data
      }
      return callback()
    })
  }

  getListBendera(callback = null) {
    this.globalService.getListBendera().subscribe(res => {
      let response: any = res
      if (response.status) {
        this.listBendera = response.data
        return callback()
      }
    })
  }

  getDataDraft() {
    let helper = new Helper()
    this.storageService.getDraft('transport_draft', v => {
      if (v != null) {
        this.list_draft = v

        this.list_draft.sort(this.compare)

        this.total_draft = this.list_draft.length
        this.list_draft.forEach(x => {
          let strDate = x.waktu_buat
          x.custom_date = strDate.substr(0, 10)
          x.custom_nominal = helper.convertToRupiah(x.nominal)
          x.custom_nominal = helper.convertToRupiah(x.nominal)
          if (x.nominal_koreksi == null || x.nominal_koreksi == '') {
            x.custom_nominal_koreksi = 0
          } else {
            x.custom_nominal_koreksi = helper.convertToRupiah(x.nominal_koreksi)
          }
        })
      }
    })
  }

  compare(a, b) {
    let a_updatetime = new Date(a.waktu_mulai)
    let b_updatetime = new Date(b.waktu_mulai)

    if (a_updatetime > b_updatetime) {
      return -1
    }
    if (a_updatetime < b_updatetime) {
      return 1
    }
    return 0
  }

  searchPage() {
    this.router.navigateByUrl('home/transportation/search')
  }
  close() {
    this.router.navigate(['home'])
  }
  async presentLoadingWithOptions() {
    let helper = new Helper()
    let config_loading = helper.getConfigLoading()
    this.isLoading = true
    await this.loadingController.create(config_loading).then(a => {
      a.present().then(() => {})
    })
  }
}
