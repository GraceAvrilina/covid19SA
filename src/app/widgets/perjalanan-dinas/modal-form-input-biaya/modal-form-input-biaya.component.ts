import { Component, OnInit, Input } from '@angular/core'
import { Platform, NavParams, ModalController, ToastController } from '@ionic/angular'
import { Helper } from '../../../helper'
import { ModalUploadBymediaPage } from '../../modal-upload-bymedia/modal-upload-bymedia.component'
import { ModalSelectUnitComponent } from '../../modal-select-unit/modal-select-unit.component'
import { ModalPrevImageComponent } from '../../modal-prev-image/modal-prev-image.component'
class Data {
  constructor(
    public keterangan: string = '',
    public jumlah: string = '',
    public unit: string = '',
    public harga_unit: string = '',
    public harga_total: string = '',
    public tanggal: string = '',
    public media: any = [],
    public list_img: any = []
  ) {}
}

@Component({
  selector: 'app-modal-form-input-biaya',
  templateUrl: './modal-form-input-biaya.component.html',
  styleUrls: ['./modal-form-input-biaya.component.scss']
})
export class ModalFormInputBiayaComponent implements OnInit {
  list_img: any = []
  list_file: any = []
  img_idx
  params = new Data()
  public eventFile: any
  public data: any
  public type: any
  public tgl_dinas: any
  public minDate: string = ''
  public maxDate: string = ''
  constructor(private navParams: NavParams, private modalCtrl: ModalController, private toastCtrl: ToastController) {}

  ngOnInit() {
    let helper = new Helper()
    console.log(this.data)
    this.minDate = this.tgl_dinas.berangkat
    this.maxDate = this.tgl_dinas.kembali
    if (this.data != null) {
      if (this.type != 'view') {
        this.params.keterangan = this.data.keterangan
        this.params.jumlah = this.data.jumlah
        this.params.harga_unit = this.data.harga_unit
        this.params.unit = this.data.unit
        this.params.harga_total = helper.tandaPemisahTitik(this.data.harga_total)
        this.params.tanggal = this.data.tanggal
        if (this.data.photo != undefined) this.list_file = this.data.photo
        this.list_img = this.data.list_img
      } else {
        this.params.keterangan = this.data.keterangan
        this.params.tanggal = this.data.tanggal
        this.params.unit = this.data.unit
        if (this.data.photo != undefined) this.list_file = this.data.photo
        this.list_img = this.data.list_img

        this.params.harga_unit = helper.tandaPemisahTitik(this.data.harga_unit)
        if (this.data.harga_unit_koreksi != null) {
          this.params.harga_unit = helper.tandaPemisahTitik(this.data.harga_unit_koreksi)
        }

        this.params.jumlah = helper.tandaPemisahTitik(this.data.jumlah)
        if (this.data.jumlah_koreksi != null) {
          this.params.jumlah = helper.tandaPemisahTitik(this.data.jumlah_koreksi)
        }

        this.params.harga_total = helper.tandaPemisahTitik(this.data.harga_total)
        if (this.data.harga_total_koreksi != null) {
          this.params.harga_total = helper.tandaPemisahTitik(this.data.harga_total_koreksi)
        }
      }
    }
  }

  public close() {
    this.modalCtrl.dismiss()
  }

  selectImg(idx) {
    if (this.img_idx == idx) {
      this.img_idx = -1
      return false
    }
    this.img_idx = idx
  }

  removeImg(idx) {
    this.list_img.splice(idx, 1)
    this.list_file.splice(idx, 1)
  }

  async presentModal() {
    const modal = await this.modalCtrl.create({
      component: ModalUploadBymediaPage
    })

    modal.onDidDismiss().then(res => {
      let event: any = res.data
      if (event != undefined) {
        let t_files = event.target.files
        if (event.target.files && event.target.files[0]) {
          let reader = new FileReader()
          reader.onload = event => {
            this.eventFile = event
            let local_file = this.eventFile.target.result

            /* preview img */
            let img_src = local_file
            this.list_img.push(img_src)
            /* img file for save file to db */
            let file_img = t_files
            console.log(this.list_file)
            this.list_file.push(file_img)
          }
          reader.readAsDataURL(t_files[0])
        }
      }
    })

    return await modal.present()
  }

  async selectUnit() {
    const modal = await this.modalCtrl.create({
      component: ModalSelectUnitComponent
    })

    modal.onDidDismiss().then(res => {
      if (res.data != undefined) {
        this.params.unit = res.data.unit
      }
    })
    return await modal.present()
  }

  onSubmit(data) {
    this.params.media = this.list_file
    this.params.list_img = this.list_img
    if (this.params.keterangan == '') {
      this.presentToast('silahkan isi keterangan')
      return false
    }
    if (this.params.jumlah == '') {
      this.presentToast('silahkan isi jumlah')
      return false
    }

    if (this.params.unit == '') {
      this.presentToast('silahkan isi unit')
      return false
    }

    if (this.params.harga_unit == '') {
      this.presentToast('silahkan isi harga per unit')
      return false
    }

    if (this.params.tanggal == '') {
      this.presentToast('silahkan isi tanggal')
      return false
    }

    if (this.list_img.length == 0) {
      this.presentToast('silahkan isi min 1 foto')
      return false
    }
    this.modalCtrl.dismiss(this.params)
  }
  calculate(value, key) {
    let helper = new Helper()
    // this.changeFormatNominal(value, key)
    let jumlah = 0
    if (this.params.jumlah != '' && this.params.jumlah != null) {
      jumlah = parseInt(
        this.params.jumlah
        // .toString()
        // .split('.')
        // .join('')
      )
    } else {
      this.params.jumlah = '0'
    }
    let harga_per_unit = 0
    if (this.params.harga_unit != '' && this.params.harga_unit != null) {
      harga_per_unit = parseInt(
        this.params.harga_unit
        // .toString()
        // .split('.')
        // .join('')
      )
    } else {
      this.params.harga_unit = '0'
    }
    let total = harga_per_unit * jumlah
    this.params.harga_total = helper.tandaPemisahTitik(total)
  }
  changeFormatNominal(value, key) {
    if (value != '') {
      var isNotNum = /^[a-zA-Z]+$/.test(value)
      if (isNotNum) {
        this.params[key] = ''
        return false
      }

      let helper = new Helper()
      if (value.indexOf('.') !== -1) {
        value = value.split('.').join('')
      }
      value = helper.tandaPemisahTitik(parseInt(value))
      this.params[key] = value
    }
  }

  async presentToast(message) {
    const toast = await this.toastCtrl.create({
      message: message,

      duration: 2000
    })
    toast.present()
  }

  async prevImage() {
    const modal = await this.modalCtrl.create({
      component: ModalPrevImageComponent,
      componentProps: { list_img: this.list_img }
    })
    return await modal.present()
  }
}
