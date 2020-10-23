import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { NavController, LoadingController } from '@ionic/angular'
import { PerjalananDinasService } from './../../../api/perjalanan-dinas.service'
import { Helper } from './../../../helper'
import { Subscription } from 'rxjs'
@Component({
  selector: 'app-approval-pd-search-result-page',
  templateUrl: './approval-pd-search-result-page.component.html',
  styleUrls: ['./approval-pd-search-result-page.component.scss']
})
export class ApprovalPdSearchResultPageComponent implements OnInit {
  filter: any = null

  type_segment: String = 'waiting'
  list_waiting: any = []
  list_reject: any = []
  list_approve: any = []
  public total_waiting: number = 0
  public total_rejected: number = 0
  public total_approved: number = 0
  load_more_waiting: boolean = false
  load_more_approved: boolean = false
  load_more_rejected: boolean = false
  loading_spinner = false
  reload: boolean = false
  loading: any
  isLoading: boolean = false
  getSubscribe: Subscription
  firstLoad = true
  constructor(
    private router: Router,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private perjalanDinasService: PerjalananDinasService,
    private loadingCtrl: LoadingController
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      let d = new Date()
      this.filter = this.router.getCurrentNavigation().extras.state.filter
    }
  }

  ngOnInit() {
    if (this.filter == null) {
      location.replace('home/perjalanan-dinas/approval/search')
      return false
    }
    this.presentLoadingWithOptions()
    this.loadDataApproval(0, 'waiting', true, () => {
      this.loadDataApproval(0, 'rejected', true, () => {
        this.loadDataApproval(0, 'approved', true, () => {
          this.loadingCtrl.dismiss()
        })
      })
    })
  }
  segmentChanged(type) {
    this.type_segment = type
    if (this.firstLoad) {
      this.firstLoad = false
      return false
    }
    if (type == 'waiting') {
      this.list_waiting = []
      this.load_more_waiting = false
      this.loadDataApproval(0, 'waiting')
    } else if (type == 'rejected') {
      this.list_reject = []
      this.load_more_rejected = false
      this.loadDataApproval(0, 'rejected')
    } else if (type == 'approved') {
      this.list_approve = []
      this.load_more_approved = false
      this.loadDataApproval(0, 'approved')
    }
  }

  loadDataApproval(start = 0, status, firstLoad = false, callback = null) {
    let tgl_dinas = ''
    if (this.filter.tgl_dinas != '') tgl_dinas = this.filter.tgl_dinas.substr(0, 10)
    let params: any = {
      startPage: start,
      endPage: 10,
      status: status,
      username: localStorage.getItem('username'),
      tanggal_dinas: tgl_dinas,
      value: this.filter.keyword,
      jenis_aktifitas: this.filter.id_jenis,
      bendera_aktifitas: this.filter.id_bendera
    }

    if (!firstLoad) {
      if (this.getSubscribe) this.getSubscribe.unsubscribe()
    }
    this.isLoading = true
    this.getSubscribe = this.perjalanDinasService.listApprovalDinas(params).subscribe(res => {
      let resp: any = res
      let data = resp.data
      if (status == 'waiting') {
        this.total_waiting = resp.totalData
        data.forEach(element => {
          this.list_waiting.push(element)
        })
      }

      if (status == 'rejected') {
        this.total_rejected = resp.totalData
        data.forEach(element => {
          this.list_reject.push(element)
        })
      }

      if (status == 'approved') {
        this.total_approved = resp.totalData
        data.forEach(element => {
          this.list_approve.push(element)
        })
      }
      if (callback != null) {
        return callback()
      }
    })
  }

  reloadData() {
    this.list_waiting = []
    this.list_reject = []
    this.list_approve = []

    this.loadDataApproval(0, 'waiting', true)
    this.loadDataApproval(0, 'rejected', true)
    this.loadDataApproval(0, 'approved', true)
  }

  async presentLoadingWithOptions() {
    let helper = new Helper()
    let config_loading = helper.getConfigLoading()
    this.isLoading = true
    this.loading = await this.loadingCtrl.create(config_loading).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'))
        }
      })
    })
  }

  close() {
    this.navCtrl.pop()
  }
}
