import { Component, OnInit, OnChanges } from '@angular/core'
import { ReimburseService } from '../api/reimburse.service'
import { Helper } from '../helper'
import { StorageService } from '../api/storage.service'
import { ActivatedRoute, Router } from '@angular/router'
import { GlobalService } from '../api/global.service'
import { Subscription } from 'rxjs'
import { LoadingController } from '@ionic/angular'
@Component({
  selector: 'app-reimburse',
  templateUrl: './reimburse.component.html',
  styleUrls: ['./reimburse.component.scss']
})
export class ReimburseComponent implements OnInit {
  type_segment: String = 'form'
  type_reimburse: any = []
  listBendera: any = []
  firstLoad = true
  start: number = 0
  list_sent: any = []
  list_draft: any = []
  load_more_sent: boolean = true
  loading_spinner = false
  total_draft = 0
  total_sent = 0
  getSubscribe: Subscription
  reload: boolean = false
  constructor(
    private reimburseService: ReimburseService,
    private storageService: StorageService,
    private globalService: GlobalService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingCtrl: LoadingController
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
  reloadData() {
    this.presentLoadingWithOptions()
    this.list_draft = []
    this.getDataDraft()
    this.list_sent = []
    this.getDataSent(() => {
      this.loadingCtrl.dismiss()
      this.loading_spinner = false
    })
  }
  ngOnInit() {
    this.getTypeReimburse()
    this.getListBendera()
    if (this.reload == false) {
      setTimeout(() => {
        this.reloadData()
      }, 2000)
    }
  }
  segmentChanged(type) {
    this.type_segment = type
    if (this.firstLoad) return false

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
  getTypeReimburse() {
    this.reimburseService.getTypeReimburse().subscribe(res => {
      let resp: any = res
      if (resp.status) {
        this.type_reimburse = resp.data
      }
    })
  }

  getListBendera() {
    this.globalService.getListBendera().subscribe(res => {
      let response: any = res
      if (response.status) {
        this.listBendera = response.data
      }
    })
  }

  getDataSent(callback = null) {
    /* loader active */
    let helper = new Helper()
    this.loading_spinner = true
    let params: any = {
      value: '',
      waktu_kejadian: '',
      waktu_kirim: '',
      reimburse: '',
      status: '',
      created_by: localStorage.getItem('username'),
      startPage: this.start,
      endPage: 10,
      time: 'iso'
    }

    if (this.getSubscribe) this.getSubscribe.unsubscribe()
    this.getSubscribe = this.reimburseService.getDataReimburse(params).subscribe(res => {
      let resp: any = res
      let datax = resp.data
      this.total_sent = resp.totalData
      if (datax.length != 0) {
        datax.forEach(v => {
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
        this.load_more_sent = true
      } else if (resp.data.length == 0) {
        this.load_more_sent = false
      }
      callback()
    })
  }

  getDataDraft() {
    let helper = new Helper()
    this.storageService.getDraft('reimburse_draft', v => {
      if (v != null) {
        this.list_draft = v
        this.list_draft.sort(this.compare)
        this.total_draft = this.list_draft.length
        this.list_draft.forEach(x => {
          let strDate = x.waktu_kejadian
          x.custom_date = strDate.substr(0, 10) + ' ' + strDate.substr(11, 8)
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
    let a_updatetime = new Date(a.waktu_kejadian)
    let b_updatetime = new Date(b.waktu_kejadian)

    if (a_updatetime > b_updatetime) {
      return -1
    }
    if (a_updatetime < b_updatetime) {
      return 1
    }
    return 0
  }

  loadMoreData() {
    this.start = this.list_sent.length
    this.getDataSent(e => {
      this.loading_spinner = false
    })
  }
  searchPage() {
    this.router.navigateByUrl('home/reimburse/search')
  }
  close() {
    this.router.navigate(['home'])
  }
  async presentLoadingWithOptions() {
    let helper = new Helper()
    let config_loading = helper.getConfigLoading()

    await this.loadingCtrl.create(config_loading).then(a => {
      a.present().then(() => {})
    })
  }
}
