import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { ModalFormInputBiayaComponent } from '../../widgets/perjalanan-dinas/modal-form-input-biaya/modal-form-input-biaya.component'
import { ToastController, ModalController, LoadingController } from '@ionic/angular'
import { StorageService } from '../../api/storage.service'
import { PerjalananDinasService } from '../../api/perjalanan-dinas.service'
import { Helper } from '../../helper'
import { Subscription } from 'rxjs'
@Component({
  selector: 'app-perjalanan-dinas-page',
  templateUrl: './perjalanan-dinas-page.component.html',
  styleUrls: ['./perjalanan-dinas-page.component.scss']
})
export class PerjalananDinasPageComponent implements OnInit {
  type_segment: string = 'form'
  total_draft: number = 0
  total_sent: number = 0
  list_biaya: any = []
  list_draft: any = []
  list_sent: any = []
  pemakaian: number = 0
  reload: boolean = false
  start: number = 0
  load_more_sent: boolean = true
  loading_spinner = false
  loading: any
  getSubscribe: Subscription
  tanggal_dinas: any = {
    berangkat: '',
    kembali: ''
  }
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalController: ModalController,
    private storageService: StorageService,
    private perjalananDinasService: PerjalananDinasService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.reload = this.router.getCurrentNavigation().extras.state.reload
        setTimeout(() => {
          if (this.reload) {
            this.presentLoadingWithOptions()
            this.loadData()
          }
        }, 1000)
      }
    })
  }

  ngOnInit() {
    if (this.reload == false) {
      setTimeout(() => {
        this.loadData()
      }, 2000)
    }
  }

  loadData() {
    this.list_sent = []
    this.list_draft = []

    this.getDraft()
    this.getSent(() => {
      this.loadingCtrl.dismiss()
    })
  }

  segmentChanged(type) {
    this.type_segment = type
    if (type == 'form') {
    } else if (type == 'draft') {
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
        this.list_draft = v
        this.total_draft = this.list_draft.length
      }
    })
  }

  getSent(callback = null) {
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
      if (callback != null) return callback()
    })
  }

  close() {
    this.router.navigate(['home'])
  }

  async addListItemBiaya(event) {
    if (this.tanggal_dinas.berangkat == '' || this.tanggal_dinas.kembali == '') {
      this.presentToast('Silahkan isi tanggal dinas terlebih dahulu')
      return false
    }

    let params: any = {
      type: '',
      data: null,
      tgl_dinas: this.tanggal_dinas
    }

    if (event == 'add') {
      params.type = 'add'
    }

    if (event.type == 'edit') {
      params.type = 'edit'
      params.data = event.data
    }

    if (event.type == 'delete') {
      this.pemakaian = 0
      this.removeListItem(event.data, event.index)
      this.list_biaya.forEach(x => {
        this.pemakaian = this.pemakaian + x.harga_total
      })
      return false
    }

    const modal = await this.modalController.create({
      component: ModalFormInputBiayaComponent,
      componentProps: { data: params.data, type: params.type, tgl_dinas: params.tgl_dinas }
    })

    modal.onDidDismiss().then(res => {
      if (res.data != undefined) {
        if (event.type == 'edit') {
          this.removeListItem(event.data, event.index)
        }

        let custom_tanggal = res.data.tanggal.substr(0, 10)
        let obj = {
          keterangan: res.data.keterangan,
          jumlah: this.convertNumber(res.data.jumlah),
          tanggal: res.data.tanggal,
          custom_tanggal: custom_tanggal,
          harga_unit: this.convertNumber(res.data.harga_unit),
          unit: res.data.unit,
          harga_total: this.convertNumber(res.data.harga_total),
          photo: res.data.media,
          list_img: res.data.list_img
        }
        this.list_biaya.push(obj)
      }
      this.pemakaian = 0
      this.list_biaya.forEach(x => {
        this.pemakaian = this.pemakaian + x.harga_total
      })
    })
    return await modal.present()
  }

  convertNumber(string) {
    if (typeof string != 'string') {
      return string
    }

    return parseInt(string.split('.').join(''))
  }

  searchPage() {
    this.router.navigate(['home/perjalanan-dinas/search'])
  }

  reloadForm() {
    this.list_biaya = []
    this.pemakaian = 0
    this.getDraft()
    this.getSent()
  }
  removeListItem(data, key) {
    this.list_biaya.splice(key, 1)
  }
  loadMoreData() {
    this.start = this.list_sent.length
    this.getSent()
  }
  async presentLoadingWithOptions() {
    let helper = new Helper()
    let config_loading = helper.getConfigLoading()
    this.loading = await this.loadingCtrl.create(config_loading)
    return await this.loading.present()
  }

  setTglDinas(event) {
    this.tanggal_dinas.berangkat = event.tgl_berangkat
    this.tanggal_dinas.kembali = event.tgl_kembali
  }

  async presentToast(message) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000
    })
    toast.present()
  }
}
