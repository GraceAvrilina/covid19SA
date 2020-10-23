import { Input, Component, OnChanges, Output, EventEmitter } from '@angular/core'
import {
  ActionSheetController,
  ToastController,
  LoadingController,
  AlertController,
  ModalController
} from '@ionic/angular'
import { Helper } from '../../../helper'
import { ModalSelectActivityComponent } from '../../modal-select-activity/modal-select-activity.component'
import { ModalSelectActivitynameComponent } from '../../modal-select-activityname/modal-select-activityname.component'
import { GlobalService } from '../../../api/global.service'
import { StorageService } from '../../../api/storage.service'
import { PerjalananDinasService } from '../../../api/perjalanan-dinas.service'
import { Router, NavigationExtras } from '@angular/router'
import { IonicSelectableComponent } from 'ionic-selectable'
import { Subscription } from 'rxjs'
import { ModalSearchLeaderComponent } from '../../modal-search-leader/modal-search-leader.component'

import { CalendarModal, CalendarModalOptions, DayConfig, CalendarResult } from 'ion2-calendar'

class Leader {
  public username: string
  public name: string
}

class DataModel {
  constructor(
    public aktivitas: string = '',
    public jenis_aktivitas: any = {
      is_specify_bendera: 0
    },
    public bendera_aktivitas: string = '',
    public nama_klien: string = '',
    public lokasi_dinas: string = '',
    public tanggal_berangkat: string = '',
    public tanggal_kembali: string = '',
    public str_tanggal_berangkat: string = '',
    public str_tanggal_kembali: string = ''
  ) {}
}

@Component({
  selector: 'app-form-perjalanan-dinas',
  templateUrl: './form-perjalanan-dinas.component.html',
  styleUrls: ['./form-perjalanan-dinas.component.scss']
})
export class FormPerjalananDinasComponent implements OnChanges {
  public loading: any
  public isLoading: boolean = false
  @Input() listBiaya: any = []
  @Input() pemakaian: number = 0
  @Input() oldData: any = []
  @Input() type: string = ''
  @Output() reload: EventEmitter<string> = new EventEmitter()
  @Output() addListBiaya: EventEmitter<string> = new EventEmitter()
  @Output() setTglDinas: EventEmitter<string> = new EventEmitter()

  public data = new DataModel()
  public cash_advance: string = ''
  public sisa: string = ''
  public listBendera: any = []
  public list_file: any = []
  public list_img: any = []
  leaders: Leader[]
  leader = { username: '', name: '' }
  subscription: Subscription
  config_min_date: string = ''
  minDate_report: string = ''
  public info_form: string = localStorage.getItem('info_perjalanan_dinas')
  options: CalendarModalOptions = {
    //from: startDate,
    pickMode: 'range',
    title: '',
    closeLabel: 'Kembali',
    doneLabel: 'Selesai',
    weekdays: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
  }

  constructor(
    private modalController: ModalController,
    private globalService: GlobalService,
    private storageService: StorageService,
    private perjalanDinasService: PerjalananDinasService,
    public toastController: ToastController,
    public alertCtrl: AlertController,
    private loadingController: LoadingController,
    private actionSheetController: ActionSheetController,
    private router: Router
  ) {
    this.getListBendera()
    this.list_file = []
    this.config_min_date = localStorage.getItem('backdate_perjalanan_dinas')
    let config_min_date: number = parseInt(localStorage.getItem('backdate_perjalanan_dinas'))
    config_min_date = config_min_date * -1
    let helper = new Helper()
    let d = new Date()
    let fulldate = helper.convertMinDateCustom(d, 30)
    this.minDate_report = fulldate.substr(0, 10)
  }

  ngOnChanges() {
    if (this.oldData != undefined) {
      let helper = new Helper()
      if (this.oldData.length != 0) {
        if (this.oldData.cash_advance == '') {
          this.oldData.cash_advance = '0'
        }
        if (this.type == 'draft') {
          this.data.aktivitas = this.oldData.proyek
          this.data.jenis_aktivitas = this.oldData.jenis_aktivitas
          this.data.bendera_aktivitas = this.oldData.id_bendera
          this.data.nama_klien = this.oldData.klien
          this.data.lokasi_dinas = this.oldData.lokasi
          this.data.tanggal_berangkat = this.oldData.dinas_mulai
          this.data.tanggal_kembali = this.oldData.dinas_akhir
          this.data.str_tanggal_berangkat = this.oldData.dinas_mulai.substr(0, 10)
          this.data.str_tanggal_kembali = this.oldData.dinas_akhir.substr(0, 10)

          this.options.defaultDateRange = {
            from: new Date(this.data.str_tanggal_berangkat),
            to: new Date(this.data.str_tanggal_kembali)
          }

          this.cash_advance = this.oldData.cash_advance
          this.pemakaian = helper.tandaPemisahTitik(this.pemakaian)
          this.leader = this.oldData.leader
        } else if (this.type == 'sent') {
          this.data.aktivitas = this.oldData.aktivitas
          this.data.jenis_aktivitas = this.oldData.id_jenis_activity
          this.data.bendera_aktivitas = this.oldData.id_bendera.id
          this.data.nama_klien = this.oldData.klien
          this.data.lokasi_dinas = this.oldData.lokasi
          this.data.tanggal_berangkat = this.oldData.dinas_mulai.substr(0, 10)
          this.data.tanggal_kembali = this.oldData.dinas_berakhir.substr(0, 10)
          this.cash_advance = this.oldData.cash_advance
          this.pemakaian = helper.tandaPemisahTitik(this.oldData.pemakaian)
          this.leader.name = this.oldData.pemberi_tugas.first_name
          this.leader.username = this.oldData.pemberi_tugas.user_name

          if (this.oldData.pemakaian_koreksi != null) {
            this.pemakaian = helper.tandaPemisahTitik(this.oldData.pemakaian_koreksi)
          }

          if (this.oldData.sisa_koreksi != null) {
            this.sisa = helper.tandaPemisahTitik(this.oldData.sisa_koreksi)
          }
        }
      } else {
        this.pemakaian = helper.tandaPemisahTitik(this.pemakaian)
      }
    }
    this.calculate()
  }

  getListBendera() {
    this.globalService.getListBendera().subscribe(res => {
      let response: any = res
      if (response.status) {
        this.listBendera = response.data
      }
    })
  }

  searchLeader(event: { component: IonicSelectableComponent; text: string }) {
    let text = event.text.trim().toLowerCase()
    event.component.startSearch()

    // Close any running subscription.
    if (this.subscription) {
      this.subscription.unsubscribe()
    }

    if (!text) {
      // Close any running subscription.
      if (this.subscription) {
        this.subscription.unsubscribe()
      }

      event.component.items = []
      event.component.endSearch()
      return
    }
    this.leaders = []
    let params = {
      first_name: text,
      startPage: 0,
      endPage: 10
    }
    this.subscription = this.globalService.getListLeader(params).subscribe(res => {
      if (this.subscription.closed) {
        return
      }

      let response: any = res
      if (response.status)
        response.data.forEach(v => {
          if (v.last_name == null) {
            v.last_name = ''
          }

          let obj = {
            username: v.user_name,
            name: v.first_name + v.last_name
          }
          this.leaders.push(obj)
        })

      event.component.items = this.filterLeader(this.leaders, text)
      event.component.endSearch()
    })
  }

  filterLeader(leaders: Leader[], text: string) {
    return leaders.filter(leader => {
      return leader.name.toLowerCase().indexOf(text) !== -1
    })
  }

  sent() {
    this.saveData('sent')
  }

  savetoDraft() {
    this.saveData('save_draft')
  }

  updateDraft() {
    this.saveData('update_draft')
  }

  saveData(type) {
    if (this.data.aktivitas == '') {
      this.presentToast('silahkan isi aktivitas')
      return false
    }

    if (this.data.jenis_aktivitas.id == undefined) {
      this.presentToast('silahkan isi jenis aktivitas')
      return false
    } else {
      // if (this.data.bendera_aktivitas == '' && this.data.jenis_aktivitas.is_specify_bendera == 1) {
      //   this.presentToast('silahkan isi bendera aktivitas')
      //   return false
      // }
    }

    if (this.data.nama_klien == '') {
      this.presentToast('silahkan isi nama klien')
      return false
    }

    if (this.leader.name == '') {
      this.presentToast('silahkan isi nama pemberi tugas')
      return false
    }

    if (this.data.lokasi_dinas == '') {
      this.presentToast('silahkan isi lokasi dinas')
      return false
    }

    if (this.data.tanggal_berangkat == '' || this.data.tanggal_kembali == '') {
      this.presentToast('silahkan isi tanggal berangkat dan tanggal kembali')
      return false
    }

    if (this.cash_advance == '') {
      this.cash_advance = '0'
    }

    if (this.listBiaya.length == 0) {
      this.presentToast('silahkan masukan min 1 item biaya')
      return false
    }

    let helper = new Helper()
    let now = new Date()
    let timenow = helper.convertDateCustom(now)
    let params: any = {
      id: helper.uuidv4(),
      created_by: localStorage.getItem('username'),
      proyek: this.data.aktivitas,
      id_jenis_activity: this.data.jenis_aktivitas.id,
      id_bendera: this.data.bendera_aktivitas,
      pemberi_tugas: this.leader.username,
      klien: this.data.nama_klien,
      lokasi: this.data.lokasi_dinas,
      cash_advance: parseInt(this.cash_advance),
      pemakaian: parseInt(
        this.pemakaian
          .toString()
          .split('.')
          .join('')
      ),
      sisa: parseInt(this.sisa.split('.').join('')),
      waktu_buat: '',
      waktu_update: '',
      item_pemakaian: []
      //photo: []
    }

    if (this.data.tanggal_berangkat != '' && this.data.tanggal_kembali != '') {
      if (type == 'sent') {
        let waktu_berangkat = new Date(this.data.tanggal_berangkat)
        let string_waktu_berangkat = helper.convertDateCustom(waktu_berangkat)

        let waktu_kembali = new Date(this.data.tanggal_kembali)
        let string_waktu_kembali = helper.convertDateCustom(waktu_kembali)

        params.dinas_mulai = string_waktu_berangkat.substr(0, 10)
        params.dinas_akhir = string_waktu_kembali.substr(0, 10)
      } else {
        let waktu_berangkat = new Date(this.data.tanggal_berangkat)
        params.dinas_mulai = waktu_berangkat
        let waktu_tiba = new Date(this.data.tanggal_kembali)
        params.dinas_akhir = waktu_tiba
      }
    }

    params.waktu_buat = timenow
    params.waktu_update = timenow
    if (type == 'sent') {
      let formData: FormData = new FormData()
      this.list_file = []
      this.listBiaya.forEach(x => {
        let obj = {
          harga_unit: x.harga_unit,
          jumlah: x.jumlah,
          keterangan: x.keterangan,
          tanggal: x.custom_tanggal,
          harga_total: x.harga_total,
          unit: x.unit,
          jml_foto: x.list_img.length
        }
        params.item_pemakaian.push(obj)
        if (x.list_img != undefined) {
          x.list_img.forEach(v => {
            let file_blob = helper.dataURItoBlob(v)
            this.list_file.push(file_blob)
          })
        }

        this.list_file.forEach(files => {
          if (files != undefined) {
            let fileList: FileList = files
            if (fileList.length > 0) {
              let file: File = fileList[0]
              formData.append('photo[]', file, file.name)
            } else {
              formData.append('photo[]', files)
            }
          }
        })
        /* save img to localb */
        x.list_img.forEach(imgUrl => {
          this.list_img.push(imgUrl)
        })
      })

      let i = 0
      while (i < Object.keys(params).length) {
        let keys = Object.keys(params)[i]
        let value = params[keys]
        if (value != null) {
          if (keys == 'item_pemakaian') {
            formData.append(keys, JSON.stringify(value))
          } else {
            formData.append(keys, value)
          }
        }
        i++
      }
      this.presentLoadingWithOptions()
      this.perjalanDinasService.saveData(formData).subscribe(
        res => {
          this.loadingController.dismiss()
          let resp: any = res
          if (resp.status) {
            this.presentToast('Perjalanan dinas berhasil disimpan')
            this.clearForm()
            if (this.oldData.id != undefined) {
              this.deleteDataDraft(false)
              this.directToHomeMenu(true)
            }
          } else {
            this.presentToast(resp.message)
          }
        },
        err => {
          this.loading.dismiss()
          this.presentToast('Error')
        }
      )
    } else if (type == 'save_draft') {
      this.listBiaya.forEach(x => {
        let obj = {
          harga_unit: x.harga_unit,
          jumlah: x.jumlah,
          keterangan: x.keterangan,
          tanggal: x.custom_tanggal,
          harga_total: x.harga_total,
          unit: x.unit,
          list_img: x.list_img
        }

        params.item_pemakaian.push(obj)
        /* save img to localb */
      })

      let obj = []
      let d = new Date()
      params.jenis_aktivitas = this.data.jenis_aktivitas
      params.id = d.getTime()
      params.media = this.list_img
      params.leader = this.leader

      let nama_bendera = ''
      this.listBendera.forEach(bendera => {
        if (bendera.id == this.data.bendera_aktivitas) nama_bendera = bendera.name
      })
      params.nama_bendera = nama_bendera

      this.storageService.getDraft('perjalan_dinas', v => {
        if (v != undefined) {
          v.forEach(element => {
            obj.push(element)
          })
        }
        obj.push(params)
        this.storageService.saveDraft('perjalan_dinas', obj, () => {
          this.presentToast('simpan berhasil')
          this.clearForm()
          this.reload.emit()
        })
      })
    } else if (type == 'update_draft') {
      this.listBiaya.forEach(x => {
        let obj = {
          harga_unit: x.harga_unit,
          jumlah: x.jumlah,
          keterangan: x.keterangan,
          tanggal: x.tanggal,
          harga_total: x.harga_total,
          unit: x.unit,
          list_img: x.list_img
        }
        params.item_pemakaian.push(obj)
        /* save img to localb */
      })

      let obj = []
      params.jenis_aktivitas = this.data.jenis_aktivitas
      params.id = this.oldData.id
      params.media = this.list_img
      params.leader = this.leader
      let nama_bendera = ''
      this.listBendera.forEach(bendera => {
        if (bendera.id == this.data.bendera_aktivitas) nama_bendera = bendera.name
      })
      params.nama_bendera = nama_bendera

      this.storageService.getDraft('perjalan_dinas', v => {
        if (v != undefined) {
          v.forEach(element => {
            if (element.id == params.id) {
              element = params
            }
            obj.push(element)
          })
        }

        this.storageService.saveDraft('perjalan_dinas', obj, () => {
          this.presentToast('simpan berhasil')
          this.directToHomeMenu(true)
        })
      })
    }
  }

  deleteDataDraft(direct) {
    let obj = []
    this.storageService.getDraft('perjalan_dinas', v => {
      if (v != undefined) {
        v.forEach(element => {
          if (element.id != this.oldData.id) {
            obj.push(element)
          }
        })
      }
      this.storageService.saveDraft('perjalan_dinas', obj, () => {
        if (direct) {
          this.presentToast('draft berhasil dihapus')
          this.directToHomeMenu(true)
        }
      })
    })
  }

  directToHomeMenu(reload) {
    this.clearForm()
    setTimeout(() => {
      let navigationExtras: NavigationExtras = {
        state: {
          reload: reload
        }
      }
      this.router.navigate(['home/perjalanan-dinas'], navigationExtras)
    }, 1000)
  }

  clearForm() {
    this.data = new DataModel()
    this.cash_advance = ''
    this.pemakaian = 0
    this.sisa = ''
    this.reload.emit()
  }

  calculate() {
    let cash_advance = ''
    if (this.cash_advance == '' || this.cash_advance == null) {
      this.cash_advance = ''
    }
    cash_advance = this.cash_advance
    this.pemakaian = this.changeFormatNominal(this.pemakaian)
    let helper = new Helper()

    let pemakaian = '0'
    // if (this.cash_advance != undefined) {
    //   if (this.cash_advance != '') cash_advance = this.cash_advance.split('.').join('')
    // }

    if (this.pemakaian != undefined) {
      pemakaian = this.pemakaian
        .toString()
        .split('.')
        .join('')
    }
    let sisa = 0
    if (this.cash_advance != '' && this.cash_advance != null) {
      sisa = parseInt(cash_advance) - parseInt(pemakaian)
    } else {
      sisa = 0 - parseInt(pemakaian)
    }
    this.sisa = helper.tandaPemisahTitik(sisa)
  }

  changeFormatNominal(value) {
    let helper = new Helper()
    if (value != '') {
      if (value.indexOf('.') !== -1) {
        value = value.split('.').join('')
      }
      value = helper.tandaPemisahTitik(parseInt(value))
      return value
    }
  }

  ActionSheet(data, type, idx) {
    let params: any = {
      data: data,
      type: type,
      index: idx,
      tgl_dinas: {
        berangkat: this.data.tanggal_berangkat,
        kembali: this.data.tanggal_kembali
      }
    }
    this.addListBiaya.emit(params)
  }

  async presentActionSheet(data, idx) {
    if (this.type == 'sent') {
      if (data.harga_total_koreksi != null || data.harga_unit_koreksi != null) {
        if (data.harga_total_koreksi == null) {
          this.ActionSheet(data, 'view', idx)
        } else {
          this.alertInfoItemBiaya(data, idx)
        }
      } else {
        this.ActionSheet(data, 'view', idx)
      }
      return false
    }
    const actionSheet = await this.actionSheetController.create({
      header: data.keterangan,
      buttons: [
        {
          text: 'Ubah',

          handler: () => {
            this.ActionSheet(data, 'edit', idx)
          }
        },
        {
          text: 'Hapus',
          role: 'destructive',
          handler: () => {
            this.ActionSheet(data, 'delete', idx)
          }
        }
      ]
    })
    await actionSheet.present()
  }

  async searchActivityName() {
    if (this.type == 'sent') {
      return false
    }
    const modal = await this.modalController.create({
      component: ModalSelectActivitynameComponent,
      componentProps: { type: '' }
    })

    modal.onDidDismiss().then(res => {
      if (res.data != undefined) {
        this.data.aktivitas = res.data.proyek
      }
    })
    return await modal.present()
  }

  async searchTypeActivity() {
    if (this.type == 'sent') {
      return false
    }
    const modal = await this.modalController.create({
      component: ModalSelectActivityComponent
    })

    modal.onDidDismiss().then(res => {
      if (res.data != undefined) {
        this.data.jenis_aktivitas = res.data
        if (this.data.jenis_aktivitas.is_specify_bendera == 0) {
          this.data.bendera_aktivitas = ''
        }
      }
    })
    return await modal.present()
  }

  async presentLoadingWithOptions() {
    let helper = new Helper()
    let config_loading = helper.getConfigLoading()
    this.loading = await this.loadingController.create(config_loading)
    return await this.loading.present()
  }

  async presentToast(message) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    })
    toast.present()
  }

  async alertInfoItemBiaya(data, idx) {
    let helper = new Helper()
    let header = 'Koreksi Nominal Pemakaian'
    let message =
      'Item pemakaian ini telah dikoreksi dengan data sebagai berikut <br> Jumlah Awal : <span class="red-label">' +
      data.jumlah +
      '</span><br>Jumlah Koreksi: ' +
      data.jumlah_koreksi +
      '<br>Harga perunit awal : <span class="red-label">' +
      helper.convertToRupiah(data.harga_unit) +
      '</span><br> Harga Unit Koreksi: ' +
      helper.convertToRupiah(data.harga_unit_koreksi) +
      '<br> Harga Total Awal: <span class="red-label">' +
      helper.convertToRupiah(data.harga_total) +
      '</span><br> Harga Total Koreksi: ' +
      helper.convertToRupiah(data.harga_total_koreksi) +
      '<br> Alasan Koreksi :' +
      data.alasan_koreksi

    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'OK',
          handler: res => {
            this.ActionSheet(data, 'view', idx)
          }
        }
      ]
    })
    await alert.present()
  }

  dateChange() {
    if (this.data.tanggal_berangkat != '' && this.data.tanggal_kembali != '') {
      let tgl_berangkat = new Date(this.data.tanggal_berangkat.substr(0, 10))
      let tgl_kembali = new Date(this.data.tanggal_kembali.substr(0, 10))
      if (tgl_kembali < tgl_berangkat) {
        this.data.tanggal_kembali = this.data.tanggal_berangkat
      }
    }
    let obj: any = { tgl_berangkat: this.data.tanggal_berangkat, tgl_kembali: this.data.tanggal_kembali }
    this.setTglDinas.emit(obj)
  }

  async showModalLeader() {
    if (this.type == 'sent') {
      return false
    }
    const modal = await this.modalController.create({
      component: ModalSearchLeaderComponent
    })

    modal.onDidDismiss().then(res => {
      if (res.data != undefined) {
        this.leader.username = res.data.user_name
        this.leader.name = res.data.first_name
      }
    })
    return await modal.present()
  }

  async openCalendar() {
    let startDate = new Date(this.minDate_report)
    this.options.from = startDate
    const myCalendar = await this.modalController.create({
      component: CalendarModal,
      componentProps: { options: this.options }
    })

    myCalendar.present()

    const event: any = await myCalendar.onDidDismiss()
    const date = event.data

    if (date != null) {
      const from: CalendarResult = date.from
      const to: CalendarResult = date.to
      let date_from = new Date(from.string)
      let date_to = new Date(to.string)

      this.data.tanggal_berangkat = date_from.toISOString()
      this.data.tanggal_kembali = date_to.toISOString()

      let helper = new Helper()
      this.data.str_tanggal_berangkat = from.string
      this.data.str_tanggal_kembali = to.string

      this.options.defaultDateRange = { from: date_from, to: date_to }
      let obj: any = { tgl_berangkat: this.data.tanggal_berangkat, tgl_kembali: this.data.tanggal_kembali }
      this.setTglDinas.emit(obj)
    }
  }
}
