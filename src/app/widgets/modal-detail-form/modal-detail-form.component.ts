import { Component, Input } from '@angular/core'
import { Platform, NavParams, ModalController } from '@ionic/angular'
import { AlertController, LoadingController } from '@ionic/angular'
import { GlobalService } from '../../api/global.service'

import { Helper } from '../../helper'
import { ModalPrevImageComponent } from '../../widgets/modal-prev-image/modal-prev-image.component'
@Component({
  selector: 'app-modal-detail-form',
  templateUrl: './modal-detail-form.component.html',
  styleUrls: ['./modal-detail-form.component.scss']
})
export class ModalDetailFormComponent {
  @Input() data: any
  loading: any
  constructor(
    navParams: NavParams,
    private platform: Platform,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private globalService: GlobalService
  ) {}

  close() {
    this.modalCtrl.dismiss({ reload: false })
  }

  changeStatus(status) {
    let formData = new FormData()
    formData.append('id', this.data.id)
    formData.append('status', status)
    formData.append('type', this.data.type)
    this.confirmApproval(status, formData)
  }

  saveStatus(formData, data) {
    this.presentLoadingWithOptions()
    this.globalService.changeStatus(formData).subscribe(res => {
      let resp: any = res
      if (resp.status) {
        this.alertCorrectionResult(data)
      }
      this.loadingCtrl.dismiss()
      this.modalCtrl.dismiss({ reload: true })
    })
  }

  async confirmApproval(status, formData) {
    let type = this.jsUcfirst(this.data.type)
    let header = 'Setujui ' + type
    let message =
      'Apakah anda yakin akan menyetujui ' +
      this.data.type +
      ' ini ? <br><div class="warning-alert"><span class="red-font">*</span> abaikan jika tidak ada koreksi</div>'
    let input: any = [
      {
        name: 'nominal_correction',
        type: 'number',
        placeholder: 'nominal yang dikoreksi'
      },
      {
        name: 'keterangan',
        type: 'text',
        value: '',
        placeholder: 'keterangan'
      }
    ]

    if (status == 'rejected') {
      header = 'Tolak ' + type
      input = []
      message = 'Apakah anda yakin akan menolak ' + this.data.type + ' ini ?'
    }

    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      inputs: input,
      buttons: [
        {
          text: 'Tidak',
          role: 'cancel',
          cssClass: 'secondary',
          handler: blah => {
            console.log('Confirm Cancel: blah')
          }
        },
        {
          text: 'Ya',
          handler: data => {
            if (data != undefined) {
              formData.append('alasan_koreksi', data.keterangan)
              formData.append('nominal_koreksi', data.nominal_correction)
            } else {
              formData.append('alasan_koreksi', '')
              formData.append('nominal_koreksi', '')
            }
            this.saveStatus(formData, data)
          }
        }
      ]
    })

    await alert.present()
  }

  jsUcfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  async presentLoadingWithOptions() {
    let helper = new Helper()
    let config_loading = helper.getConfigLoading()
    this.loading = await this.loadingCtrl.create(config_loading)
    return await this.loading.present()
  }

  async alertCorrectionResult(data) {
    let type = this.data.type
    let helper = new Helper()
    let title = 'Transportasi'
    if (type == 'reimburse') title = 'Reimburse'

    let message =
      'Laporan ' +
      this.data.type +
      ' ini telah dikoreksi dengan data sebagai berikut <br> Nominal Awal : <span style="color: red;text-decoration: line-through">' +
      helper.convertToRupiah(this.data.nominal) +
      '</span><br>Nominal Koreksi: <span>' +
      helper.convertToRupiah(data.nominal_correction) +
      '</span><br>Alasan Koreksi: ' +
      data.keterangan
    const alert = await this.alertCtrl.create({
      header: 'Koreksi Nominal ' + title,
      message: message,
      buttons: [
        {
          text: 'OK',
          role: 'cancel',
          cssClass: 'secondary',
          handler: blah => {
            this.modalCtrl.dismiss({ reload: true })
          }
        }
      ]
    })
    await alert.present()
  }

  async prevImage() {
    const modal = await this.modalCtrl.create({
      component: ModalPrevImageComponent,
      componentProps: { list_img: this.data.photo }
    })
    return await modal.present()
  }
}
