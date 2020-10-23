import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { NavController, LoadingController } from '@ionic/angular'
import { StorageService } from '../../api/storage.service'
import { PerjalananDinasService } from '../../api/perjalanan-dinas.service'
import { Subscription } from 'rxjs'
@Component({
  selector: 'app-search-detail-pd-page',
  templateUrl: './search-detail-pd-page.component.html',
  styleUrls: ['./search-detail-pd-page.component.scss']
})
export class SearchDetailPdPageComponent implements OnInit {
  type_segment: string = 'sent'
  total_draft: number = 0
  total_sent: number = 0
  list_biaya: any = []
  list_draft: any = []
  list_sent: any = []
  pemakaian: number = 0
  reload: boolean = true
  start: number = 0
  load_more_sent: boolean = true
  loading_spinner = false
  loading: any
  filter: any = null
  getSubscribe: Subscription
  constructor(
    private perjalananDinasService: PerjalananDinasService,
    private storageService: StorageService,
    private router: Router,
    private navCtrl: NavController
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      let d = new Date()
      this.filter = this.router.getCurrentNavigation().extras.state.filter
    }
  }

  ngOnInit() {
    if (this.filter == null) location.replace('home/perjalanan-dinas/search')
    this.getDraft()
  }

  segmentChanged(type) {
    this.type_segment = type
    if (type == 'draft') {
      this.getDraft()
    } else if (type == 'sent') {
      this.list_sent = []
      this.start = 0
      this.load_more_sent = true
      this.getSent()
    }
  }

  getDraft() {
    this.storageService.getDraft('perjalan_dinas', v => {
      if (v != null) {
        let arr: any = []
        arr = v
        if (arr.length != 0) {
          this.list_draft = arr

          if (this.filter.keyword != '') {
            this.list_draft = this.filterKeyword(this.list_draft)
          }

          if (this.filter.id_jenis != '') {
            this.list_draft = this.filterAktivitas(this.list_draft)
          }

          if (this.filter.id_bendera != '') {
            this.list_draft = this.filterBendera(this.list_draft)
          }

          if (this.filter.tgl_dinas != '') this.list_draft = this.filterTanggalDinas(this.list_draft)
          this.total_draft = this.list_draft.length
        }
      }
    })
  }

  getSent() {
    let params: any = {
      value: this.filter.keyword,
      tanggal_dinas: this.filter.tgl_dinas,
      status: this.filter.status,
      jenis_aktifitas: this.filter.id_jenis,
      bendera_aktifitas: this.filter.id_bendera,
      created_by: localStorage.getItem('username'),
      startPage: this.start,
      endPage: 10,
      time: 'iso'
    }

    this.loading_spinner = true

    if (this.getSubscribe) this.getSubscribe.unsubscribe()
    this.getSubscribe = this.perjalananDinasService.getListDinas(params).subscribe(res => {
      this.loading_spinner = false
      let resp: any = res
      if (resp.data.length != 0) {
        this.total_sent = resp.totalData
        resp.data.forEach(v => {
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
      } else {
        this.load_more_sent = false
      }
    })
  }

  close() {
    this.navCtrl.pop()
  }

  loadMoreData() {
    this.start = this.list_sent.length
    this.getSent()
  }

  filterKeyword(arr) {
    return arr.filter(
      (item, index) =>
        item.proyek.toLowerCase().includes(this.filter.keyword.toLowerCase()) ||
        item.klien.toLowerCase().includes(this.filter.keyword.toLowerCase())
    )
  }

  filterAktivitas(arr) {
    return arr.filter((item, index) => item.id_jenis_activity == this.filter.id_jenis)
  }

  filterBendera(arr) {
    return arr.filter((item, index) => item.id_bendera == this.filter.id_bendera)
  }

  filterTanggalDinas(arr) {
    let res = arr.filter((item, index) => {
      let tgl_berangkat = new Date(item.dinas_mulai.substr(0, 10))
      let tgl_pulang = new Date(item.dinas_akhir.substr(0, 10))
      let filter_tgl = new Date(this.filter.tgl_dinas.substr(0, 10))
      if (tgl_berangkat >= filter_tgl && tgl_pulang <= filter_tgl) return arr
    })
    return res
  }
}
