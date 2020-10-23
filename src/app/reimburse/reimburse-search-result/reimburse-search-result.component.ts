import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Helper } from '../../helper'
import { ReimburseService } from '../../api/reimburse.service'
import { StorageService } from '../../api/storage.service'
import { Subscription } from 'rxjs'
@Component({
  selector: 'app-reimburse-search-result',
  templateUrl: './reimburse-search-result.component.html',
  styleUrls: ['./reimburse-search-result.component.scss']
})
export class ReimburseSearchResultComponent implements OnInit {
  type_segment: String = 'sent'

  start: number = 0
  list_sent: any = []
  list_draft: any = []
  load_more_sent: boolean = true

  loading_spinner = false
  total_draft = 0
  total_sent = 0
  private filter: any
  getSubscribe: Subscription
  constructor(
    private router: Router,
    private reimburseService: ReimburseService,
    private storageService: StorageService
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      let d = new Date()
      this.filter = this.router.getCurrentNavigation().extras.state.filter
      console.log(this.filter)
    }
  }

  ngOnInit() {
    if (this.filter == undefined) {
      location.replace('/reimburse')
      return false
    } else {
      // this.filter.tgl_berangkat = this.filter.tgl_berangkat.substr(0, 10)
      // this.filter.tgl_kirim = this.filter.tgl_kirim.substr(0, 10)
      this.getDataDraft()
    }
  }
  segmentChanged(type) {
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
  getDataDraft() {
    let helper = new Helper()
    this.storageService.getDraft('reimburse_draft', v => {
      if (v != null) {
        let arr: any = []
        arr = v
        if (arr.length != 0) {
          this.list_draft = arr
          if (this.filter.keyword != '') {
            this.list_draft = this.filterKeyword(this.list_draft)
          }

          if (this.filter.tgl_kejadian != '') {
            this.list_draft = this.filterTglKejadian(this.list_draft)
          }

          if (this.filter.tgl_kirim != '') {
            this.list_draft = this.filterTglKirim(this.list_draft)
          }

          if (this.filter.jenis_reimburse > 0) {
            this.list_draft = this.filterJenisReimburse(this.list_draft)
          }

          if (this.filter.status != '') {
            this.list_draft = this.filterStatusDraft(this.list_draft)
          }

          this.total_draft = this.list_draft.length
        }
        this.list_draft.forEach(x => {
          let strDate = x.waktu_kejadian
          x.custom_date = strDate.substr(0, 10) + ' ' + strDate.substr(11, 8)
          x.custom_nominal = helper.convertToRupiah(x.nominal)
        })
      }
    })
  }

  getDataSent(callback = null) {
    let waktu_kirim = ''
    if (this.filter.tgl_kirim != '') {
      waktu_kirim = this.filter.tgl_kirim.substr(0, 10)
    }

    let waktu_kejadian = ''
    if (this.filter.tgl_kejadian != '') {
      waktu_kejadian = this.filter.tgl_kejadian.substr(0, 10)
    }

    let jenis_reimburse = ''
    if (this.filter.jenis_reimburse > 0) {
      jenis_reimburse = this.filter.jenis_reimburse
    }

    /* loader active */
    let helper = new Helper()
    this.loading_spinner = true
    let params: any = {
      value: this.filter.keyword,
      waktu_kejadian: waktu_kejadian,
      waktu_kirim: waktu_kirim,
      reimburse: jenis_reimburse,
      status: this.filter.status,
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

  loadMoreData() {
    this.start = this.list_sent.length
    this.getDataSent(e => {
      this.loading_spinner = false
    })
  }

  filterKeyword(arr) {
    return arr.filter(
      (item, index) =>
        item.proyek.toLowerCase().includes(this.filter.keyword.toLowerCase()) ||
        item.klien.toLowerCase().includes(this.filter.keyword.toLowerCase())
    )
  }
  filterStatusDraft(arr) {
    return arr.filter((item, index) => item.status == this.filter.status)
  }

  filterTglKejadian(arr) {
    return arr.filter((item, index) => item.waktu_kejadian.substr(0, 10) == this.filter.tgl_kejadian.substr(0, 10))
  }

  filterTglKirim(arr) {
    return arr.filter((item, index) => item.waktu_kirim.substr(0, 10) == this.filter.tgl_kirim.substr(0, 10))
  }

  filterJenisReimburse(arr) {
    return arr.filter((item, index) => item.id_jenis == this.filter.jenis_reimburse)
  }
  close() {
    this.router.navigate(['home/reimburse/search'])
  }
}
