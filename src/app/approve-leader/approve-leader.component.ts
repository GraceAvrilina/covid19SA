import { Component, OnInit } from '@angular/core'
import { GlobalService } from '../api/global.service'
import { Helper } from '../helper'
import { Router } from '@angular/router'
import { Subscription } from 'rxjs'
@Component({
  selector: 'app-approve-leader',
  templateUrl: './approve-leader.component.html',
  styleUrls: ['./approve-leader.component.scss']
})
export class ApproveLeaderComponent implements OnInit {
  type_segment: String = 'waiting'
  list_waiting: any = []
  list_reject: any = []
  list_approve: any = []
  total_waiting: number = 0
  total_rejected: number = 0
  total_approved: number = 0
  load_more_waiting: boolean = false
  load_more_approved: boolean = false
  load_more_rejected: boolean = false
  loading_spinner = false
  getSubscribe: Subscription
  constructor(private globalService: GlobalService, private router: Router) {}

  ngOnInit() {
    this.getDataApprovalByStatus(0, 'rejected')
    this.getDataApprovalByStatus(0, 'approved')
  }
  segmentChanged(type) {
    this.type_segment = type
    if (type == 'waiting') {
      this.list_waiting = []
      this.load_more_waiting = false
    } else if (type == 'rejected') {
      this.list_reject = []
      this.load_more_rejected = false
    } else if (type == 'approved') {
      this.list_approve = []
      this.load_more_approved = false
    }

    this.getDataApproval()
  }
  getDataApproval(start = 0) {
    let helper = new Helper()
    this.loading_spinner = true
    let params = {
      startPage: start,
      endPage: 10,
      status: this.type_segment,
      username: localStorage.getItem('username')
    }
    if (this.getSubscribe) this.getSubscribe.unsubscribe()
    this.getSubscribe = this.globalService.getListApproval(params).subscribe(res => {
      let resp: any = res
      resp.data.map(v => {
        let strDate = v.waktu_kirim
        v.custom_date = strDate.substr(0, 10)
        v.custom_nominal = helper.convertToRupiah(v.nominal)
        if (v.nominal_koreksi == null || v.nominal_koreksi == '') {
          v.custom_nominal_koreksi = 0
        } else {
          v.custom_nominal_koreksi = helper.convertToRupiah(v.nominal_koreksi)
        }
      })
      if (resp.data.length > 0) {
        if (this.type_segment == 'waiting') {
          this.total_waiting = resp.totalData
          this.load_more_waiting = true
          resp.data.forEach(element => {
            this.list_waiting.push(element)
          })
        } else if (this.type_segment == 'rejected') {
          this.total_rejected = resp.totalData
          this.load_more_rejected = true
          resp.data.forEach(element => {
            this.list_reject.push(element)
          })
        } else if (this.type_segment == 'approved') {
          this.total_approved = resp.totalData
          this.load_more_approved = true
          resp.data.forEach(element => {
            this.list_approve.push(element)
          })
        }
      } else {
        if (this.type_segment == 'waiting') {
          this.load_more_waiting = false
        } else if (this.type_segment == 'rejected') {
          this.load_more_rejected = false
        } else if (this.type_segment == 'approved') {
          this.load_more_approved = false
        }
      }
      this.loading_spinner = false
    })
  }

  loadMoreData() {
    let start = 0
    if (this.type_segment == 'waiting') {
      start = this.list_waiting.length
    } else if (this.type_segment == 'rejected') {
      start = this.list_reject.length
    } else if (this.type_segment == 'approved') {
      start = this.list_approve.length
    }
    this.getDataApproval(start)
  }

  reloadData() {
    this.list_waiting = []
    this.list_reject = []
    this.list_approve = []
    this.getDataApprovalByStatus(0, 'waiting')
    this.getDataApprovalByStatus(0, 'rejected')
    this.getDataApprovalByStatus(0, 'approved')
  }

  getDataApprovalByStatus(start = 0, status) {
    let helper = new Helper()
    this.loading_spinner = true
    let params = {
      startPage: start,
      endPage: 10,
      status: status,
      username: localStorage.getItem('username')
    }
    this.globalService.getListApproval(params).subscribe(res => {
      let resp: any = res
      resp.data.map(v => {
        let strDate = v.waktu_kirim
        v.custom_date = strDate.substr(0, 10)
        v.custom_nominal = helper.convertToRupiah(v.nominal)
      })
      if (resp.data.length > 0) {
        if (status == 'waiting') {
          this.total_waiting = resp.totalData
          this.load_more_waiting = true
          resp.data.forEach(element => {
            this.list_waiting.push(element)
          })
        } else if (status == 'rejected') {
          this.total_rejected = resp.totalData
          this.load_more_rejected = true
          resp.data.forEach(element => {
            this.list_reject.push(element)
          })
        } else if (status == 'approved') {
          this.total_approved = resp.totalData
          this.load_more_approved = true
          resp.data.forEach(element => {
            this.list_approve.push(element)
          })
        }
      } else {
        if (status == 'waiting') {
          this.load_more_waiting = false
        } else if (status == 'rejected') {
          this.load_more_rejected = false
        } else if (status == 'approved') {
          this.load_more_approved = false
        }
      }
      this.loading_spinner = false
    })
  }

  searchPage() {
    this.router.navigateByUrl('home/approval-leader/search')
  }

  close() {
    this.router.navigate(['home'])
  }
}
