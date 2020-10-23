import { Component, OnInit } from '@angular/core'
import { PerjalananDinasService } from '../../api/perjalanan-dinas.service'
import { Helper } from '../../helper'
import { Router, ActivatedRoute } from '@angular/router'
import { ModalController, LoadingController } from '@ionic/angular'
import { Subscription } from 'rxjs'
@Component({
  selector: 'app-approval-page',
  templateUrl: './approval-page.component.html',
  styleUrls: ['./approval-page.component.scss']
})
export class ApprovalPageComponent implements OnInit {
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
  isLoading: boolean = false
  loading: any
  firstLoad = true
  getSubscribe: Subscription
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private perjalanDinasService: PerjalananDinasService,
    private loadingCtrl: LoadingController
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.reload = this.router.getCurrentNavigation().extras.state.reload
        setTimeout(() => {
          if (this.reload) {
            this.reloadData()
          }
        }, 1000)
      }
    })
  }

  ngOnInit() {
    this.loadDataApproval(0, 'waiting', true)
    this.loadDataApproval(0, 'rejected', true)
    this.loadDataApproval(0, 'approved', true)
  }
  segmentChanged(type) {
    if (this.firstLoad) {
      this.firstLoad = false
      return false
    }

    this.type_segment = type
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

  loadDataApproval(start = 0, status, firstLoad = false) {
    let params: any = {
      startPage: start,
      endPage: 10,
      status: status,
      username: localStorage.getItem('username')
    }

    if (!firstLoad) {
      if (this.getSubscribe) this.getSubscribe.unsubscribe()
    }
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
        if (data.length != 0) {
          this.load_more_approved = true
        } else {
          this.load_more_approved = false
        }
        data.forEach(element => {
          this.list_approve.push(element)
        })
      }
      setTimeout(() => {
        this.isLoading = false
      }, 1500)
    })
  }

  searchPage() {
    this.router.navigateByUrl('home/perjalanan-dinas/approval/search')
  }

  close() {
    this.router.navigate(['home'])
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

  loadMoreData(status) {
    if (status == 'waiting') {
      let start = this.list_waiting.length
      this.loadDataApproval(start, 'waiting')
    }

    if (status == 'rejected') {
      let start = this.list_reject.length
      this.loadDataApproval(start, 'rejected')
    }

    if (status == 'approved') {
      let start = this.list_approve.length
      this.loadDataApproval(start, 'approved')
    }
  }
}
