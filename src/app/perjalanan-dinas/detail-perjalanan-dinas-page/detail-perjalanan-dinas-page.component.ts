import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { ModalFormInputBiayaComponent } from '../../widgets/perjalanan-dinas/modal-form-input-biaya/modal-form-input-biaya.component'
import { AlertController, ToastController, ModalController, NavController } from '@ionic/angular'
import { Helper } from './../../helper'
@Component({
  selector: 'app-detail-perjalanan-dinas-page',
  templateUrl: './detail-perjalanan-dinas-page.component.html',
  styleUrls: ['./detail-perjalanan-dinas-page.component.scss']
})
export class DetailPerjalananDinasPageComponent implements OnInit {
  data: any
  type: string = ''
  pemakaian: number = 0
  list_biaya: any = []
  tanggal_dinas: any = {
    berangkat: '',
    kembali: ''
  }
  alert: any
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalController: ModalController,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
    private alertController: AlertController
  ) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.data = this.router.getCurrentNavigation().extras.state.data

        this.type = this.router.getCurrentNavigation().extras.state.type
        if (this.type == 'draft') {
          this.data.item_pemakaian.map(v => {
            v.custom_tanggal = v.tanggal
          })
        } else if (this.type == 'sent') {
        }
      }
    })
  }

  ngOnInit() {
    if (this.data == undefined) {
      location.replace('home/perjalanan-dinas')
      return false
    }
    this.tanggal_dinas.berangkat = this.data.dinas_mulai
    this.tanggal_dinas.kembali = this.data.dinas_akhir
    if (this.type == 'draft') {
      this.list_biaya = this.data.item_pemakaian
    } else {
      this.list_biaya = []
      this.data.dinas_item.forEach(v => {
        let obj = {
          custom_tanggal: v.tanggal_dinas.substr(0, 10),
          harga_unit: v.harga_unit,
          harga_unit_koreksi: v.harga_unit_koreksi,
          jumlah: v.jumlah,
          jumlah_koreksi: v.jumlah_koreksi,
          keterangan: v.keterangan,
          list_img: v.photo,
          photo: [],
          tanggal: v.tanggal_dinas.substr(0, 10),
          harga_total: v.harga_total,
          harga_total_koreksi: v.harga_total_koreksi,
          unit: v.unit,
          unit_koreksi: v.unit_koreksi,
          alasan_koreksi: v.alasan_koreksi
        }
        this.list_biaya.push(obj)
      })

      // helper.convertToRupiah(v.nominal)
      if (
        (this.data.pemakaian != this.data.pemakaian_koreksi && this.data.pemakaian_koreksi != null) ||
        (this.data.sisa != this.data.sisa_koreksi && this.data.sisa_koreksi != null)
      ) {
        this.alertCorrection()
      }
    }
    this.pemakaian = this.data.pemakaian
  }

  close() {
    this.navCtrl.pop()
  }

  async addListItemBiaya(event) {
    if (this.tanggal_dinas.berangkat == '' || this.tanggal_dinas.kembali == '') {
      alert('Silahkan isi tanggal dinas terlebih dahulu')
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

    if (event.type == 'view') {
      params.type = 'view'
      params.data = event.data
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

  reloadForm() {
    this.list_biaya = []
    this.pemakaian = 0
  }
  removeListItem(data, key) {
    this.list_biaya.splice(key, 1)
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

  async alertCorrection() {
    let helper = new Helper()

    this.alert = await this.alertController.create({
      header: 'Koreksi Nominal Perjalanan Dinas',
      message:
        '<div>Laporan perjalanan dinas ini telah dikoreksi dengan data sebagai berikut </div><br> Pemakaian Awal: <span class="red-label">' +
        helper.convertToRupiah(this.data.pemakaian) +
        '</span><br> Pemakaian Koreksi : ' +
        helper.convertToRupiah(this.data.pemakaian_koreksi) +
        '<br> Sisa Awal : <span class="red-label">' +
        helper.convertToRupiah(this.data.sisa) +
        '</span>' +
        '<br> Sisa Koreksi : ' +
        helper.convertToRupiah(this.data.sisa_koreksi) +
        '<br>' +
        '<br>' +
        'Klik setiap item pemakaian untuk melihat detail koreksi : ',
      buttons: ['OK']
    })

    await this.alert.present()
  }
}
