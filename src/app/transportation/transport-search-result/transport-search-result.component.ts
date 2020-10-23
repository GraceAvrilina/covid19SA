import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { Helper } from '../../helper'
import { TransportationService } from '../../api/transportation.service'
import { StorageService } from '../../api/storage.service'
import { Subscription } from 'rxjs'
@Component({
  selector: 'app-transport-search-result',
  templateUrl: './transport-search-result.component.html',
  styleUrls: ['./transport-search-result.component.scss']
})
export class TransportSearchResultComponent implements OnInit {
  type_segment: String = 'sent'

  start: number = 0
  list_sent: any = []
  list_draft: any = []
  load_more_sent: boolean = true

  loading_spinner = false
  total_draft = 0
  total_sent = 0
  getSubscribe: Subscription
  private filter: any
  constructor(
    private router: Router,
    private transportService: TransportationService,
    private storageService: StorageService
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      let d = new Date()
      this.filter = this.router.getCurrentNavigation().extras.state.filter
    }
  }

  ngOnInit() {
    if (this.filter == undefined) {
      location.replace('home')
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

  getDataSent(callback = null) {
    let helper = new Helper()
    this.loading_spinner = true

    let tgl_kirim = ''
    if (this.filter.tgl_kirim != '') {
      tgl_kirim = this.filter.tgl_kirim.substr(0, 10)
    }

    let waktu_mulai = ''
    if (this.filter.tgl_berangkat != '') {
      waktu_mulai = this.filter.tgl_berangkat.substr(0, 10)
    }

    let jenis_transport = ''
    if (this.filter.jenis_transport > 0) {
      jenis_transport = this.filter.jenis_transport
    }

    let params: any = {
      value: this.filter.keyword,
      waktu_kirim: tgl_kirim,
      waktu_mulai: waktu_mulai,
      pembayaran: this.filter.jenis_bayar,
      transportasi: jenis_transport,
      status: this.filter.status,
      created_by: localStorage.getItem('username'),
      startPage: this.start,
      endPage: 10,
      time: 'iso'
    }
    if (this.getSubscribe) this.getSubscribe.unsubscribe()
    this.getSubscribe = this.transportService.getListTransport(params).subscribe(res => {
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
          }
          this.list_sent.push(v)
        })
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

  getDataDraft() {
    let helper = new Helper()
    this.storageService.getDraft('transport_draft', v => {
      if (v != null) {
        let arr: any = []
        arr = v
        if (arr.length != 0) {
          // this.list_draft.filter(function(item) {
          //   return item.status == this.filter.status
          // })
          this.list_draft = arr
          if (this.filter.keyword != '') {
            this.list_draft = this.filterKeyword(this.list_draft)
          }

          if (this.filter.tgl_berangkat != '') {
            this.list_draft = this.filterTglBerangkat(this.list_draft)
          }

          if (this.filter.tgl_kirim != '') {
            this.list_draft = this.filterTglBuat(this.list_draft)
          }

          if (this.filter.jenis_bayar != '') {
            this.list_draft = this.filterJenisBayar(this.list_draft)
          }

          if (this.filter.jenis_transport > 0) {
            this.list_draft = this.filterJenisTransport(this.list_draft)
          }

          if (this.filter.status != '') {
            this.list_draft = this.filterStatusDraft(this.list_draft)
          }
          this.total_draft = this.list_draft.length
        }

        this.list_draft.forEach(x => {
          let strDate = x.waktu_buat
          x.custom_date = strDate.substr(0, 10)
          x.custom_nominal = helper.convertToRupiah(x.nominal)
        })
      }
      console.log(this.list_draft)
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

  filterTglBerangkat(arr) {
    return arr.filter((item, index) => item.waktu_mulai.substr(0, 10) == this.filter.tgl_berangkat.substr(0, 10))
  }

  filterTglBuat(arr) {
    return arr.filter((item, index) => item.waktu_buat.substr(0, 10) == this.filter.tgl_kirim.substr(0, 10))
  }

  filterJenisBayar(arr) {
    return arr.filter((item, index) => item.jenis_bayar == this.filter.jenis_bayar)
  }

  filterJenisTransport(arr) {
    return arr.filter((item, index) => item.id_jenis == this.filter.jenis_transport)
  }

  close() {
    this.router.navigate(['home/transportation/search'])
  }
}
